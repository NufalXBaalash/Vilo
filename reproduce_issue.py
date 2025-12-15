
import sys
import os
from unittest.mock import MagicMock

# Mock wordsegment
sys.modules["wordsegment"] = MagicMock()

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.chunking import adaptive_chunk_markdown

def reproduce():
    text = "This is a test string for markdown chunking."
    try:
        # This is how it is called in src/Flashcard.py currently:
        # chunks = adaptive_chunk_markdown(md_text)
        # adaptive_chunk_markdown expects file_path as first arg, or text as keyword arg.
        # If passed as first arg, it treats it as file_path (Path object) and tries to access .name
        print("Attempting to call adaptive_chunk_markdown with a string as first argument...")
        chunks = adaptive_chunk_markdown(text)
        print("Success! (Unexpected)")
    except AttributeError as e:
        print(f"Caught expected error: {e}")
        if "'str' object has no attribute 'name'" in str(e):
            print("Reproduction successful: The error matches the reported issue.")
        else:
            print("Reproduction failed: Different error message.")
    except Exception as e:
        print(f"Caught unexpected error: {e}")

if __name__ == "__main__":
    reproduce()
