# Placify AI

Placement readiness and gap analysis tool built as my final year project. It helps students figure out where they stand for placements and what skills they need to work on.

---

## Project Structure

```
final project/
├── backend/                    # FastAPI backend
│   ├── data/                   # JSON and CSV data files
│   ├── services/               # Core logic modules
│   ├── tests/                  # Backend tests
│   └── main.py                 # Main server file
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/         # All the view components
│   │   ├── data/               # Skill configs
│   │   ├── App.js
│   │   └── index.css           # Global styles
│   └── package.json
│
├── docs/                       # Presentations and notebooks
│
├── main.js                     # Electron wrapper
├── requirements.txt
└── README.md
```

---

## How to Run

### What you need
- Python 3.10+
- Node.js 18+

### Backend
```bash
python -m venv .venv
.venv\Scripts\activate

pip install -r requirements.txt
cd backend
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Desktop mode (Electron)
```bash
npm install
npm run dev
```

---

## Tech Stack

| Layer     | Tech                           |
|-----------|-------------------------------|
| Frontend  | React, TailwindCSS             |
| Backend   | Python, FastAPI                |
| AI/ML     | Google Gemini, scikit-learn     |
| Desktop   | Electron                       |
| Storage   | JSON, CSV (local files)        |

---

## License
ISC
