# Nitra Mitra Backend

## Flask API for Student Assistant

This is a Flask-based backend API for the Nitra Mitra Student Assistant chatbot.

### Features

- **Gemini AI Integration**: Uses Google's Gemini API for intelligent responses
- **CORS Enabled**: Supports cross-origin requests from the frontend
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Health Checks**: Status endpoints for monitoring
- **Vercel Ready**: Configured for easy deployment on Vercel

### API Endpoints

#### POST /api/chat
Send a message to the student assistant.

**Request Body:**
```json
{
  "message": "Your question here"
}
```

**Response:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "AI response in markdown format"
          }
        ]
      }
    }
  ]
}
```

#### GET /api/status
Check backend status and API configuration.

**Response:**
```json
{
  "api_configured": true,
  "backend_version": "flask-1.0.0"
}
```

#### GET /
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "message": "Nitra Mitra Student Assistant API is running",
  "version": "1.0.0"
}
```

### Local Development

1. **Install Dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Set Environment Variable:**
```bash
export GEMINI_API_KEY="your_gemini_api_key_here"
```

3. **Run the Server:**
```bash
python app.py
```

The server will start on `http://localhost:5000`

### Deployment on Vercel

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Set Environment Variable:**
```bash
vercel env add GEMINI_API_KEY
```

4. **Redeploy:**
```bash
vercel --prod
```

### Environment Variables

- `GEMINI_API_KEY`: Your Google AI Studio API key (required)

### Frontend Integration

The frontend automatically detects the backend URL and switches between:
- **Client-side mode**: User provides their own API key
- **Backend mode**: Uses the Flask backend API

### Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `400`: Bad request (invalid input)
- `500`: Server error (API key issues, etc.)
- `503`: Service unavailable (network issues)
- `504`: Request timeout

### Security

- API keys are stored as environment variables
- CORS is configured for the frontend domain
- Input validation and sanitization
- Comprehensive error handling without exposing sensitive information
