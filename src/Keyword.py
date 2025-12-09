import re
import nltk
nltk.download('stopwords')
from nltk import ngrams
from nltk.corpus import stopwords
from collections import Counter

from openai import OpenAI
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader
from utils.chunking import adaptive_chunk_markdown
from model_init.model import query_model


# ------------------------------------------
# API CLIENT
# ------------------------------------------
def get_client(api_key):
    return OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )


# ------------------------------------------
# FILE READERS
# ------------------------------------------
def read_pdf(file_path):
    loader = PyPDFLoader(file_path)
    docs = loader.load()
    return docs


def merge_pages(docs):
    full_text = ""
    for doc in docs:
        page_num = doc.metadata["page"]
        full_text += f"\n[PAGE:{page_num}]\n" + doc.page_content
    return full_text


def read_word(file_path):
    loader = Docx2txtLoader(file_path)
    docs = loader.load()
    return docs[0].page_content




# ------------------------------------------***
# PREPROCESSING & CLEANING
# ------------------------------------------
def clean_text(text):
    stop_words = set(stopwords.words("english"))

    # Lowercase
    text = text.lower()

    # Remove punctuation + numbers
    text = re.sub(r"[^a-z\s]", " ", text)

    # Tokenize
    tokens = text.split()

    # Remove stopwords + remove single letters
    cleaned = [t for t in tokens if t not in stop_words and len(t) > 1]

    return " ".join(cleaned)

# ------------------------------------------
# SMART KEYWORD EXTRACTION
# ------------------------------------------
def extract_smart_keywords(text, top_n=20):
    text = clean_text(text)
    tokens = text.split()

    # Unigrams
    unigram_counts = Counter(tokens)

    # Bigrams
    bigram_list = list(ngrams(tokens, 2))
    bigram_counts = Counter(bigram_list)

    final_keywords = []

    for bigram, count in bigram_counts.most_common():
        w1, w2 = bigram

        # Check if bigram is "strong" compared to each word
        if count > unigram_counts[w1] * 0.5 and count > unigram_counts[w2] * 0.5:
            final_keywords.append(f"{w1} {w2}")
        else:
            if w1 not in final_keywords:
                final_keywords.append(w1)
            if w2 not in final_keywords:
                final_keywords.append(w2)

    return final_keywords[:top_n]



# ------------------------------------------
# REFINE KEYWORDS WITH GPT
# ------------------------------------------
def refine_keywords_with_gpt(keywords, api_key):

    prompt = f"""Analyze the following list of potential keywords extracted from a document. 
Your task is to refine this list and provide a comprehensive, well-structured set of keywords and key phrases that best represent the document's content.

Please output the result in **Markdown** format with clear sections.

Structure the output as follows:

## Main Topics
List 3-5 broad themes or main topics covered in the document.

## Key Terms
List 10-15 important terms or concepts (single words or short phrases).

## Technical Terms
List any specialized vocabulary, jargon, or domain-specific terms.

Do NOT return JSON. Return only the Markdown text with proper formatting.

Here are the raw extracted keywords:
{keywords}
"""

    response = query_model(prompt, api_key=api_key)

    return response

# ------------------------------------------
# MAIN PIPELINE
# ------------------------------------------
def keyword_pipeline(file_path, api_key):
    """Reads PDF/DOCX + extracts smart keywords."""

    # Detect file type
    if file_path.lower().endswith(".pdf"):
        docs = read_pdf(file_path)
        text = merge_pages(docs)

    elif file_path.lower().endswith(".docx"):
        text = read_word(file_path)

    else:
        raise ValueError("Unsupported file format. Use PDF or DOCX.")

    # Chunk text
    chunks = adaptive_chunk_markdown(text=text)

    all_keywords = []

    # Extract keywords per chunk
    for chunk in chunks:
        kws = extract_smart_keywords(chunk['text'])
        all_keywords.extend(kws)

    # Deduplicate
    all_keywords = list(dict.fromkeys(all_keywords))

     # USE GROK FOR FINAL CLEANING
    ai_refined = refine_keywords_with_gpt(all_keywords, api_key)


    return {
        "raw_keywords": all_keywords,
        "ai_refined": ai_refined
    }
