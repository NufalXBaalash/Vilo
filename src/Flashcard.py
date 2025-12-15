from utils.read_file import read_file_to_text
from src.QA import extract_pages_from_chunk
from utils.chunking import adaptive_chunk_markdown
from utils.flashcards_per_chunk import generate_flashcards_per_chunk

#  Full PDF / Word pipeline using  utils
def flashcard_pipeline(file_path, api_key, history=None):
    md_text = read_file_to_text(file_path)
    chunks = adaptive_chunk_markdown(text = md_text)
    all_flashcards = []

    if file_path.endswith(".pdf"):
        for chunk in chunks:
            text = chunk['text']
            pages = extract_pages_from_chunk(text)
            location_str = f"Pages {', '.join(map(str, pages))}"
            flashcards = generate_flashcards_per_chunk(text, api_key, location=location_str, history=history)
            if flashcards:
                all_flashcards.extend(flashcards)
        return all_flashcards
    
    elif file_path.endswith(".docx"):
        for i, chunk in enumerate(chunks):
            text = chunk['text']
            location_str = f"Chunk {i + 1}"
            flashcards = generate_flashcards_per_chunk(text, api_key, location=location_str, history=history)
            if flashcards:
                all_flashcards.extend(flashcards)
        return all_flashcards

    else:
        raise ValueError("Unsupported file type. Use PDF or DOCX.")
    