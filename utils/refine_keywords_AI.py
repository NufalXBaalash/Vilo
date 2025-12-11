from model_init.model import query_model

def refine_keywords_AI(keywords, api_key):

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