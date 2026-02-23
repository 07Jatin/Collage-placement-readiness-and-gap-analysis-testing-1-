from __future__ import annotations

from datetime import datetime, timedelta
import hashlib
import secrets

from . import skill_analyzer
from .project_store import (
    SECTION_SKILL_MAP,
    load_students,
    load_test_history,
    save_students,
    save_test_history,
)


def build_readiness_prediction(student_id: str) -> dict:
    report = skill_analyzer.analyze_student(student_id)
    match_pct = report.get("match_percent", 0)
    readiness_score = min(100, match_pct + 10)

    if readiness_score >= 80:
        prediction = "Industry Ready"
    elif readiness_score >= 60:
        prediction = "Good Alignment"
    elif readiness_score >= 40:
        prediction = "Developing"
    else:
        prediction = "Action Required"

    return {
        "readiness_score_percent": readiness_score,
        "prediction": prediction,
        "confidence": 0.85,
    }


def derive_verified_skills(quiz_results: dict) -> list[str]:
    verified_skills = []
    for skill_id, result in quiz_results.items():
        score = result.get("score", 0)
        total = result.get("total", 3)
        pct = (score / total) * 100 if total > 0 else 0

        if pct >= 33:
            verified_skills.append(skill_id)
    return verified_skills


def collect_at_risk_students() -> list[dict]:
    students = load_students()
    history = load_test_history()
    threshold_date = datetime.now() - timedelta(days=30)
    at_risk = []

    for student in students:
        student_id = student.get("id")
        recent_tests = [
            item
            for item in history
            if item.get("student_id") == student_id
            and datetime.strptime(item["test_date"], "%Y-%m-%d") >= threshold_date
        ]

        if len(recent_tests) < 2:
            continue

        recent_tests.sort(key=lambda item: item["test_date"])
        initial_score = recent_tests[0]["readiness_score"]
        latest_score = recent_tests[-1]["readiness_score"]
        improvement = latest_score - initial_score

        if improvement < 5:
            at_risk.append(
                {
                    "id": student_id,
                    "name": student.get("name"),
                    "initial_score": initial_score,
                    "latest_score": latest_score,
                    "improvement": round(improvement, 2),
                    "tests_taken": len(recent_tests),
                    "status": "Stagnant" if improvement >= 0 else "Declining",
                }
            )

    return at_risk


def append_test_result(student_id: str, test_id: str, overall_score: int, category_scores: dict) -> dict:
    history = load_test_history()
    new_entry = {
        "student_id": student_id,
        "test_id": test_id,
        "test_date": datetime.now().strftime("%Y-%m-%d"),
        "readiness_score": overall_score,
        "category_scores": category_scores,
    }
    history.append(new_entry)
    save_test_history(history)
    _update_student_skills_from_scores(student_id, category_scores)
    return new_entry


def _update_student_skills_from_scores(student_id: str, category_scores: dict) -> None:
    students = load_students()
    student = next((item for item in students if item.get("id") == student_id), None)
    if not student:
        return

    current_skills = student.setdefault("current_skills", [])
    for section, score_info in category_scores.items():
        if not isinstance(score_info, dict):
            continue
        score = score_info.get("score", 0)
        total = score_info.get("total", 1)
        if total > 0 and (score / total) >= 0.7:
            for skill in SECTION_SKILL_MAP.get(section, []):
                if skill not in current_skills:
                    current_skills.append(skill)

    save_students(students)


def update_student_profile(student_id: str, name: str | None, email: str | None, target_role: str | None):
    students = load_students()
    student = next((item for item in students if item.get("id") == student_id), None)
    if not student:
        return None

    if name:
        student["name"] = name
    if email:
        student["email"] = email
    if target_role:
        student["target_role"] = target_role

    save_students(students)
    return student


def upsert_student_login(roll_no: str, password: str, name: str | None, mobile: str | None, email: str | None) -> dict:
    students = load_students()
    student = next((item for item in students if item.get("id") == roll_no), None)
    hashed_input = hashlib.sha256(password.encode()).hexdigest()

    if student:
        existing_password = student.get("password")
        if existing_password and existing_password != hashed_input:
            raise ValueError("Incorrect password for this Roll Number")
        if not existing_password:
            student["password"] = hashed_input
        if name and (not student.get("name") or student.get("name", "").startswith("Student ")):
            student["name"] = name
    else:
        student = {
            "id": roll_no,
            "password": hashed_input,
            "name": name or roll_no,
            "mobile": mobile or "",
            "email": email or "",
            "department": "Unknown",
            "semester": 1,
            "current_skills": [],
            "projects": [],
            "cgpa": 0.0,
            "placementStatus": "In Progress",
        }
        students.append(student)

    save_students(students)
    safe_student = {key: value for key, value in student.items() if key != "password"}
    safe_student["token"] = secrets.token_hex(32)
    return safe_student
