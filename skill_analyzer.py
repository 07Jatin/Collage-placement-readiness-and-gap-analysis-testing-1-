import json
from pathlib import Path
from typing import Dict, List, Set, Tuple


DATA_DIR = Path("data")
MARKET_FILE = DATA_DIR / "market_data.json"
STUDENT_FILE = DATA_DIR / "student_data.json"


def load_market() -> List[Dict]:
    with open(MARKET_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def load_students() -> List[Dict]:
    with open(STUDENT_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def jaccard_similarity(a: Set[str], b: Set[str]) -> float:
    if not a and not b:
        return 1.0
    inter = len(a & b)
    union = len(a | b)
    return inter / union if union > 0 else 0.0


CERT_MAP = {
    "aws": "AWS Certified Cloud Practitioner",
    "kubernetes": "CKA/CKAD",
    "docker": "Docker Certified Associate",
    "pytorch": "Deep Learning Specialization",
    "tensorflow": "TensorFlow Developer Certificate",
    "sql": "Databases and SQL Certificate",
    "machine-learning": "Coursera ML Specialization",
}


def recommend_certifications(missing_skills: Set[str]) -> List[str]:
    recs = []
    for s in missing_skills:
        if s in CERT_MAP:
            recs.append(CERT_MAP[s])
    return recs


def analyze_student(student_id: str) -> Dict:
    market = load_market()
    students = load_students()

    student = next((s for s in students if s["id"] == student_id), None)
    if student is None:
        raise ValueError(f"Student {student_id} not found")

    student_skills = set([s.lower() for s in student.get("current_skills", [])])

    # Compute similarity against each role
    role_scores: List[Tuple[str, float, Set[str]]] = []
    for role in market:
        req = set([r.lower() for r in role.get("required_skills", [])])
        score = jaccard_similarity(student_skills, req)
        missing = req - student_skills
        role_scores.append((role["role"], score, missing))

    # Choose best matching role
    role_scores.sort(key=lambda x: x[1], reverse=True)
    best_role, best_score, missing_skills = role_scores[0]

    report = {
        "student_id": student_id,
        "student_name": student.get("name"),
        "best_role_match": best_role,
        "jaccard_score": round(best_score, 3),
        "missing_skills": sorted(list(missing_skills)),
        "recommended_certifications": recommend_certifications(missing_skills),
    }

    return report


if __name__ == "__main__":
    # quick debug run if invoked directly
    students = load_students()
    if students:
        sid = students[0]["id"]
        print(analyze_student(sid))
    else:
        print("No students found in data/student_data.json")
