# Setup Guide

This guide walks you through setting up the AI Language Tutor app for local development.

## Prerequisites

- **Node.js** 18+ (download from [nodejs.org](https://nodejs.org))
- **npm** (comes with Node.js)
- **Google Gemini API Key** (get one free at [Google AI Studio](https://aistudio.google.com))

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-language-tutor.git
cd ai-language-tutor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
NODE_ENV=development
```

**⚠️ Security:** Never commit `.env` to git. It's already in `.gitignore`.

### 4. Start the Server

```bash
npm run dev
```

You should see:

```
Server running at http://localhost:3000
API endpoint: http://localhost:3000/api/chat
```

### 5. Open in Browser

Navigate to `http://localhost:3000` in your browser and start using the app!

---

## Project Structure

```
ai-language-tutor/
├── api/
│   └── chat.js                 # Express backend server + Vercel serverless handler
├── public/
│   └── index.html              # Frontend UI (HTML + CSS + JS)
├── scenarios.js                # Shared scenario configurations (6 languages)
├── package.json                # Node.js dependencies and scripts
├── vercel.json                 # Deployment config for Vercel
├── .env.example                # Template for environment variables
├── .env                        # Local environment (DO NOT COMMIT)
├── .gitignore                  # Excludes .env, node_modules, etc.
└── README.md                   # Project overview
```

---

## How It Works

### Security: API Key Protection

**Before this refactoring:**
- API key was stored in browser memory
- Risk: API key visible in network requests

**After this refactoring:**
- API key stored in server `.env` file
- Frontend makes requests to `/api/chat` endpoint
- Backend proxies requests to Gemini API securely
- API key never exposed to browser

### Architecture

```
Browser (Frontend)
    ↓
    ├─ User types/speaks input
    ├─ Sends to localhost:3000/api/chat
    ↓
Express Server (Backend)
    ├─ Loads API key from .env
    ├─ Proxies to Gemini API
    ├─ Returns response to browser
    ↓
Browser (Frontend)
    ├─ Displays AI response
    ├─ Uses Web Speech API (browser-native)
    └─ No sensitive data in browser
```

---

## Available Scenarios

The app includes 6 language learning scenarios:

1. **🇹🇭 Bangkok Street Food** (Thai) — Order grilled pork and sticky rice
2. **🇯🇵 Tokyo 7-11** (Japanese) — Order hot coffee
3. **🇪🇸 Madrid Taxi** (Spanish) — Give a destination address
4. **🇫🇷 Paris Restaurant** (French) — Order a meal and wine
5. **🇨🇳 Beijing Train Station** (Mandarin) — Buy a train ticket
6. **🇩🇪 Berlin Hotel** (German) — Check into a hotel

Each scenario has a specific "win condition" — when you achieve it, the app shows "🎉 SCENARIO COMPLETE!"

---

## Troubleshooting

### "Server error: API key not configured"

**Solution:** Make sure `.env` file exists in the root directory with your Gemini API key:

```bash
cat .env
# Should show: GEMINI_API_KEY=sk-...
```

### "Connection error"

**Solution:** Verify the backend server is running:

```bash
npm run dev
```

If it's already running, try restarting it. Also check that nothing else is using port 3000:

```bash
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### "Microphone not supported"

**Solution:** Microphone (Web Speech API) requires:
- A modern browser (Chrome, Edge, Safari 14.1+)
- HTTPS (or localhost for development)

You can still type responses if microphone isn't available.

### "No speech detected"

**Solution:**
- Speak clearly and closer to the microphone
- Make sure your microphone is enabled in browser settings
- Try a different browser (Chrome works best)

### Gemini API quota exceeded

**Solution:** The free tier of Gemini API has usage limits. You can:
- Wait a moment and try again
- Check your API key at [Google AI Studio](https://aistudio.google.com)
- Upgrade your API quota if needed

---

## Customizing Scenarios

To add a new scenario, edit `scenarios.js`:

```javascript
export const scenarios = {
  // ... existing scenarios ...
  
  newyork: {
    id: 'newyork',
    name: 'New York Pizza Parlor',
    emoji: '🇺🇸',
    description: 'Order a pepperoni pizza',
    lang: 'en-US',
    voiceLang: 'en-US',
    prompt: `You are a pizza shop owner in New York...`
  }
};
```

Then update `public/index.html` to add the option to the dropdown:

```html
<option value="newyork">🇺🇸 New York Pizza (Order pizza)</option>
```

See `SCENARIOS.md` for detailed customization instructions.

---

## Next Steps

- **Local development:** You're all set! Make changes and refresh the browser.
- **Deployment:** See `DEPLOYMENT.md` to publish to Vercel or another platform.
- **Adding scenarios:** See `SCENARIOS.md` for detailed instructions.

---

## Questions or Issues?

Check the [README.md](README.md) for project overview or open an issue on GitHub!
