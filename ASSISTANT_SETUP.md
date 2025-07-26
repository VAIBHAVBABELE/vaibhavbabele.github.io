# Student Assistant Setup Guide

## Overview
The Student Assistant is an AI-powered chatbot for NITRA Technical Campus students, built with dual backend support for maximum flexibility and security.

## Features
- **Dual Backend Support**: Choose between server mode (hosted backend) or client mode (personal API key)
- **Markdown Rendering**: Rich text responses with syntax highlighting
- **Dark Mode Support**: Seamless integration with the site's theme
- **Responsive Design**: Works on all devices
- **Secure API Management**: Safe handling of API keys and requests

## Backend Modes

### 1. Server Mode (Recommended)
- **Pros**: No API key required, more secure, faster setup
- **Cons**: Depends on backend availability
- **Best for**: Most users, production deployment

### 2. Client Mode
- **Pros**: Independent of backend, full control
- **Cons**: Requires personal API key, API key exposed to client
- **Best for**: Development, personal use, when backend is unavailable

## Local Development Setup

### Prerequisites
- Python 3.8+
- Node.js (for frontend development)
- Git

### Backend Setup (Flask)

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**:
   Create a `.env` file in the backend directory:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   FLASK_ENV=development
   ```

6. **Run the backend**:
   ```bash
   python app.py
   ```
   
   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Open `assistant.html` in a browser or serve with a local server**:
   ```bash
   # Using Python's built-in server
   python -m http.server 8000
   ```
   
   Then visit `http://localhost:8000/assistant.html`

2. **The assistant will automatically detect the local backend** and show server mode as available.

## Deployment

### Backend Deployment (Vercel)

1. **Prepare for deployment**:
   - Ensure `vercel.json` is configured
   - Set environment variables in Vercel dashboard
   - Update backend URL in `assistant.js` if needed

2. **Deploy to Vercel**:
   ```bash
   cd backend
   vercel --prod
   ```

3. **Set environment variables** in Vercel dashboard:
   - `GEMINI_API_KEY`: Your Gemini API key

### Frontend Deployment

1. **Update backend URL** in `assistant.js`:
   ```javascript
   // Update the production backend URL
   return 'https://your-actual-backend-url.vercel.app';
   ```

2. **Deploy frontend** to your hosting platform (Vercel, Netlify, etc.)

## Configuration

### Mode Selector Visibility
The mode selector is now always visible initially, allowing users to choose their preferred backend mode. After selection:

- **Server Mode**: Shows "Start Chatting" button to proceed
- **Client Mode**: Shows API key input field

### API Key Management (Client Mode)

1. **Get API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key

2. **Enter API Key**:
   - Select "Personal API Key" mode
   - Paste your API key
   - Click "Save Key"

3. **Security Note**: API keys in client mode are stored locally in browser storage and never sent to our servers.

## Troubleshooting

### Mode Selector Not Visible
- **Issue**: API setup section appears empty
- **Solution**: Check browser console for JavaScript errors, ensure all dependencies are loaded

### Backend Connection Issues
- **Local Development**: Ensure Flask backend is running on port 5000
- **Production**: Verify backend URL is correct and backend is deployed

### API Key Issues (Client Mode)
- **Invalid Key**: Verify the API key is correct and has proper permissions
- **Rate Limits**: Check if you've exceeded Gemini API rate limits

### Chat Not Working
1. Check browser console for errors
2. Verify network connectivity
3. Ensure proper mode selection
4. Check API key validity (client mode)

## Features Usage

### Chat Interface
- Type questions in the input field
- Use suggested quick questions
- Click configuration button to change settings
- Clear chat history with trash button

### Markdown Support
- Responses support full markdown formatting
- Code blocks have syntax highlighting
- Copy buttons for easy code copying

### Dark Mode
- Automatically follows site's theme
- Toggle using the moon/sun icon in navigation

## API Integration

### Gemini API
- Model: `gemini-1.5-flash-latest`
- Optimized prompts for student assistance
- Markdown-formatted responses
- Academic focus for NITRA/AKTU students

### Backend Endpoints
- `GET /api/status`: Check backend health and configuration
- `POST /api/chat`: Send messages and get responses

## Contributing
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## Support
For issues or questions:
1. Check this documentation
2. Review browser console for errors
3. Test in different browsers
4. Contact the development team

## License
This project is part of the Nitra Mitra platform and follows the same licensing terms.
