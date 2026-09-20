# Deployment Guide

Deploy the AI Language Tutor to Vercel (free, serverless, auto-scaling).

## Prerequisites

- Completed [SETUP.md](SETUP.md) (app works locally)
- GitHub account
- Vercel account (free, sign up at [vercel.com](https://vercel.com))
- Gemini API key

## Step 1: Push to GitHub

### Create a New Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it `ai-language-tutor` (or similar)
3. Choose **Public** (recommended for open source)
4. Click **Create repository**

### Push Your Code

```bash
cd /home/richard/ai-language-tutor-v2

# Add all files
git add .

# Commit
git commit -m "Initial commit: AI Language Tutor with secure backend"

# Add remote (replace OWNER with your GitHub username)
git remote set-url origin https://github.com/OWNER/ai-language-tutor.git

# Push to GitHub
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

**Install Vercel CLI:**

```bash
npm install -g vercel
```

**Deploy:**

```bash
cd /home/richard/ai-language-tutor-v2
vercel
```

Follow the prompts:
- **Project name:** `ai-language-tutor` (or your choice)
- **Framework:** Select "Other" (no specific framework)
- **Root directory:** `.` (current directory)

### Option B: Using Vercel Web Dashboard (Easier)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your GitHub repository
4. Click **Import**
5. Go to **Environment Variables**
6. Add: `GEMINI_API_KEY = your_actual_api_key_here`
7. Click **Deploy**

---

## Step 3: Configure Environment Variables

### Via Vercel Dashboard

1. Go to your project on [vercel.com](https://vercel.com)
2. Click **Settings**
3. Click **Environment Variables**
4. Add new variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Your Gemini API key
5. Click **Save**

### Via Vercel CLI

```bash
vercel env add GEMINI_API_KEY
# Paste your API key when prompted
```

---

## Step 4: Verify Deployment

1. Vercel will show your deployment URL (e.g., `https://ai-language-tutor.vercel.app`)
2. Open it in your browser
3. Test the app:
   - Select a scenario
   - Click "Start Scenario"
   - Type a message or use the mic
   - Verify the AI responds correctly

---

## Step 5: Custom Domain (Optional)

### Add Your Domain

1. Go to your project on Vercel
2. Click **Settings** → **Domains**
3. Enter your domain (e.g., `language-tutor.com`)
4. Follow DNS configuration instructions
5. Vercel handles SSL automatically (HTTPS)

---

## Troubleshooting Deployment

### "Error: GEMINI_API_KEY is not configured"

**Solution:** Add the environment variable in Vercel:

1. Go to project **Settings** → **Environment Variables**
2. Add `GEMINI_API_KEY` with your API key
3. Redeploy: Click **Deployments** → **Redeploy**

### "API error: Authentication failed"

**Solution:** Verify the API key is correct:

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Copy your active API key
3. Update in Vercel environment variables
4. Redeploy

### "Function execution took longer than expected"

**Solution:** Vercel timeout (usually due to slow API response). This is rare, but if it happens:
- Wait a moment and refresh
- Check Google Gemini API status
- Reduce conversation complexity

### "Microphone not working"

**Solution:** Microphone requires HTTPS (Vercel provides this automatically). If it still doesn't work:
- Allow microphone access in browser permissions
- Try a different browser
- Test on the latest Chrome or Edge

---

## Monitoring & Logs

### View Deployment Logs

```bash
vercel logs [URL]
```

Example:
```bash
vercel logs https://ai-language-tutor.vercel.app
```

### Monitor API Usage

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Check API quota and usage
3. Optionally set up billing alerts

---

## Updates & Redeployment

### Deploy a New Version

After making changes locally:

```bash
git add .
git commit -m "Update: Add new scenario"
git push origin main
```

Vercel automatically redeploys on every push to main!

### Rollback to Previous Deployment

1. Go to your Vercel project
2. Click **Deployments**
3. Find the version you want
4. Click **...** → **Promote to Production**

---

## Production Checklist

- ✅ Local testing complete (all 6 scenarios work)
- ✅ API key stored in Vercel environment variables (not in code)
- ✅ Deployment URL works in browser
- ✅ Microphone and text input both work
- ✅ Error handling displays helpful messages
- ✅ Mobile responsive (tested on phone)
- ✅ All scenarios have correct win conditions

---

## Scaling & Performance

Vercel automatically handles:
- **Auto-scaling:** More requests = more serverless functions
- **Global CDN:** Your app is fast worldwide
- **Automatic HTTPS:** Secure connections to all users
- **Monitoring:** Built-in analytics and error tracking

---

## Security Best Practices

✅ **What we did right:**
- API key is server-side only (in `.env` on Vercel)
- No sensitive data exposed in network requests
- CORS configured to allow requests from frontend

✅ **Additional recommended:**
- Enable Vercel's DDoS protection
- Monitor API usage for anomalies
- Rotate API key periodically
- Review Vercel's security documentation

---

## Next Steps

- **Share your app:** Copy the Vercel URL and share with friends!
- **Add more scenarios:** See [SCENARIOS.md](SCENARIOS.md)
- **Customize UI:** Edit `public/index.html`
- **Track metrics:** Add analytics (optional, see Vercel docs)

---

## Support

- Vercel docs: https://vercel.com/docs
- Google Gemini API docs: https://ai.google.dev
- Open an issue on GitHub for bugs

Happy deploying! 🚀
