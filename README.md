# 🗣️ AI Language Tutor

A voice-interactive language learning app powered by **Google's Gemini AI**. Practice speaking 6 languages with immersive roleplay scenarios using your browser's microphone and a secure backend proxy.

![Language Scenarios](https://img.shields.io/badge/scenarios-6%2B-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Node.js](https://img.shields.io/badge/node-18%2B-green)

---

## ✨ Features

✅ **Voice + Text:** Hold the mic to speak your target language, or type your response  
✅ **6 Languages:** Thai, Japanese, Spanish, French, Mandarin, German  
✅ **Secure Backend:** API key stored server-side (not exposed in browser)  
✅ **Instant Feedback:** AI responds with native text-to-speech in your target language  
✅ **Win Conditions:** Each scenario has a specific objective to complete  
✅ **Mobile Friendly:** Responsive design works on phone, tablet, desktop  
✅ **Extensible:** Easy to add more scenarios and languages  
✅ **Deployable:** Ready for Vercel, Netlify, or any Node.js host  

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** ([download](https://nodejs.org))
- **Google Gemini API Key** (free, [get here](https://aistudio.google.com))

### 3-Minute Setup

```bash
# 1. Clone repo
git clone https://github.com/yourusername/ai-language-tutor.git
cd ai-language-tutor

# 2. Install dependencies
npm install

# 3. Add API key to .env
cp .env.example .env
# Edit .env and paste your Gemini API key

# 4. Start the app
npm run dev

# 5. Open in browser
open http://localhost:3000
```

---

## 📖 Documentation

- **[SETUP.md](SETUP.md)** — Detailed local development guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** — Deploy to Vercel in 5 minutes
- **[SCENARIOS.md](SCENARIOS.md)** — Add custom scenarios and languages

---

## 🌍 Available Scenarios

| Scenario | Language | Objective |
|----------|----------|-----------|
| 🇹🇭 Bangkok Street Food | Thai | Order grilled pork & sticky rice |
| 🇯🇵 Tokyo 7-11 | Japanese | Order hot coffee |
| 🇪🇸 Madrid Taxi | Spanish | Give a destination address |
| 🇫🇷 Paris Restaurant | French | Order a meal & wine |
| 🇨🇳 Beijing Train Station | Mandarin | Buy a train ticket |
| 🇩🇪 Berlin Hotel | German | Check into a hotel |

---

## 🔒 Security

### What We Do Right

✅ **No hardcoded secrets** — API key stored in `.env` (server-side only)  
✅ **Secure proxy** — Backend handles all Gemini API calls  
✅ **Safe browser** — No sensitive data in network requests  
✅ **HTTPS ready** — Works on Vercel with automatic SSL  

### Before vs. After

**Before (Vulnerable):**
```
Browser → Direct call to Gemini API with exposed API key
```

**After (Secure):**
```
Browser → Backend proxy → Gemini API (key hidden on server)
```

---

## 📁 Project Structure

```
ai-language-tutor/
├── api/
│   └── chat.js              # Express backend + Vercel serverless handler
├── public/
│   └── index.html           # Frontend (HTML/CSS/JS, no API key here!)
├── scenarios.js             # 6 language scenario configs
├── package.json             # Dependencies: express, cors, dotenv
├── vercel.json              # Deployment config
├── .env.example             # Template for secrets
├── .gitignore               # Keeps .env out of git
├── SETUP.md                 # Local development guide
├── DEPLOYMENT.md            # Deploy to Vercel/Netlify
├── SCENARIOS.md             # Add custom scenarios
└── README.md                # This file
```

---

## 🎯 How It Works

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Frontend (Browser)                                      │
│ • Web Speech API (microphone) - browser-native          │
│ • Text input                                            │
│ • Text-to-speech (browser-native)                       │
│ • Chat UI                                               │
└─────────────────────────────────────────────────────────┘
                            ↓
                   /api/chat (POST)
                            ↓
┌─────────────────────────────────────────────────────────┐
│ Backend (Express.js / Vercel Serverless)                │
│ • Reads API key from .env                               │
│ • Proxies chat requests to Gemini                       │
│ • Returns AI responses to frontend                      │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│ Gemini API (Google Cloud)                               │
│ • Processes conversation in target language             │
│ • Evaluates win conditions                              │
│ • Returns AI responses                                  │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Customization

### Add a New Language Scenario

Edit `scenarios.js`:

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

See [SCENARIOS.md](SCENARIOS.md) for detailed instructions.

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Then add your `GEMINI_API_KEY` environment variable in the Vercel dashboard.

See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions and alternatives.

---

## 🐛 Troubleshooting

### "API key not configured"
→ Check `.env` file has your Gemini API key

### "Connection error"
→ Ensure backend is running: `npm run dev`

### "Microphone not working"
→ Check browser permissions, try Chrome/Edge, must be HTTPS on production

See [SETUP.md](SETUP.md) for more troubleshooting.

---

## 🤝 Contributing

Have ideas for new scenarios or improvements?

1. Fork the repository
2. Create a branch (`git checkout -b feature/my-scenario`)
3. Add your scenario to `scenarios.js`
4. Test it locally (`npm run dev`)
5. Push and open a pull request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 📚 Resources

- **Google Gemini API:** https://ai.google.dev
- **Web Speech API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- **Vercel Docs:** https://vercel.com/docs
- **Express.js:** https://expressjs.com

---

**Ready to practice? [Get started in 3 minutes →](SETUP.md)**
