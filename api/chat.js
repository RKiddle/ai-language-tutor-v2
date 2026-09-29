import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import http from 'http';
import { getScenario } from '../scenarios.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/chat' });

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Session storage for WebSocket connections
const sessions = new Map();

// ============================================================================
// WebSocket Error Logging
// ============================================================================

wss.on('error', (error) => {
  console.error('[WebSocket Server Error]:', error);
});

// ============================================================================
// REST API (Backward compatibility)
// ============================================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Chat endpoint - proxy to Gemini (REST)
app.post('/api/chat', async (req, res) => {
  try {
    const { scenario, initialize, contents } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'API key not configured on server',
        details: 'GEMINI_API_KEY environment variable is missing'
      });
    }

    // Handle scenario initialization
    if (initialize && scenario) {
      const scenarioData = getScenario(scenario);
      
      if (!scenarioData) {
        return res.status(400).json({
          error: 'Invalid scenario',
          details: `Scenario "${scenario}" not found`
        });
      }

      // Initialize conversation with system prompt
      const initContents = [
        {
          role: 'user',
          parts: [{ text: scenarioData.prompt }]
        }
      ];

      // Call Gemini with initialization
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: initContents })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return handleGeminiError(data, res);
      }

      return res.json(data);
    }

    // Handle regular chat messages
    if (!contents || !Array.isArray(contents)) {
      return res.status(400).json({
        error: 'Invalid request',
        details: 'Missing or invalid "contents" field'
      });
    }

    // Log incoming request for debugging
    console.log('Incoming chat request:', {
      contentsLength: contents.length,
      lastTurn: contents[contents.length - 1]?.role,
      fullContents: JSON.stringify(contents, null, 2).substring(0, 500)
    });

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return handleGeminiError(data, res);
    }

    // Success response
    res.json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: 'Server error',
      details: error.message || 'An unexpected error occurred'
    });
  }
});

// Helper function to handle Gemini API errors
function handleGeminiError(data, res) {
  if (data.error?.code === 400 || data.error?.code === 403) {
    return res.status(401).json({
      error: 'Invalid or expired API key',
      details: data.error?.message || 'Authentication failed'
    });
  }
  
  if (data.error?.code === 429) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      details: 'Too many requests. Please wait a moment and try again.'
    });
  }

  return res.status(data.error?.code || 500).json({
    error: 'Gemini API error',
    details: data.error?.message || 'Unknown error occurred'
  });
}

// ============================================================================
// WebSocket Handler (Streaming TTS + Text)
// ============================================================================

wss.on('connection', (ws) => {
  const sessionId = generateSessionId();
  const session = {
    id: sessionId,
    conversationHistory: [],
    textBuffer: '',
    ttsQueue: [],
    isProcessing: false
  };

  sessions.set(sessionId, session);
  console.log(`[WebSocket] Client connected: ${sessionId}`);

  // Send session ID to client
  ws.send(JSON.stringify({ type: 'session', sessionId }));

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'init') {
        handleInitMessage(ws, session, data);
      } else if (data.type === 'chat') {
        handleChatMessage(ws, session, data);
      }
    } catch (error) {
      console.error('[WebSocket] Message error:', error);
      ws.send(JSON.stringify({ 
        type: 'error', 
        stage: 'parse',
        message: error.message 
      }));
    }
  });

  ws.on('close', () => {
    sessions.delete(sessionId);
    console.log(`[WebSocket] Client disconnected: ${sessionId}`);
  });

  ws.on('error', (error) => {
    console.error(`[WebSocket] Error for ${sessionId}:`, error);
  });
});

// ============================================================================
// WebSocket Message Handlers
// ============================================================================

async function handleInitMessage(ws, session, data) {
  const { scenario } = data;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return ws.send(JSON.stringify({
      type: 'error',
      stage: 'init',
      message: 'API key not configured'
    }));
  }

  const scenarioData = getScenario(scenario);
  if (!scenarioData) {
    return ws.send(JSON.stringify({
      type: 'error',
      stage: 'init',
      message: `Scenario "${scenario}" not found`
    }));
  }

  try {
    // Initialize conversation with system prompt
    const initContents = [
      {
        role: 'user',
        parts: [{ text: scenarioData.prompt }]
      }
    ];

    // Stream response from Gemini
    await streamGeminiResponse(ws, session, initContents, scenarioData, apiKey, true);
  } catch (error) {
    console.error('[WebSocket] Init error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      stage: 'init',
      message: error.message
    }));
  }
}

async function handleChatMessage(ws, session, data) {
  const { message } = data;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return ws.send(JSON.stringify({
      type: 'error',
      stage: 'chat',
      message: 'API key not configured'
    }));
  }

  if (!message) {
    return ws.send(JSON.stringify({
      type: 'error',
      stage: 'chat',
      message: 'Message content is required'
    }));
  }

  try {
    // Add user message to history
    session.conversationHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Stream response from Gemini
    await streamGeminiResponse(ws, session, session.conversationHistory, null, apiKey, false);
  } catch (error) {
    console.error('[WebSocket] Chat error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      stage: 'chat',
      message: error.message
    }));
  }
}

// ============================================================================
// Gemini Streaming & TTS
// ============================================================================

async function streamGeminiResponse(ws, session, contents, scenarioData, apiKey, isInit) {
  if (ws.readyState !== 1) return; // WebSocket not open

  try {
    // Call Gemini streaming endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:streamGenerateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
    }

    // Read entire response as text
    const responseText = await response.text();
    
    // Parse JSON response
    const jsonResponse = JSON.parse(responseText);
    
    // Handle array response format [{ candidates: [...] }]
    const responseData = Array.isArray(jsonResponse) ? jsonResponse[0] : jsonResponse;
    
    // Extract text from candidates
    let fullText = '';
    if (responseData.candidates && responseData.candidates.length > 0) {
      const candidate = responseData.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        fullText = candidate.content.parts[0].text || '';
      }
    }

    if (fullText) {
      // Send text in chunks (simulate streaming for better UX)
      const chunkSize = Math.max(1, Math.floor(fullText.length / 5)); // Split into ~5 chunks
      let sentText = '';
      
      for (let i = 0; i < fullText.length; i += chunkSize) {
        const chunk = fullText.substring(i, Math.min(i + chunkSize, fullText.length));
        sentText += chunk;
        
        // Send text chunk to client
        ws.send(JSON.stringify({
          type: 'text',
          content: chunk,
          timestamp: Date.now()
        }));

        // Small delay for simulated streaming
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Add to session history if not init message
      if (!isInit && session.conversationHistory.length > 0) {
        const lastMsg = session.conversationHistory[session.conversationHistory.length - 1];
        if (lastMsg.role === 'model') {
          lastMsg.parts[0].text += fullText;
        } else {
          session.conversationHistory.push({
            role: 'model',
            parts: [{ text: fullText }]
          });
        }
      } else if (isInit) {
        // Store init response in history
        session.conversationHistory.push({
          role: 'model',
          parts: [{ text: fullText }]
        });
      }
    }

    // Send completion signal
    ws.send(JSON.stringify({
      type: 'complete',
      timestamp: Date.now()
    }));

  } catch (error) {
    console.error('[Streaming] Error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      stage: 'streaming',
      message: error.message
    }));
  }
}

// ============================================================================
// Gemini TTS Streaming (Placeholder)
// ============================================================================

async function generateAndStreamTTS(ws, textContent, apiKey) {
  if (!textContent.trim() || ws.readyState !== 1) return;

  try {
    console.log(`[TTS] Text queued for audio: "${textContent.substring(0, 50)}..."`);
    
    // Send TTS notification to client
    // Client will use browser Speech Synthesis for now
    ws.send(JSON.stringify({
      type: 'tts_ready',
      text: textContent,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('[TTS] Error:', error);
    // Don't fail the stream, just log
  }
}

// ============================================================================
// Utilities
// ============================================================================

function generateSessionId() {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// Static Files & Server Start
// ============================================================================

// Serve static files from public directory
app.use(express.static('public'));

// Default route
app.get('/', (req, res) => {
  res.sendFile(new URL('../public/index.html', import.meta.url).pathname);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

// Start server
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/chat (REST)`);
    console.log(`WebSocket endpoint: ws://localhost:${PORT}/chat`);
  });
}

// Vercel serverless export
export default app;
