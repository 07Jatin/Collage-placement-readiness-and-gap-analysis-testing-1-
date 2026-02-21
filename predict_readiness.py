import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from pathlib import Path
from typing import Dict

from skill_analyzer import analyze_student, load_students, jaccard_similarity, load_market


DATA_DIR = Path("data")
HIST_CSV = DATA_DIR / "historical_placement.csv"


def _build_features_from_student(student: Dict) -> np.ndarray:
    cgpa = float(student.get("cgpa", 0.0))
    num_projects = len(student.get("projects", []))

    # compute skill match percent against best-matching role
    market = load_market()
    student_skills = set([s.lower() for s in student.get("current_skills", [])])
    best = 0.0
    for role in market:
        req = set([r.lower() for r in role.get("required_skills", [])])
        best = max(best, jaccard_similarity(student_skills, req))

    skill_match_percent = best * 100.0

    return np.array([cgpa, num_projects, skill_match_percent], dtype=float)


def train_model():
    df = pd.read_csv(HIST_CSV)
    X = df[["cgpa", "num_projects", "skill_match_percent"]].values
    y = df["label"].values
    le = LabelEncoder()
    y_enc = le.fit_transform(y)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y_enc)
    return model, le


def predict_for_student(student_id: str) -> Dict:
    students = load_students()
    student = next((s for s in students if s["id"] == student_id), None)
    if student is None:
        raise ValueError(f"Student {student_id} not found")

    model, le = train_model()
    feat = _build_features_from_student(student).reshape(1, -1)
    probs = model.predict_proba(feat)[0]
    classes = le.inverse_transform(np.arange(len(probs)))

    # Find probability for 'Ready' class if it exists
    score_ready = 0.0
    if "Ready" in classes:
        idx = list(classes).index("Ready")
        score_ready = float(probs[idx]) * 100.0

    pred_idx = int(np.argmax(probs))
    pred_label = classes[pred_idx]

    return {
        "student_id": student_id,
        "predicted_label": str(pred_label),
        "probabilities": {str(c): float(p) for c, p in zip(classes, probs)},
        "readiness_score_percent": round(score_ready, 2),
    }


if __name__ == "__main__":
    # quick test run
    st = load_students()
    if st:
        print(predict_for_student(st[0]["id"]))
    else:
        print("No student data found. Run generate_mock_data.py first.")
