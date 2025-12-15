import os
from openai import OpenAI

# Default configuration (can be overridden)

DEFAULT_BASE_URL = "https://api.groq.com/openai/v1"
DEFAULT_MODEL_NAME = "llama-3.1-8b-instant"

def get_client(api_key=None, base_url=None):
    """
    Initialize and return an OpenAI client.
    """
    return OpenAI(
        base_url=base_url or DEFAULT_BASE_URL,
        api_key=api_key or DEFAULT_API_KEY,
    )

def query_model(prompt, api_key=None, model_name=None, base_url=None, temperature=0):
    """
    Query the model with a prompt.
    """
    client = get_client(api_key, base_url)
    model = model_name or DEFAULT_MODEL_NAME
    
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error: {str(e)}"
