import json
from pathlib import Path
from utils.chunking import adaptive_chunk_markdown
from utils.hybird_search import hybrid_search, build_faiss_index, build_bm25_index
from utils.markdown_conversion import convert_to_markdown
from utils.embeddings import add_embeddings_to_chunks
from model_init.model import query_model

def run_rag_pipeline(
    file_path: str,
    query: str,
    output_folder: str = None,
    top_k: int = 5,
    alpha: float = 0.5,
    api_key: str = None,
    history: list = None
):

    file_path = Path(file_path)
    if output_folder is None:
        output_folder = Path(__file__).parent / "processed"
    else:
        output_folder = Path(output_folder)
    output_folder.mkdir(exist_ok=True)

    # Cache file path
    cache_file = output_folder / f"{file_path.stem}_chunks.json"

    if cache_file.exists():
        print(f"Loading chunks from cache: {cache_file}")
        with open(cache_file, "r", encoding="utf-8") as f:
            chunks = json.load(f)
    else:
        print(f"Processing file: {file_path}")
        md_file = convert_to_markdown(file_path, output_folder)
        chunks = adaptive_chunk_markdown(md_file)
        chunks = add_embeddings_to_chunks(chunks)
        
        # Save to cache
        with open(cache_file, "w", encoding="utf-8") as f:
            json.dump(chunks, f, ensure_ascii=False, indent=2)
        print(f"Saved chunks to cache: {cache_file}")

    faiss_index = build_faiss_index(chunks)
    bm25, tokenized_texts = build_bm25_index(chunks)

    best_chunks = hybrid_search(query, chunks, bm25, tokenized_texts, faiss_index, top_k=top_k, alpha=alpha)

    context_text = "\n\n".join([c["text"] for c in best_chunks])
    
    # Format history
    history_text = ""
    if history:
        history_text = "## Chat History\n"
        for msg in history:
            role = msg.get('role', 'user')
            content = msg.get('content', '')
            history_text += f"- **{role}**: {content}\n"
        history_text += "\n"

    full_prompt = f"""
You are an intelligent assistant. Answer the question using ONLY the information below and the provided chat history.
your answer should be summarized and short but has the main information the user asked for.

## Context
{context_text}

## Question
{query}

Answer (clean and well-formatted in Markdown):
- Format the answer using clean, readable **Markdown**.
- Use headings, short paragraphs, and bullet points.
- Do NOT include raw `\\n` characters in the text.
- Keep the tone natural and smooth.
- Do NOT say "based on the context".
- If the context does not contain enough information, say: **"Not enough information to answer."**

"""


    answer = query_model(full_prompt, api_key=api_key)

    return answer, best_chunks
