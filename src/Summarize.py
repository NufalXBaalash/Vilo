
from pathlib import Path
import json
from utils.chunking import adaptive_chunk_markdown
from utils.embeddings import add_embeddings_to_chunks
from utils.markdown_conversion import convert_to_markdown
from model_init.model import query_model

# Process File into Chunks
def process_file_to_chunks(file_path, output_folder=None):
    file_path = Path(file_path)
    if output_folder is None:
        output_folder = Path(__file__).parent.parent / "processed"
    else:
        output_folder = Path(output_folder)
    output_folder.mkdir(exist_ok=True)

    cache_file = output_folder / f"{file_path.stem}_chunks.json"

    if cache_file.exists():
        with open(cache_file, "r", encoding="utf-8") as f:
            chunks = json.load(f)
    else:
        md_file = convert_to_markdown(file_path, output_folder)
        chunks = adaptive_chunk_markdown(md_file)
        chunks = add_embeddings_to_chunks(chunks)
        with open(cache_file, "w", encoding="utf-8") as f:
            json.dump(chunks, f, ensure_ascii=False, indent=2)
    return chunks

# Summarize Each Chunk
def summarize_chunks(chunks, api_key):
    summaries = []
    for chunk in chunks:
        text = chunk["text"]
        location_str = chunk.get("location", "Unknown")
        prompt = f"""
You are a professional summarizer.
Create a **concise but informative summary** of the text below.
- Keep all key concepts and important examples.
- Remove minor, repetitive, or redundant details.
- Keep sentences short and easy to read.
- Highlight important notes or examples with *italics* or **bold**.
- Avoid over-summarizing; the summary should still convey the full meaning.
-Do not make it vary long 
Text to summarize: {location_str}

Text:
\"\"\"{text}\"\"\"
"""
        summary = query_model(prompt, api_key=api_key)
        summaries.append(summary.strip())
    return "\n".join(summaries)

# Full Pipeline
def summarize_pipeline(file_path, api_key, output_folder=None):
    chunks = process_file_to_chunks(file_path, output_folder)
    final_summary = summarize_chunks(chunks, api_key)
    return final_summary




