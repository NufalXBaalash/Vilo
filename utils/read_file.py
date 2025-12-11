from pathlib import Path
from utils.markdown_conversion import convert_to_markdown

def read_file_to_text(file_path, output_folder=None):
    """
    Convert any file (PDF or DOCX) to markdown text using  utils.
    Returns the text content as a string.
    """
    file_path = Path(file_path)
    if output_folder is None:
        output_folder = Path(__file__).parent.parent / "processed"
    else:
        output_folder = Path(output_folder)
    output_folder.mkdir(exist_ok=True)

    md_file = convert_to_markdown(file_path, output_folder)
    # Read the markdown file content and return as string
    return md_file.read_text(encoding="utf-8")