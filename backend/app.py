from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get API key from environment variable
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')

@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Nitra Mitra Student Assistant API is running",
        "version": "1.0.0"
    })

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    """Chat endpoint for student assistant"""
    
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        # Check if API key is configured
        if not GEMINI_API_KEY:
            return jsonify({
                "error": "API key not configured",
                "message": "Please contact the administrator to set up the API key"
            }), 500
        
        # Get message from request
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({
                "error": "Invalid request",
                "message": "Message is required"
            }), 400
        
        message = data['message'].strip()
        if not message:
            return jsonify({
                "error": "Empty message",
                "message": "Please provide a valid message"
            }), 400
        
        # Prepare request to Gemini API
        gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={GEMINI_API_KEY}"
        
        request_body = {
            "contents": [{
                "parts": [{
                    "text": f"""You are a helpful student assistant for NITRA Technical Campus and AKTU students. 
                    
                    IMPORTANT: Format your response using markdown for better readability:
                    - Use **bold** for important terms and concepts
                    - Use *italics* for emphasis
                    - Use bullet points (- or *) for lists
                    - Use numbered lists (1. 2. 3.) for step-by-step instructions
                    - Use `code` for technical terms, formulas, or code snippets
                    - Use > for important quotes or tips
                    - Use ### for section headings when appropriate
                    - Use line breaks for better paragraph separation
                    
                    Provide helpful, accurate, and encouraging responses about academic topics, study tips, 
                    exam preparation, career guidance, and general student life. Keep responses concise but informative.
                    Structure your answers clearly with proper formatting.
                    
                    Student Question: {message}"""
                }]
            }]
        }
        
        # Make request to Gemini API
        response = requests.post(
            gemini_url,
            headers={"Content-Type": "application/json"},
            json=request_body,
            timeout=30
        )
        
        if not response.ok:
            error_detail = ""
            try:
                error_data = response.json()
                error_detail = error_data.get('error', {}).get('message', '')
            except:
                error_detail = f"HTTP {response.status_code}"
            
            return jsonify({
                "error": "API request failed",
                "message": f"Failed to get response from AI service: {error_detail}"
            }), 500
        
        # Parse response
        response_data = response.json()
        
        if 'candidates' not in response_data or not response_data['candidates']:
            return jsonify({
                "error": "No response generated",
                "message": "The AI service didn't generate a response. Please try again."
            }), 500
        
        # Return the response in the same format as the frontend expects
        return jsonify(response_data), 200
        
    except requests.exceptions.Timeout:
        return jsonify({
            "error": "Request timeout",
            "message": "The request took too long to process. Please try again."
        }), 504
        
    except requests.exceptions.RequestException as e:
        return jsonify({
            "error": "Network error",
            "message": "Failed to connect to AI service. Please check your internet connection."
        }), 503
        
    except Exception as e:
        print(f"Unexpected error: {str(e)}")  # Log for debugging
        return jsonify({
            "error": "Internal server error",
            "message": "An unexpected error occurred. Please try again later."
        }), 500

@app.route('/api/status', methods=['GET'])
def status():
    """Status endpoint to check API key configuration"""
    return jsonify({
        "api_configured": bool(GEMINI_API_KEY),
        "backend_version": "flask-1.0.0"
    })

if __name__ == '__main__':
    # For local development
    app.run(debug=True, host='0.0.0.0', port=5000)
