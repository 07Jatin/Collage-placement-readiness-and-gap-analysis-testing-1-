import json
import os

def load_market():
    path = os.path.join(os.path.dirname(__file__), 'market_data.json')
    try:
        with open(path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def load_students():
    path = os.path.join(os.path.dirname(__file__), 'student_data.json')
    try:
        with open(path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def analyze_student(student_id, target_role=None):
    students = load_students()
    market = load_market()
    
    student = next((s for s in students if s['id'] == student_id), None)
    if not student:
        raise ValueError(f"Student {student_id} not found")
        
    if target_role:
        role_info = next((r for r in market if r['role'].lower() == target_role.lower()), None)
        if not role_info:
            role_info = market[0] if market else {"role": "Unknown", "required_skills": [], "trending_skills": []}
    else:
        role_info = market[0] if market else {"role": "Unknown", "required_skills": [], "trending_skills": []}

    required = set(role_info.get('required_skills', []))
    current = set(student.get('current_skills', []))
    
    missing = list(required - current)
    mastered = list(required & current)
    
    match_percent = (len(mastered) / len(required) * 100) if required else 0
    
    return {
        "student_id": student_id,
        "target_role": role_info.get('role'),
        "missing_skills": missing,
        "mastered_skills": mastered,
        "match_percent": round(match_percent, 2),
        "trending_recommendations": role_info.get('trending_skills', [])
    }
