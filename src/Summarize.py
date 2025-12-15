
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
    for i, chunk in enumerate(chunks, 1):
        text = chunk["text"]
        location_str = chunk.get("location", "Unknown")
        header = chunk["metadata"].get("header", f"Section {i}")
        
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
        try:
            summary = query_model(prompt, api_key=api_key)
            summaries.append(f"### {header}\n\n{summary.strip()}")
        except Exception as e:
            print(f"Error summarizing chunk {i}: {e}")
            summaries.append(f"### {header}\n\n*Error generating summary for this section.*")
            
    return "\n\n".join(summaries)

# Full Pipeline
def summarize_pipeline(file_path, api_key, output_folder=None):
    file_path = Path(file_path)
    if output_folder is None:
        output_folder = Path(__file__).parent.parent / "processed"
    else:
        output_folder = Path(output_folder)
    output_folder.mkdir(exist_ok=True)
    
    # Cache file for the final summary
    summary_cache_file = output_folder / f"{file_path.stem}_summary.md"
    
    if summary_cache_file.exists():
        print(f"Loading summary from cache: {summary_cache_file}")
        return summary_cache_file.read_text(encoding="utf-8")
        
    chunks = process_file_to_chunks(file_path, output_folder)
    final_summary = summarize_chunks(chunks, api_key)
    
    # Save to cache
    summary_cache_file.write_text(final_summary, encoding="utf-8")
    print(f"Saved summary to cache: {summary_cache_file}")
    
    return final_summary




