from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import json
import tempfile
import PyPDF2
import fitz  # PyMuPDF
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size
ALLOWED_EXTENSIONS = {'pdf', 'txt', 'md'}

# Get API key from environment variable
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')

def allowed_file(filename):
    """Check if the uploaded file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(file_path):
    """Extract text from PDF file."""
    text = ""
    try:
        # Try PyMuPDF first (better text extraction)
        doc = fitz.open(file_path)
        for page in doc:
            text += page.get_text()
        doc.close()
        if text.strip():
            return text
    except:
        pass
    
    try:
        # Fallback to PyPDF2
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text()
    except Exception as e:
        raise ValueError(f"Could not extract text from PDF: {str(e)}")
    
    return text

def extract_text_from_file(file_path, filename):
    """Extract text from various file types."""
    file_ext = filename.rsplit('.', 1)[1].lower()
    
    if file_ext == 'pdf':
        return extract_text_from_pdf(file_path)
    elif file_ext in ['txt', 'md']:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    else:
        raise ValueError(f"Unsupported file type: {file_ext}")

def create_prompt_for_task(text, task_type):
    """Create appropriate prompt for different tasks."""
    
    base_prompt = """You are an AI assistant specialized in helping students with their study materials.
    
IMPORTANT FORMATTING GUIDELINES:
- Use **bold** for key terms, concepts, and important points
- Use *italics* for emphasis and definitions
- Use bullet points (•) for lists and key points
- Use numbered lists (1., 2., 3.) for sequential information
- Use > for important quotes or highlighted information
- Use ### for section headings
- Use `code` formatting for technical terms, formulas, or specific terminology
- Ensure proper line breaks and spacing for readability

"""
    
    if task_type == 'summarize':
        specific_prompt = """
Create a COMPREHENSIVE SUMMARY that includes:

### **📖 Overview**
• Brief introduction to the content
• Main purpose and scope

### **🔍 Key Information**
• Most important points and concepts
• Essential facts and details
• Critical insights and conclusions

### **💡 Main Takeaways**
• Primary lessons learned
• Important implications
• Practical applications (if any)

### **📝 Summary**
• Concise recap of all major points
• Final thoughts and conclusions
"""
    
    elif task_type == 'enhance':
        specific_prompt = """
ENHANCE the following notes by improving structure and adding insights:

### **🔍 Enhanced Content**
• Reorganize and clarify existing information
• Add proper structure and formatting
• Fix unclear explanations

### **💡 Additional Insights**
• Related concepts and connections
• Important background information
• Real-world applications

### **📝 Key Takeaways**
• Most important points to remember
• Critical concepts for understanding

### **🎯 Study Tips**
• How to remember this information
• Connections to other topics
"""
    
    elif task_type == 'questions':
        specific_prompt = """
Generate STUDY QUESTIONS based on the content:

### **🎯 Review Questions**
1. [Basic understanding questions]

### **💭 Critical Thinking Questions**
1. [Analysis and application questions]

### **📝 Short Answer Questions**
1. [Brief explanation questions]

### **🧠 Key Concepts**
1. [Definition and concept questions]
"""
    
    else:  # default to summarize
        specific_prompt = """
Create a comprehensive summary of the following content with proper formatting and structure.
"""
    
    return f"{base_prompt}\n{specific_prompt}\n\nContent to process:\n\n{text}\n\nProvide a well-structured response following the guidelines above:"

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

@app.route('/api/summarize/text', methods=['POST'])
def summarize_text():
    """Summarize text content."""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
        
        text = data['text'].strip()
        if not text:
            return jsonify({'error': 'Empty text provided'}), 400
        
        if len(text) > 500000:  # 500KB limit
            return jsonify({'error': 'Text too long. Maximum 500KB allowed.'}), 400
        
        # Create prompt for summarization
        prompt = create_prompt_for_task(text, 'summarize')
        
        # Call Gemini API
        response_data = call_gemini_api(prompt)
        
        return jsonify({
            'success': True,
            'summary': response_data,
            'original_length': len(text)
        })
    
    except Exception as e:
        return jsonify({'error': f'Failed to process text: {str(e)}'}), 500

@app.route('/api/summarize/file', methods=['POST'])
def summarize_file():
    """Summarize uploaded file (PDF, TXT, MD)."""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': f'File type not allowed. Supported: PDF, TXT, MD'}), 400
        
        # Save file temporarily
        filename = secure_filename(file.filename)
        file_path = os.path.join(tempfile.gettempdir(), filename)
        file.save(file_path)
        
        try:
            # Extract text
            extracted_text = extract_text_from_file(file_path, filename)
            
            if not extracted_text.strip():
                return jsonify({'error': 'No text found in the file'}), 400
            
            if len(extracted_text) > 500000:
                return jsonify({'error': 'Extracted text too long. Maximum 500KB allowed.'}), 400
            
            # Create prompt and get summary
            prompt = create_prompt_for_task(extracted_text, 'summarize')
            summary = call_gemini_api(prompt)
            
            return jsonify({
                'success': True,
                'filename': filename,
                'summary': summary,
                'extracted_length': len(extracted_text)
            })
        
        finally:
            # Clean up
            if os.path.exists(file_path):
                os.remove(file_path)
    
    except Exception as e:
        return jsonify({'error': f'Failed to process file: {str(e)}'}), 500

@app.route('/api/notes/enhance', methods=['POST'])
def enhance_notes():
    """Enhance notes with AI insights."""
    try:
        data = request.get_json()
        if not data or 'notes' not in data:
            return jsonify({'error': 'No notes provided'}), 400
        
        notes = data['notes'].strip()
        task_type = data.get('type', 'enhance')  # enhance, questions
        
        if not notes:
            return jsonify({'error': 'Empty notes provided'}), 400
        
        # Create prompt
        prompt = create_prompt_for_task(notes, task_type)
        
        # Get enhanced content
        enhanced = call_gemini_api(prompt)
        
        return jsonify({
            'success': True,
            'enhanced_notes': enhanced,
            'type': task_type,
            'original_length': len(notes)
        })
    
    except Exception as e:
        return jsonify({'error': f'Failed to enhance notes: {str(e)}'}), 500

def call_gemini_api(prompt):
    """Call Gemini API with the given prompt."""
    if not GEMINI_API_KEY:
        raise ValueError("API key not configured")
    
    gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={GEMINI_API_KEY}"
    
    request_body = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    
    response = requests.post(
        gemini_url,
        headers={"Content-Type": "application/json"},
        json=request_body,
        timeout=30
    )
    
    if not response.ok:
        raise Exception(f"API request failed: {response.status_code}")
    
    response_data = response.json()
    
    if 'candidates' not in response_data or not response_data['candidates']:
        raise Exception("No response generated")
    
    return response_data['candidates'][0]['content']['parts'][0]['text']

if __name__ == '__main__':
    # For local development
    app.run(debug=True, host='0.0.0.0', port=5000)
