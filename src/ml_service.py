import os
import json
from flask import Flask, request, jsonify, session
from werkzeug.utils import secure_filename
from src.QA import qa_pipeline
from src.Summarize import summarize_pipeline
from src.Keyword import keyword_pipeline
from src.Flashcard import flashcard_pipeline
from src.RAG_System import run_rag_pipeline
from utils.summary_to_pdf import generate_summary_pdf
from flask import send_file

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Change this in production

# Define uploads directory (shared with Node.js)
# ml_service.py is now in src/, uploads is in parent directory
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def get_api_key():
    # API key should be passed in the request headers or body from Node.js
    # For now, we'll check the request JSON body
    data = request.get_json(silent=True) or {}
    return data.get('api_key')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'service': 'ml_service'})

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    history = data.get('history', [])
    filename = data.get('filename') # Node.js should pass the filename
    api_key = data.get('api_key')

    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
    
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404

    # Handle commands
    if message.strip().startswith('/summarize'):
        return api_summarize_internal(filepath, api_key)
    elif message.strip().startswith('/keyword'):
        return api_keyword_internal(filepath, api_key)
    
    # RAG Chat
    try:
        answer, best_chunks = run_rag_pipeline(filepath, message, api_key=api_key, history=history)
        
        # Format sources
        sources = []
        for chunk in best_chunks:
            sources.append({
                'text': chunk['text'][:200] + "...",
                'page': chunk.get('metadata', {}).get('page_number', 'Unknown')
            })
            
        return jsonify({'response': answer, 'sources': sources})
    except Exception as e:
        print(f"Error in chat: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/questions', methods=['POST'])
def api_questions():
    data = request.json or {}
    history = data.get('history', [])
    filename = data.get('filename')
    api_key = data.get('api_key')

    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
        
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404

    try:
        results = qa_pipeline(filepath, api_key, history=history)
        return jsonify({'result': results})
    except Exception as e:
        print(f"Error in questions: {e}")
        return jsonify({'error': str(e)}), 500

def api_summarize_internal(filepath, api_key):
    try:
        summary = summarize_pipeline(filepath, api_key)
        return jsonify({'response': summary})
    except Exception as e:
        print(f"Error in summarize: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/summarize', methods=['POST'])
def api_summarize():
    data = request.json
    filename = data.get('filename')
    api_key = data.get('api_key')
    
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
        
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404

    return api_summarize_internal(filepath, api_key)

def api_keyword_internal(filepath, api_key):
    try:
        keywords_data = keyword_pipeline(filepath, api_key)
        return jsonify({'response': keywords_data.get('ai_refined', '')})
    except Exception as e:
        print(f"Error in keyword: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/keyword', methods=['POST'])
def api_keyword():
    data = request.json
    filename = data.get('filename')
    api_key = data.get('api_key')
    
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
        
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404

    return api_keyword_internal(filepath, api_key)

@app.route('/api/flashcards', methods=['POST'])
def api_flashcards():
    data = request.json or {}
    history = data.get('history', [])
    filename = data.get('filename')
    api_key = data.get('api_key')

    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
        
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404

    try:
        results = flashcard_pipeline(filepath, api_key, history=history)
        return jsonify({'result': results})
    except Exception as e:
        print(f"Error in flashcards: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/download_summary_pdf', methods=['POST'])
def download_summary_pdf():
    data = request.json
    filename = data.get('filename')
    api_key = data.get('api_key')

    if not filename:
        return jsonify({'error': 'No filename provided'}), 400

    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404

    # Define output PDF path
    # We can save it in the uploads folder or a temp folder
    pdf_filename = f"{os.path.splitext(filename)[0]}_summary.pdf"
    pdf_filepath = os.path.join(UPLOAD_FOLDER, pdf_filename)

    try:
        # Check if PDF already exists to avoid re-generating (optional, but good for cache)
        # For now, let's regenerate to ensure it's fresh or if user changed settings
        # Or maybe we should check if it exists and is newer than the source file?
        # Let's just generate it.
        
        success = generate_summary_pdf(filepath, api_key, pdf_filepath)
        
        if success and os.path.exists(pdf_filepath):
            return send_file(pdf_filepath, as_attachment=True, download_name=pdf_filename)
        else:
            return jsonify({'error': 'Failed to generate PDF'}), 500

    except Exception as e:
        print(f"Error generating PDF: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run on port 5001
    app.run(debug=True, port=5001)
