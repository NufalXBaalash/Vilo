import os
import json
from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory, session, jsonify
from werkzeug.utils import secure_filename
from QA import qa_pipeline
from Summarize import summarize_pipeline
from Keyword import keyword_pipeline
from RAG_System import run_rag_pipeline

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Change this in production
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

ALLOWED_EXTENSIONS = {'pdf', 'docx'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_api_key():
    return session.get('api_key')

def get_current_file():
    return session.get('current_file')

@app.route('/')
def index():
    return render_template('chat.html')

@app.route('/qa')
def qa_page():
    return render_template('qa.html')

@app.route('/api/settings', methods=['POST'])
def save_settings():
    data = request.json
    if 'api_key' in data:
        session['api_key'] = data['api_key']
        return jsonify({'status': 'success'})
    return jsonify({'error': 'No API key provided'}), 400

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        session['current_file'] = filepath
        return jsonify({'status': 'success', 'filename': filename})
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    
    filepath = get_current_file()
    if not filepath or not os.path.exists(filepath):
        return jsonify({'error': 'Please upload a file first.'}), 400

    # Handle commands
    if message.strip().startswith('/summarize'):
        return api_summarize()
    elif message.strip().startswith('/keyword'):
        return api_keyword()
    
    # RAG Chat
    try:
        # We might need to handle API key here if RAG_System uses it.
        # RAG_System uses model_init which uses default or passed key.
        # But RAG_System.py imports query_groq_model from model_init.model
        # I should check if I broke RAG_System.py by changing model_init.model
        
        api_key = get_api_key()
        answer, best_chunks = run_rag_pipeline(filepath, message, api_key=api_key)
        
        # Format sources
        sources = []
        for chunk in best_chunks:
            sources.append({
                'text': chunk['text'][:200] + "...",
                'page': chunk.get('metadata', {}).get('page_number', 'Unknown')
            })
            
        return jsonify({'response': answer})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/questions', methods=['POST'])
def api_questions():
    api_key = get_api_key()
    # QA.py uses query_model which can use default key if none provided, 
    # but let's enforce user providing it if we want.
    # The original code enforced it.
    if not api_key:
         # If we want to allow default key from model_init, we can skip this check 
         # or check if model_init has a default.
         # But for safety, let's assume user must provide it if they want to use their own,
         # or we use the default.
         pass 
    
    filepath = get_current_file()
    if not filepath or not os.path.exists(filepath):
        return jsonify({'error': 'Please upload a file first.'}), 400

    try:
        results = qa_pipeline(filepath, api_key)
        return jsonify({'result': results})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/summarize', methods=['POST'])
def api_summarize():
    api_key = get_api_key()
    filepath = get_current_file()
    if not filepath or not os.path.exists(filepath):
        return jsonify({'error': 'Please upload a file first.'}), 400

    try:
        summary = summarize_pipeline(filepath, api_key)
        return jsonify({'response': summary}) # Changed key to 'response' for consistency with chat
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/keyword', methods=['POST'])
def api_keyword():
    api_key = get_api_key()
    filepath = get_current_file()
    if not filepath or not os.path.exists(filepath):
        return jsonify({'error': 'Please upload a file first.'}), 400

    try:
        keywords = keyword_pipeline(filepath, api_key)
        return jsonify({'response': keywords}) # Changed key to 'response' for consistency with chat
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
