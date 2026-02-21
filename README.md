# Dynamic Education-Job Alignment System

This project runs locally and uses JSON/CSV files as the data source. It includes:

- `generate_mock_data.py` — generate `data/market_data.json`, `data/student_data.json`, `data/historical_placement.csv`
- `skill_analyzer.py` — computes Jaccard similarity, missing skills, and recommended certifications
- `predict_readiness.py` — trains a RandomForest on local CSV and predicts readiness percentages
- `backend/main.py` — FastAPI app exposing endpoints
- `frontend/src/ReadinessGauge.jsx` — simple React component using Recharts

Usage:

1. Create a virtualenv and install dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

2. Generate mock data:

```powershell
python generate_mock_data.py
```

3. Run the FastAPI server:

```powershell
uvicorn backend.main:app --reload
```

4. Start the frontend (from `frontend`): install node deps and run dev server.

```bash
cd frontend
npm install
npm start
```

API endpoints:
- `GET /gap_report/{student_id}`
- `GET /predict_readiness/{student_id}`
- `GET /admin/skill_gaps`
