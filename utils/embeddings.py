from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def add_embeddings_to_chunks(chunks):
    for chunk in chunks:
        emb = model.encode(chunk["text"])
        chunk["metadata"]["embedding"] = emb.tolist()
    return chunks
