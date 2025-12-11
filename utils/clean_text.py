import re
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords

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