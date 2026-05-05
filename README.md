# Placify AI — Placement Readiness & Gap Analysis Platform

A full-stack AI-powered platform that helps students assess their placement readiness, identify skill gaps, and get personalized learning paths.

---

## 📁 Project Structure

```
final project/
│
├── backend/                    # Python FastAPI backend
│   ├── data/                   # Data files (JSON, CSV)
│   │   ├── historical_placement.csv
│   │   ├── market_data.json
│   │   ├── student_data.json
│   │   ├── test_history.json
│   │   └── lc.json
│   ├── services/               # Core service modules
│   │   ├── adzuna_client.py
│   │   ├── llm_resume_analyzer.py
│   │   ├── predict_readiness.py
│   │   ├── resume_parser.py
│   │   └── skill_analyzer.py
│   ├── tests/                  # Backend test files
│   │   ├── test_adzuna.py
│   │   ├── test_backend.py
│   │   ├── test_predict.py
│   │   └── test_submit.py
│   └── main.py                 # FastAPI app entry point
│
├── frontend/                   # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/             # Images and static assets
│   │   ├── components/         # React view components
│   │   │   ├── AdminDashboardView.js
│   │   │   ├── CodeEditorView.js
│   │   │   ├── Common.js
│   │   │   ├── DashboardView.js
│   │   │   ├── GapAnalysisView.js
│   │   │   ├── LearningPathView.js
│   │   │   ├── LoginView.js
│   │   │   ├── ManageStudentsView.js
│   │   │   ├── MockTestView.js
│   │   │   ├── ProfileView.js
│   │   │   └── ResumeUploadView.js
│   │   ├── data/               # Static data & skill configs
│   │   │   └── skillData.js
│   │   ├── utils/              # Utility helpers
│   │   ├── App.js              # Root React component
│   │   ├── index.js            # Entry point
│   │   └── index.css           # Global styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── docs/                       # Documentation & presentations
│   ├── assets/
│   │   ├── flowcharts/
│   │   │   └── flowchart_placify_ai.html
│   │   └── ppt_images/
│   ├── Project_Documentation.md
│   ├── System_Architecture_Workflow.md
│   ├── SECURITY_REPORT.md
│   ├── Exploratory_Data_Analysis.ipynb
│   ├── Major_Project_Final_Presentation.pptx
│   ├── Placify_AI_Comprehensive.pptx
│   └── Placify_AI_Presentation.pptx
│
├── logs/                       # Server runtime logs (gitignored)
│   ├── backend_server.out.log
│   ├── backend_server.err.log
│   ├── frontend_server.out.log
│   └── frontend_server.err.log
│
├── main.js                     # Electron main process
├── preload.js                  # Electron preload script
├── package.json                # Electron/root package config
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables (gitignored)
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### Backend Setup
```bash
# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate   # Windows

# Install Python dependencies
pip install -r requirements.txt

# Start backend server
cd backend
uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Run as Electron Desktop App
```bash
# From project root
npm install
npm run dev
```

---

## 🔧 Tech Stack

| Layer     | Technology                     |
|-----------|-------------------------------|
| Frontend  | React, TailwindCSS             |
| Backend   | Python, FastAPI, Uvicorn       |
| AI/ML     | Google Gemini, scikit-learn    |
| Desktop   | Electron                       |
| Data      | JSON, CSV (local file storage) |

---

## 📄 License
ISC
