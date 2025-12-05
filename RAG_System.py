from pathlib import Path
from utils.chunking import adaptive_chunk_markdown
from utils.hybird_search import hybrid_search, build_faiss_index, build_bm25_index
from utils.markdown_conversion import convert_pdf_to_markdown
from utils.embeddings import add_embeddings_to_chunks
from model_init.model import query_model

def run_rag_pipeline(
    pdf_path: str,
    query: str,
    output_folder: str = "processed",
    top_k: int = 5,
    alpha: float = 0.5,
    api_key: str = None
):

    pdf_path = Path(pdf_path)
    output_folder = Path(output_folder)
    output_folder.mkdir(exist_ok=True)

    md_file = convert_pdf_to_markdown(pdf_path, output_folder)

    chunks = adaptive_chunk_markdown(md_file)

    chunks = add_embeddings_to_chunks(chunks)

    faiss_index = build_faiss_index(chunks)
    bm25, tokenized_texts = build_bm25_index(chunks)

    best_chunks = hybrid_search(query, chunks, bm25, tokenized_texts, faiss_index, top_k=top_k, alpha=alpha)

    context_text = "\n\n".join([c["text"] for c in best_chunks])
    full_prompt = f"""
You are an intelligent assistant. Answer the question using ONLY the information below.
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
