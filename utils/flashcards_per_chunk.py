import json
from model_init.model import query_model

# Generatelashcards per chunk
def generate_flashcards_per_chunk(chunk_text, api_key, location=None, history=None):

    text_len = len(chunk_text)
    num_flashcards = max(3, min(7, text_len // 250))
    location_label = f"Location: {location}" if location else ""

    prompt = f"""
    You are an AI flashcard generator. Create **{num_flashcards} flashcards** from this text.
    Each flashcard has a front (question) and back (answer). Focus on key ideas.
    Return strictly as JSON array:
    {{
        "front": "Question/term",
        "back": "Answer/definition",
        "location": "{location if location else 'Unknown'}"
    }}

    Context:
    {location_label}

    Text:
    \"\"\"{chunk_text}\"\"\"
    """

    try:
        content = query_model(prompt, api_key=api_key)
    except Exception as e:
        print(f"Error querying model: {e}")
        return []

    if content.startswith("```json"):
        content = content[7:]
    if content.endswith("```"):
        content = content[:-3]

    content = content.strip()

    try:
        data = json.loads(content)
        if isinstance(data, list):
            return data
        elif isinstance(data, dict):
            return [data]
        else:
            return []
    except:
        return []