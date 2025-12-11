from utils.chunking import adaptive_chunk_markdown
from utils.clean_text import clean_text
from utils.read_file import read_file_to_text
from utils.extract_keywords import extract_keywords
from utils.refine_keywords_AI import refine_keywords_AI

def keyword_pipeline(file_path, api_key):
    """Reads PDF/DOCX + extracts smart keywords."""

    text = read_file_to_text(file_path)
    text = clean_text(text)

    # Chunk text
    chunks = adaptive_chunk_markdown(text=text)

    all_keywords = []

    # Extract keywords per chunk
    for chunk in chunks:
        kws = extract_keywords(chunk['text'])
        all_keywords.extend(kws)

    # Deduplicate
    all_keywords = list(dict.fromkeys(all_keywords))

     # USE AI FOR FINAL CLEANING
    ai_refined = refine_keywords_AI(all_keywords, api_key)

    return {
        "raw_keywords": all_keywords,
        "ai_refined": ai_refined
    }
