from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import json
import tempfile
import PyPDF2
import fitz  # PyMuPDF
from werkzeug.utils import secure_filename
from uuid import uuid4
from datetime import datetime
from threading import Lock

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size
ALLOWED_EXTENSIONS = {'pdf', 'txt', 'md'}

# Get API key from environment variable
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN')  # Simple admin protection for quiz routes

# Data storage (JSON files)
BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, 'data')
QUIZZES_FILE = os.path.join(DATA_DIR, 'quizzes.json')
ATTEMPTS_FILE = os.path.join(DATA_DIR, 'attempts.json')

_quizzes_lock = Lock()
_attempts_lock = Lock()

def _ensure_data_files():
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(QUIZZES_FILE):
        with open(QUIZZES_FILE, 'w', encoding='utf-8') as f:
            json.dump({"quizzes": []}, f, ensure_ascii=False, indent=2)
    if not os.path.exists(ATTEMPTS_FILE):
        with open(ATTEMPTS_FILE, 'w', encoding='utf-8') as f:
            json.dump({"attempts": []}, f, ensure_ascii=False, indent=2)

def _now_iso():
    return datetime.utcnow().isoformat() + 'Z'

def _load_quizzes():
    _ensure_data_files()
    with _quizzes_lock:
        with open(QUIZZES_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)

def _save_quizzes(data):
    with _quizzes_lock:
        with open(QUIZZES_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

def _load_attempts():
    _ensure_data_files()
    with _attempts_lock:
        with open(ATTEMPTS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)

def _save_attempts(data):
    with _attempts_lock:
        with open(ATTEMPTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

def _require_admin(request):
    token = request.headers.get('X-Admin-Token') or request.args.get('admin_token')
    if not ADMIN_TOKEN:
        # If no token configured, reject in production; allow local with explicit header "dev-allow" for convenience
        if token == 'dev-allow':
            return True
        return False
    return token == ADMIN_TOKEN

def _sanitize_quiz_for_user(quiz):
    # Remove correct answers before sending to clients
    q = {k: v for k, v in quiz.items() if k != 'questions'}
    sanitized_questions = []
    for question in quiz.get('questions', []):
        q_copy = {k: v for k, v in question.items() if k not in ('correct',)}
        sanitized_questions.append(q_copy)
    q['questions'] = sanitized_questions
    return q

def _normalize_quiz_payload(payload):
    # Ensure required fields and normalize structure
    title = (payload.get('title') or '').strip()
    description = (payload.get('description') or '').strip()
    time_limit = payload.get('time_limit')  # seconds (optional)
    questions = payload.get('questions') or []
    if not title or not isinstance(questions, list) or not questions:
        raise ValueError('Quiz must have a title and at least one question')
    norm_questions = []
    for q in questions:
        text = (q.get('text') or '').strip()
        options = q.get('options') or []
        qtype = (q.get('type') or 'single').lower()
        points = q.get('points', 1)
        correct = q.get('correct')
        if not text or not isinstance(options, list) or len(options) < 2:
            raise ValueError('Each question must have text and at least 2 options')
        if qtype not in ('single', 'multiple'):
            raise ValueError('Question type must be single or multiple')
        # Normalize correct as list of indexes
        if qtype == 'single':
            if isinstance(correct, list):
                if len(correct) != 1:
                    raise ValueError('Single-select questions must have exactly one correct index')
                correct_idx = correct
            else:
                correct_idx = [int(correct)] if correct is not None else []
            if len(correct_idx) != 1:
                raise ValueError('Single-select questions must have exactly one correct index')
        else:
            if correct is None:
                correct_idx = []
            elif isinstance(correct, list):
                correct_idx = [int(i) for i in correct]
            else:
                # comma-separated string or single int
                if isinstance(correct, str) and ',' in correct:
                    correct_idx = [int(i.strip()) for i in correct.split(',') if i.strip()]
                else:
                    correct_idx = [int(correct)]
        # Bounds check
        for idx in correct_idx:
            if idx < 0 or idx >= len(options):
                raise ValueError('Correct answer index out of range')
        norm_questions.append({
            'id': q.get('id') or str(uuid4()),
            'text': text,
            'options': options,
            'type': qtype,
            'correct': sorted(list(set(correct_idx))),
            'points': int(points) if isinstance(points, (int, float, str)) and str(points).isdigit() else 1
        })
    return {
        'title': title,
        'description': description,
        'time_limit': int(time_limit) if isinstance(time_limit, (int, float, str)) and str(time_limit).isdigit() else None,
        'questions': norm_questions
    }

def _calculate_score(quiz, answers_map):
    total_points = 0
    scored = 0
    details = []
    # Map questions by id for fast lookup
    q_by_id = {q['id']: q for q in quiz.get('questions', [])}
    for qid, q in q_by_id.items():
        total_points += int(q.get('points', 1))
        selected = answers_map.get(qid, [])
        if selected is None:
            selected = []
        # Normalize selected to list of ints
        if not isinstance(selected, list):
            selected = [selected]
        try:
            selected_idx = sorted([int(i) for i in selected])
        except Exception:
            selected_idx = []
        correct_idx = sorted(q.get('correct', []))
        is_correct = selected_idx == correct_idx
        pts = int(q.get('points', 1)) if is_correct else 0
        scored += pts
        details.append({
            'question_id': qid,
            'selected': selected_idx,
            'is_correct': is_correct,
            'awarded_points': pts,
            'max_points': int(q.get('points', 1))
        })
    return scored, total_points, details

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


# =============================
# QUIZ ROUTES (Admin + User)
# =============================

@app.route('/api/admin/quizzes', methods=['GET'])
def admin_list_quizzes():
    if not _require_admin(request):
        return jsonify({'error': 'Unauthorized'}), 401
    data = _load_quizzes()
    return jsonify({'quizzes': data.get('quizzes', [])})


@app.route('/api/admin/quizzes', methods=['POST'])
def admin_create_quiz():
    if not _require_admin(request):
        return jsonify({'error': 'Unauthorized'}), 401
    try:
        payload = request.get_json(force=True, silent=False) or {}
        quiz_norm = _normalize_quiz_payload(payload)
        quiz = {
            'id': str(uuid4()),
            'title': quiz_norm['title'],
            'description': quiz_norm['description'],
            'time_limit': quiz_norm['time_limit'],
            'created_at': _now_iso(),
            'updated_at': _now_iso(),
            'questions': quiz_norm['questions']
        }
        data = _load_quizzes()
        data['quizzes'].append(quiz)
        _save_quizzes(data)
        return jsonify({'success': True, 'quiz': quiz}), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'error': f'Failed to create quiz: {str(e)}'}), 500


@app.route('/api/admin/quizzes/<quiz_id>', methods=['PUT'])
def admin_update_quiz(quiz_id):
    if not _require_admin(request):
        return jsonify({'error': 'Unauthorized'}), 401
    try:
        payload = request.get_json(force=True, silent=False) or {}
        quiz_norm = _normalize_quiz_payload(payload)
        data = _load_quizzes()
        quizzes = data.get('quizzes', [])
        for i, q in enumerate(quizzes):
            if q.get('id') == quiz_id:
                quizzes[i] = {
                    'id': quiz_id,
                    'title': quiz_norm['title'],
                    'description': quiz_norm['description'],
                    'time_limit': quiz_norm['time_limit'],
                    'created_at': q.get('created_at') or _now_iso(),
                    'updated_at': _now_iso(),
                    'questions': quiz_norm['questions']
                }
                _save_quizzes(data)
                return jsonify({'success': True, 'quiz': quizzes[i]})
        return jsonify({'error': 'Quiz not found'}), 404
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        return jsonify({'error': f'Failed to update quiz: {str(e)}'}), 500


@app.route('/api/admin/quizzes/<quiz_id>', methods=['DELETE'])
def admin_delete_quiz(quiz_id):
    if not _require_admin(request):
        return jsonify({'error': 'Unauthorized'}), 401
    try:
        data = _load_quizzes()
        quizzes = data.get('quizzes', [])
        new_quizzes = [q for q in quizzes if q.get('id') != quiz_id]
        if len(new_quizzes) == len(quizzes):
            return jsonify({'error': 'Quiz not found'}), 404
        data['quizzes'] = new_quizzes
        _save_quizzes(data)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': f'Failed to delete quiz: {str(e)}'}), 500


# User routes
@app.route('/api/quizzes', methods=['GET'])
def list_quizzes():
    data = _load_quizzes()
    sanitized = [_sanitize_quiz_for_user(q) for q in data.get('quizzes', [])]
    return jsonify({'quizzes': sanitized})


@app.route('/api/quizzes/<quiz_id>', methods=['GET'])
def get_quiz(quiz_id):
    data = _load_quizzes()
    for q in data.get('quizzes', []):
        if q.get('id') == quiz_id:
            return jsonify({'quiz': _sanitize_quiz_for_user(q)})
    return jsonify({'error': 'Quiz not found'}), 404


@app.route('/api/quizzes/<quiz_id>/attempt', methods=['POST'])
def attempt_quiz(quiz_id):
    try:
        payload = request.get_json(force=True, silent=False) or {}
        answers = payload.get('answers')  # list of {question_id, selected: [idx...]}
        user = payload.get('user') or {}
        if not isinstance(answers, list) or not answers:
            return jsonify({'error': 'Answers are required'}), 400

        data = _load_quizzes()
        quiz = next((q for q in data.get('quizzes', []) if q.get('id') == quiz_id), None)
        if not quiz:
            return jsonify({'error': 'Quiz not found'}), 404

        # Build answers map
        answers_map = {}
        for a in answers:
            qid = a.get('question_id')
            selected = a.get('selected', [])
            if qid:
                answers_map[qid] = selected

        score, total_points, details = _calculate_score(quiz, answers_map)
        percentage = (score / total_points * 100.0) if total_points else 0.0

        attempt = {
            'id': str(uuid4()),
            'quiz_id': quiz_id,
            'user': {
                'id': user.get('id'),
                'name': user.get('name'),
                'meta': user.get('meta') or {}
            },
            'score': score,
            'max_score': total_points,
            'percentage': round(percentage, 2),
            'details': details,
            'submitted_at': _now_iso()
        }

        attempts_data = _load_attempts()
        attempts_data['attempts'].append(attempt)
        _save_attempts(attempts_data)

        # Do not leak correct answers; include per-question correctness
        return jsonify({
            'success': True,
            'result': {
                'score': attempt['score'],
                'max_score': attempt['max_score'],
                'percentage': attempt['percentage'],
                'details': attempt['details'],
                'submitted_at': attempt['submitted_at']
            }
        })
    except Exception as e:
        return jsonify({'error': f'Failed to submit attempt: {str(e)}'}), 500


@app.route('/api/quizzes/<quiz_id>/leaderboard', methods=['GET'])
def quiz_leaderboard(quiz_id):
    try:
        attempts_data = _load_attempts()
        attempts = [a for a in attempts_data.get('attempts', []) if a.get('quiz_id') == quiz_id]
        # Sort by score desc, then earlier submission
        attempts.sort(key=lambda a: (-a.get('score', 0), a.get('submitted_at', '')))
        top_n = int(request.args.get('limit', 10))
        board = []
        for a in attempts[:top_n]:
            board.append({
                'user': a.get('user', {}).get('name') or 'Anonymous',
                'score': a.get('score'),
                'max_score': a.get('max_score'),
                'percentage': a.get('percentage'),
                'submitted_at': a.get('submitted_at')
            })
        return jsonify({'leaderboard': board})
    except Exception as e:
        return jsonify({'error': f'Failed to load leaderboard: {str(e)}'}), 500





if __name__ == '__main__':
    # For local development
    app.run(debug=True, host='0.0.0.0', port=5000)
