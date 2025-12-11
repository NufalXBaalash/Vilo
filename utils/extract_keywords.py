from nltk import ngrams
from collections import Counter

def extract_keywords(text, top_n=20):
    
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