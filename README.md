# 🧠 AI Job Recommendation System

A modern, production-ready Full-Stack application that leverages AI and NLP (Natural Language Processing) to instantly parse resumes and recommend best-fit tech jobs using contextual Semantic Matching.

Built as a startup-level product featuring a **premium Glassmorphism UI**, dark-mode toggles, fast API, and robust vector-matching algorithms.

---

## 🚀 Features

- **Semantic AI Matching:** Goes beyond basic keyword searches using `sentence-transformers` (BERT) and `Cosine Similarity` to match users to jobs based on *meaning and context*.
- **Intelligent Resume Parsing:** Upload a `.pdf` or `.docx` and the system natively extracts text to evaluate skills (via `spaCy` logic).
- **Match Explanations:** Explains *why* a specific job was recommended (e.g. "Matches your skills in React and Node").
- **Premium Frontend:** React + Vite, styled beautifully with Tailwind CSS and Framer Motion for deep OS-level "Dark Mode" and dynamic floating layouts.
- **Robust Backend:** Asynchronous Python (FastAPI) paired securely with MongoDB.

---

## 🧩 Architectural Stack

- **Frontend:** React.js, Tailwind CSS V3, Framer Motion, Axios, Lucide Icons
- **Backend:** Python 3.10+, FastAPI, Uvicorn, Passlib (Bcrypt), PyJWT
- **Database:** MongoDB (using Motor async driver)
- **AI/ML Engine:** `scikit-learn`, `sentence-transformers` (all-MiniLM-L6-v2), `pypdf`, `python-docx`, `spaCy`

---

## 🛠️ Local Development Setup

To run this application locally, you will need to start both the Python Backend and the React Frontend servers.

### Prerequisites
- Python 3.9+ installed
- Node.js v18+ installed
- A running instance of MongoDB (Local `mongodb://localhost:27017` or Atlas cloud URI)

### Part 1: Starting the Backend & AI Engine

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Virtual Environment:
   ```bash
   # On Windows
   python -m venv venv
   venv\Scripts\activate
   
   # On Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install Dependencies:
   ```bash
   # Core API dependencies
   pip install -r requirements.txt
   
   # AI tools (requires C++ build tools if on Windows)
   pip install -r ai_requirements.txt
   ```
   *(Note: The AI scripts contain Fallback logic. If `sentence-transformers` fails to install due to OS compiler issues, the API will still run using basic text-overlap routing.)*
4. Run the Dummy Data Seeder (optional but recommended):
   ```bash
   python scripts/seed_jobs.py
   ```
5. Start the FastAPI Server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The backend will boot up at **`http://localhost:8000`**.*

### Part 2: Starting the React Frontend

1. Open a **new** terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install node modules (Vite, Tailwind, etc.):
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   *The stunning UI will open at **`http://localhost:5173`**.*

---

## 🌐 API Documentation

FastAPI auto-generates Swagger documentation. With the backend running, open:
[http://localhost:8000/docs](http://localhost:8000/docs) to visually inspect and test all our REST Endpoints, including the `/api/v1/auth` and `/api/v1/resume/upload` loops!

---

## 🔒 Security
We utilized `OAuth2PasswordBearer` and JWT tracking for stateless, secure session states. Never commit the `SECRET_KEY` inside `backend/app/core/config.py` in production builds.

*Designed with ❤️ by Antigravity.*
