from sentence_transformers import SentenceTransformer

def add_embeddings_to_chunks(chunks):
    model = SentenceTransformer("all-MiniLM-L6-v2")
    for chunk in chunks:
        emb = model.encode(chunk["text"])
        chunk["metadata"]["embedding"] = emb.tolist()
    return chunks
