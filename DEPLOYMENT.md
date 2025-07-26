# Deployment Guide for Nitra Mitra Student Assistant

## Overview

The student assistant now supports two modes:
1. **Server Mode** (Recommended): Uses a Flask backend hosted on Vercel
2. **Client Mode**: Users provide their own API keys (original implementation)

## Backend Deployment on Vercel

### Prerequisites
- Node.js installed
- Vercel CLI (`npm i -g vercel`)
- Google AI Studio API key

### Steps

1. **Deploy to Vercel:**
```bash
# In your project root
vercel
```

2. **Configure Environment Variable:**
```bash
vercel env add GEMINI_API_KEY
# Enter your Gemini API key when prompted
```

3. **Deploy Production:**
```bash
vercel --prod
```

4. **Update Frontend Configuration:**
   - The frontend auto-detects the backend URL
   - For custom URLs, update `detectBackendUrl()` in `assistant.js`

### Environment Variables

Set these in Vercel dashboard or CLI:
- `GEMINI_API_KEY`: Your Google AI Studio API key

## Frontend Features

### Auto-Detection
- Automatically detects if backend is available
- Falls back to client mode if backend is unreachable
- Shows real-time backend status

### Mode Toggle
Users can switch between:
- **Server Mode**: Uses hosted backend (no API key needed)
- **Client Mode**: Uses personal API key (stored locally)

### Status Indicators
- ✅ Backend ready and configured
- ⚠️ Backend available but not configured
- ❌ Backend unavailable
- 🔄 Checking status...

## Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
export GEMINI_API_KEY="your_key_here"
python app.py
```

### Frontend
- Open `assistant.html` in browser
- Backend URL auto-detects to `http://localhost:5000`

## Configuration

### Backend URL Detection
The frontend automatically detects the backend URL:
- `localhost`: `http://localhost:5000`
- Vercel domains: Uses same origin
- Custom: Update `detectBackendUrl()` method

### User Preferences
- Mode selection is saved in localStorage
- API keys are stored locally (never sent to backend)
- Backend status is checked on page load

## Troubleshooting

### Backend Issues
1. Check Vercel deployment logs
2. Verify environment variables are set
3. Test API endpoints directly

### Frontend Issues
1. Check browser console for errors
2. Verify network connectivity
3. Try switching between modes

### API Rate Limits
- Backend mode: Shared quota (managed by admin)
- Client mode: Individual user quotas

## Security

### Backend
- API keys stored as environment variables
- CORS configured for frontend domain
- Input validation and error handling
- No sensitive data logged

### Frontend
- API keys stored locally only
- Secure HTTPS connections
- XSS protection via DOMPurify

## Monitoring

### Backend Health
- `GET /` - Health check
- `GET /api/status` - Configuration status
- Monitor Vercel function logs

### Frontend Analytics
- Google Analytics integrated
- Error tracking in console
- User interaction metrics

## Scaling

### Backend
- Vercel auto-scales serverless functions
- Monitor usage and adjust quotas
- Consider caching for frequent queries

### Frontend
- CDN delivery via GitHub Pages
- Optimized asset loading
- Responsive design for all devices
