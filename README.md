<div align="center">

![Vilo Logo](assets/welcome_logo.png)

# Vilo - AI Document Intelligence Platform

**Your friendly AI study companion for smarter learning**

[![Made with React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776ab?style=for-the-badge&logo=python)](https://python.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📚 About Vilo

Vilo is an AI-powered document intelligence platform that transforms how you study and interact with educational materials. Upload your PDFs or DOCX files and unlock powerful AI features including chat, Q&A generation, flashcards, summaries, and keyword extraction.

### ✨ Key Features

- 💬 **RAG Chat** - Ask questions and get instant answers from your documents
- 🧠 **Q&A Generator** - Automatically create practice questions
- 🎴 **Flashcard Generator** - Turn notes into interactive 3D flashcards
- 📝 **Smart Summarization** - Get concise summaries of long documents
- 🔍 **Keyword Extraction** - Identify key concepts and terms
- 🎨 **Beautiful UI** - Modern purple-blue gradient theme
- 💾 **Smart Caching** - Results persist across tool switches
- 🔐 **Secure Authentication** - Protected routes and user sessions

---

## 🏗️ Tech Stack

### Frontend
- **React 18.3** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **React Markdown** - Markdown rendering

### Backend
- **Node.js + Express** - Main web server
- **Python Flask** - ML microservice
- **LangChain** - Document processing
- **OpenAI API** - AI model integration (via Groq)

### AI/ML
- **RAG System** - Retrieval-Augmented Generation
- **FAISS** - Vector similarity search
- **Sentence Transformers** - Text embeddings
- **PyPDF/Docx2txt** - Document parsing

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ and npm
- **Python** 3.8+
- **Groq API Key** (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NLP_DL_Task
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Node.js dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Configure API Key**
   
   Edit `model_init/model.py` and set your Groq API key:
   ```python
   DEFAULT_API_KEY = "your-groq-api-key-here"
   ```

### Running the Application

You need to run **three services** in separate terminals:

#### Terminal 1: Python ML Service (Port 5001)
```bash
python run_ml_service.py
```
![Thinking Logo](assets/thinking_logo.png)

This starts the Flask ML service that handles all AI operations.

#### Terminal 2: Node.js Server (Port 3000)
```bash
cd server
node index.js
```
![Loading Logo](assets/loading_logo.png)

This starts the Express server for file uploads and API proxying.

#### Terminal 3: React Dev Server (Port 5173)
```bash
cd client
npm run dev
```
![Done Logo](assets/done_logo.png)

This starts the Vite development server with hot-reload.

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

**Default Login Credentials:**
- Username: `admin`
- Password: `admin`

---

## 📖 Usage Guide

### 1. Upload a Document
Click the **Upload File** button in the top-right corner and select a PDF or DOCX file.

### 2. Use AI Tools

#### 💬 Chat
Ask questions about your document and get AI-powered answers with source citations.

#### 🧠 Q&A Generator
Generate practice questions with answers, types, and locations.

#### 🎴 Flashcards
Create interactive 3D flip flashcards for studying.

#### 📝 Summarizer
Get concise summaries of your documents.

#### 🔍 Keywords
Extract categorized keywords and key concepts.

### 3. Smart Caching
- Results are cached automatically
- Switch between tools without losing data
- Cache clears on logout or page refresh

---

## 🎨 Features Showcase

### Beautiful Purple-Blue Theme
All components use a cohesive gradient color scheme matching the Vilo brand.

### Categorized Keyword Widgets
Keywords are displayed in beautiful color-coded cards organized by category:
- **Main Topics** - Broad themes
- **Key Terms** - Important concepts
- **Technical Terms** - Specialized vocabulary

### 3D Flashcards
Interactive flashcards with smooth flip animations and gradient backgrounds.

### Responsive Design
Fully responsive layout that works on desktop, tablet, and mobile devices.

---

## 📁 Project Structure

```
NLP_DL_Task/
├── assets/                    # Logo images
│   ├── welcome_logo.png
│   ├── standing-logo.png
│   ├── thinking_logo.png
│   ├── loading_logo.png
│   └── done_logo.png
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── context/          # Context providers
│   │   ├── pages/            # Page components
│   │   └── lib/              # Utilities
│   └── public/               # Static assets
├── server/                    # Node.js backend
│   └── index.js
├── src/                       # Python ML service
│   ├── ml_service.py         # Main Flask app
│   ├── RAG_System.py         # RAG implementation
│   ├── QA.py                 # Q&A generation
│   ├── Flashcard.py          # Flashcard generation
│   ├── Summarize.py          # Summarization
│   └── Keyword.py            # Keyword extraction
├── model_init/               # AI model configuration
├── utils/                    # Utility functions
├── uploads/                  # Uploaded files
└── run_ml_service.py         # ML service launcher
```

---

## 🔧 Configuration

### API Key
Update the API key in `model_init/model.py`:
```python
DEFAULT_API_KEY = "your-groq-api-key"
DEFAULT_BASE_URL = "https://api.groq.com/openai/v1"
DEFAULT_MODEL_NAME = "llama-3.1-8b-instant"
```

### Port Configuration
- **React Dev Server:** 5173 (configured in `vite.config.js`)
- **Node.js Server:** 3000 (configured in `server/index.js`)
- **Python ML Service:** 5001 (configured in `run_ml_service.py`)

---

## 🐛 Troubleshooting

### ML Service Not Responding
- Ensure Python dependencies are installed
- Check that port 5001 is not in use
- Verify API key is correctly set

### File Upload Fails
- Check that `uploads/` directory exists
- Ensure Node.js server is running on port 3000

### CORS Errors
- Verify all three services are running
- Check proxy configuration in `vite.config.js`

### White Screen
- Check browser console for errors
- Ensure all dependencies are installed
- Clear browser cache and reload

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

Built with ❤️ for students everywhere.

---

<div align="center">

![Standing Logo](assets/standing-logo.png)

**Vilo - Learn Smarter, Not Harder**

</div>
