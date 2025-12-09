from model_init.model import query_model
from langchain_community.document_loaders import PyPDFLoader
from utils.chunking import adaptive_chunk_markdown
from langchain_community.document_loaders import Docx2txtLoader
import json
import re


# --- Read Files Functions ---

def read_pdf(file_path):
    loader = PyPDFLoader(file_path)
    docs = loader.load()
    return docs

def merge_pages(docs):
    full_text = ""
    for doc in docs:
        page_num = doc.metadata["page"]
        full_text += f"\n[PAGE:{page_num}]\n" + doc.page_content
    return full_text

def read_word(file_path):
    loader = Docx2txtLoader(file_path)
    docs = loader.load()
    full_text = docs[0].page_content
    return full_text

def extract_pages_from_chunk(chunk_text):
    pages = re.findall(r"\[PAGE:(\d+)\]", chunk_text)
    pages = list(sorted(set(map(int, pages))))
    return pages


# --- Generate Flashcards ---

def generate_flashcards_per_chunk(chunk_text, api_key, location=None, history=None):
    """
    Generate flashcards from a text chunk.
    Each flashcard has a front (question/term) and back (answer/definition).
    """
    text_len = len(chunk_text)
    num_flashcards = max(3, min(7, text_len // 250))

    location_label = f"Location: {location}" if location else ""

    prompt = f"""
    You are an AI flashcard generator. Your task is to create **{num_flashcards} high-quality flashcards** based on the following text chunk.
    
    Each flashcard should have:
    - **Front**: A question, term, or concept
    - **Back**: The answer, definition, or explanation
    
    Focus on the **main ideas and key concepts**, not minor details.
    
    If the text is empty, extremely short, or contains no meaningful information, return an empty list:
    []

    Return the output strictly as a valid JSON array of objects. 
    Each object must have the following structure:
    {{
        "front": "Question or term here",
        "back": "Answer or definition here",
        "location": "{location if location else 'Unknown'}"
    }}

    Context:
    {location_label}

    Text:
    \"\"\"{chunk_text}\"\"\"
    """

    try:
        content = query_model(prompt, api_key=api_key)
    except Exception as e:
        print(f"Error querying model: {e}")
        return []

    # Clean up markdown code blocks if present
    if content.startswith("```json"):
        content = content[7:]
    if content.endswith("```"):
        content = content[:-3]
    
    content = content.strip()

    try:
        data = json.loads(content)
        if isinstance(data, list):
            return data
        elif isinstance(data, dict):
            return [data]
        else:
            return []
    except:
        return []


# --- Functions for PDF or Word ---

def pdf_to_flashcards(file_path, api_key, history=None):
    pages = read_pdf(file_path)
    full_text = merge_pages(pages)
    chunks = adaptive_chunk_markdown(text=full_text)

    all_flashcards = []

    for chunk in chunks:
        text = chunk['text']
        pages = extract_pages_from_chunk(text)
        location_str = f"Pages {', '.join(map(str, pages))}"
        
        flashcard_list = generate_flashcards_per_chunk(text, api_key, location=location_str, history=history)
        if flashcard_list:
            all_flashcards.extend(flashcard_list)

    return all_flashcards

def word_to_flashcards(file_path, api_key, history=None):
    full_text = read_word(file_path)
    chunks = adaptive_chunk_markdown(text=full_text)

    all_flashcards = []
    for i, chunk in enumerate(chunks):
        text = chunk['text']
        location_str = f"Chunk {i+1}"
        
        flashcard_list = generate_flashcards_per_chunk(text, api_key, location=location_str, history=history)
        if flashcard_list:
            all_flashcards.extend(flashcard_list)

    return all_flashcards


# --------- The Full Pipeline ---------

def flashcard_pipeline(filepath, api_key, history=None):
    if filepath.endswith(".pdf"):
        return pdf_to_flashcards(filepath, api_key, history=history)
    elif filepath.endswith(".docx"):
        return word_to_flashcards(filepath, api_key, history=history)
