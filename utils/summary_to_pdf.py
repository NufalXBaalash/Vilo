import re
from pathlib import Path
import markdown
import pdfkit
from utils.read_file import read_file_to_text
from utils.chunking import adaptive_chunk_markdown
from src.Summarize import summarize_pipeline

def normalize_text(text: str) -> str:
    """
    Normalize text to replace smart quotes, long dashes, and other non-standard characters.
    """
    text = text.replace('“', '"').replace('”', '"')
    text = text.replace('‘', "'").replace('’', "'")
    text = text.replace('–', '-').replace('—', '-')
    text = re.sub(r'[^\x20-\x7E]+', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def clean_text(text: str) -> str:
    """
    Remove unwanted special characters while keeping letters, numbers, basic punctuation, and whitespace.
    """
    text = re.sub(r'[^\w\s\.,;:!?()\-\'"]+', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def generate_summary_pdf(file_path: str, api_key: str, output_pdf_path: str):
    """
    Generates a summary PDF from the given file path.
    """
    file_path = Path(file_path)
    output_pdf_path = Path(output_pdf_path)
    
    # Use summarize_pipeline which now handles caching and header generation
    try:
        # This will return the full markdown string (from cache or generated)
        full_markdown = summarize_pipeline(file_path, api_key)
        
        # Prepend title if not already present (summarize_pipeline returns just the body)
        # Actually summarize_pipeline returns joined chunks. 
        # We can add a title here.
        if not full_markdown.startswith("# Summary"):
             full_markdown = f"# Summary: {file_path.name}\n\n{full_markdown}"

        html = markdown.markdown(full_markdown, extensions=['extra', 'smarty'])
        
        # Add some basic styling
        styled_html = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }}
                h1 {{ color: #333; text-align: center; }}
                h3 {{ color: #555; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 20px; }}
                p {{ margin-bottom: 10px; }}
                strong {{ color: #000; }}
                em {{ color: #444; }}
            </style>
        </head>
        <body>
            {html}
        </body>
        </html>
        """

        # Configure pdfkit (rely on system PATH for wkhtmltopdf)
        pdfkit.from_string(styled_html, str(output_pdf_path))
        print(f"Final summary PDF saved at: {output_pdf_path}")
        return True

    except Exception as e:
        print(f"Error generating PDF: {e}")
        return False

if __name__ == "__main__":
    # Test block
    pass
