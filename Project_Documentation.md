# Placify AI - Dynamic Education-Job Alignment System

Welcome to the documentation for **Placify AI**, a comprehensive, dynamic platform designed to bridge the gap between academic education and modern job market requirements. This documentation will guide you from the basic understanding of the project to its advanced technical architecture.

---

## 📖 1. Basic Overview

### What is Placify AI?
Placify AI is a full-stack platform built to evaluate, assess, and guide students toward readiness for job placements. By utilizing a hybrid approach of traditional logic and advanced AI (Mistral 7B LLM), it provides actionable insights into a student's resume, identifies skill gaps contrary to actual market requirements, and gives continuous feedback through mock tests and hands-on coding challenges.

### Core Objectives
- **Assess** student readiness for placements out of 100%.
- **Analyze** resumes to extract authenticated skills.
- **Identify** gaps between current skills and industry demands.
- **Train** students through AI-generated questions and a dedicated DSA (Data Structures and Algorithms) coding lab.
- **Track** performance for administrators to identify at-risk students who need intervention.

---

## ✨ 2. Key Features

1. **Dashboard & Gap Analysis**
   - Interactive widgets displaying placement readiness score.
   - Gap analysis that highlights what skills a student is missing based on target job roles and live market data.

2. **Smart Resume Parser (Regex + LLM)**
   - Upload and parse PDF resumes natively in the browser.
   - Initial robust regex extraction powered by `skill_analyzer`.
   - Advanced **Mistral 7B LLM** integration to comprehensively detect nested skills, suggest roles, and organize skills into coherent categories.

3. **Dynamic DSA Coding Lab**
   - Connects dynamically with **LeetCode's GraphQL API** to pull real-world coding challenges based on selected topics.
   - An in-built compiler engine supporting **Python, Java, C++, and C**.
   - Leverages executing external code via the **Piston API** alongside native local Python sandboxing for code safety.

4. **Adaptive Mock Testing & Interventions**
   - Automatically generates tailored MCQs by securely polling HuggingFace inference APIs for Mistral 7B.
   - Captures scores to readjust the student’s readiness prediction in real-time using a Random Forest predictive model.
   - Detailed administrative views to observe "Stagnant" or "Declining" test-takers over designated periods.

5. **Live Job Market Integration**
   - Queries the **Adzuna API** to inject live industry standards, helping to calculate realistic requirement gaps.

---

## 🛠️ 3. Technology Stack

### Frontend (User Interface)
- **Framework:** React 18
- **Styling:** TailwindCSS, Vanilla CSS overrides (`index.css`)
- **Charting & Icons:** Recharts (visualization), Lucide React (feather icons)
- **File Parsing:** `pdfjs-dist` & `mammoth` for local file processing 

### Backend (API & Engine)
- **Framework:** FastAPI (Python)
- **Machine Learning:** `scikit-learn` for readiness prediction (RandomForest).
- **AI Integrations:** Free inference using HuggingFace APIs. External Adzuna integrations via custom adapters.
- **Compiler Execution:** Open-Source Piston API paired with `subprocess` for native Python fallback compilation.
- **Databases:** Local persistency using abstracted `JSON` and `CSV` files acting as a NoSQL/Relational mock system.

---

## 🚀 4. Setup and Installation

### Prerequisites
- Node.js (v16+)
- Python (v3.9+)

### Step-by-step Setup
1. **Clone the project & initialize virtual environment**
```bash
# Set up server
python -m venv .venv
.\.venv\Scripts\activate   # On Windows
pip install -r requirements.txt
```

2. **Generate Database Collections**
```bash
python generate_mock_data.py
```
*(This command bootstraps local data files like market_data.json, student_data.json, and historical mock files).*

3. **Start the API Backend**
```bash
uvicorn backend.main:app --reload
# API available at http://127.0.0.1:8000
```

4. **Launch the React Frontend**
```bash
cd frontend
npm install
npm start
# Client available at http://localhost:3000
```

---

## 🧠 5. Advanced Architecture Details

### The Compiler Engine Pipeline
For the DSA Code Compiler feature (`CodeEditorView.js`), the backend implements a resilient multi-tier compiling strategy (`/compile` endpoint):
- **Tier 1 (Dynamic)**: For blindly fetched LeetCode questions, the backend securely uses Pythons `ast` mapping to syntax check code without executing malicious payloads.
- **Tier 2 (Supported Languages via API)**: Compiles C++, Java, and C by wrapping user submissions in specialized generic functions mimicking LeetCode’s interface, sending them off to a lightweight remote code execution network (Piston).
- **Tier 3 (Local Fallback)**: For explicit Python queries, falling back onto a locally defined temp-file sandboxing mechanism executed by the host's `sys.executable`.

### Mistral 7B Generator Interoperability
When generating mock test questions or parsing complex resumes, the backend intercepts HTTP requests and streams structured prompts to the Hugging Face `api.hf.co` endpoints:
- A rigid JSON mapping array string (`[{"question"...,"options"...}]`) is placed inside `<s>[INST]...[/INST]` tokens to force the LLM to reply directly with parsed arrays.
- A native `_extract_json` method intercepts the raw output and forcefully repairs/cleans any hallucinated text wrapping prior to passing it to the frontend `MockTestView.js`.

### Readiness Prediction (RandomForest)
Under `predict_readiness.py`, the system trains a classifier spanning historical placement data (`historical_placement.csv`) using metrics like CGPA, Mock Test Scores, Communication arrays, and existing technical arrays. Continuous updates to the frontend JSON trigger real-time predictions directly into the `GapAnalysisView`.
