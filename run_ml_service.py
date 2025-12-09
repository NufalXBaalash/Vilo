#!/usr/bin/env python3
"""
Wrapper script to run ml_service.py from the root directory.
This ensures proper import paths for the src package.
"""
import sys
import os

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import and run the ml_service
from src.ml_service import app

if __name__ == '__main__':
    app.run(debug=True, port=5001)
