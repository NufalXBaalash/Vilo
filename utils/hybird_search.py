from sentence_transformers import SentenceTransformer
from rank_bm25 import BM25Okapi
import faiss
import numpy as np
from typing import List, Dict
import re

model = SentenceTransformer("all-MiniLM-L6-v2")

def build_bm25_index(chunks: List[Dict]):
    tokenized_texts = []
    for chunk in chunks:
        words = re.findall(r'\w+', chunk["text"].lower())
        tokenized_texts.append(words)
    bm25 = BM25Okapi(tokenized_texts)
    return bm25, tokenized_texts


def build_faiss_index(chunks: List[Dict]):
    embeddings = np.array([chunk["metadata"]["embedding"] for chunk in chunks], dtype='float32')
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)
    return index

def hybrid_search(query: str, chunks: List[Dict], bm25, tokenized_texts, faiss_index, top_k: int = 5, alpha: float = 0.5):

    query_tokens = re.findall(r'\w+', query.lower())
    bm25_scores = bm25.get_scores(query_tokens)


    query_emb = model.encode(query).astype('float32').reshape(1, -1)
    D, I = faiss_index.search(query_emb, len(chunks))
    faiss_scores = -D.flatten()

    combined_scores = alpha * faiss_scores + (1 - alpha) * bm25_scores
    top_indices = np.argsort(combined_scores)[::-1][:top_k]

    results = [chunks[i] for i in top_indices]
    return results