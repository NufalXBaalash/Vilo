from model_init.model import query_model
from utils.chunking import adaptive_chunk_markdown
from utils.markdown_conversion import convert_to_markdown
from pathlib import Path
import json
import re

#  Read Files  utils
def read_file_to_text(file_path, output_folder=None):
    """
    Convert any file (PDF or DOCX) to markdown text using  utils.
    """
    file_path = Path(file_path)
    if output_folder is None:
        output_folder = Path(__file__).parent / "processed"
    else:
        output_folder = Path(output_folder)
    output_folder.mkdir(exist_ok=True)

    md_file = convert_to_markdown(file_path, output_folder)
    return md_file

def extract_pages_from_chunk(chunk_text):
    pages = re.findall(r"\[PAGE:(\d+)\]", chunk_text)
    return list(sorted(set(map(int, pages))))

#  Generate Flashcards per chunk
def generate_flashcards_per_chunk(chunk_text, api_key, location=None, history=None):

    text_len = len(chunk_text)
    num_flashcards = max(3, min(7, text_len // 250))
    location_label = f"Location: {location}" if location else ""

    prompt = f"""
    You are an AI flashcard generator. Create **{num_flashcards} flashcards** from this text.
    Each flashcard has a front (question) and back (answer). Focus on key ideas.
    Return strictly as JSON array:
    {{
        "front": "Question/term",
        "back": "Answer/definition",
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

#  Full PDF / Word pipeline using  utils
def pdf_to_flashcards(file_path, api_key, history=None):
    md_text = read_file_to_text(file_path)
    chunks = adaptive_chunk_markdown(md_text)
    all_flashcards = []

    for chunk in chunks:
        text = chunk['text']
        pages = extract_pages_from_chunk(text)
        location_str = f"Pages {', '.join(map(str, pages))}"
        flashcards = generate_flashcards_per_chunk(text, api_key, location=location_str, history=history)
        if flashcards:
            all_flashcards.extend(flashcards)
    return all_flashcards

def word_to_flashcards(file_path, api_key, history=None):
    md_text = read_file_to_text(file_path)
    chunks = adaptive_chunk_markdown(md_text)
    all_flashcards = []

    for i, chunk in enumerate(chunks):
        text = chunk['text']
        location_str = f"Chunk {i + 1}"
        flashcards = generate_flashcards_per_chunk(text, api_key, location=location_str, history=history)
        if flashcards:
            all_flashcards.extend(flashcards)
    return all_flashcards

#  The Full Pipeline
def flashcard_pipeline(filepath, api_key, history=None):
    if filepath.endswith(".pdf"):
        return pdf_to_flashcards(filepath, api_key, history=history)
    elif filepath.endswith(".docx"):
        return word_to_flashcards(filepath, api_key, history=history)
    else:
        raise ValueError("Unsupported file type. Use PDF or DOCX.")
