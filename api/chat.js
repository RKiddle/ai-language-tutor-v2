import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getScenario } from '../scenarios.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Chat endpoint - proxy to Gemini
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
        },
        {
          role: 'model',
          parts: [{ text: 'Understood. I am in character. You can speak to me now.' }]
        }
      ];

      // Call Gemini with initialization
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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

// Serve static files from public directory (for local development)
app.use(express.static('public'));

// Default route (for local development)
app.get('/', (req, res) => {
  res.sendFile(new URL('../public/index.html', import.meta.url).pathname);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

// Local server mode
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/chat`);
  });
}

// Vercel serverless export
export default app;
