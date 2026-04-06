import json
import os

def load_market():
    path = os.path.join(os.path.dirname(__file__), '..', 'data', 'market_data.json')
    try:
        with open(path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def load_students():
    path = os.path.join(os.path.dirname(__file__), '..', 'data', 'student_data.json')
    try:
        with open(path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def load_history():
    path = os.path.join(os.path.dirname(__file__), '..', 'data', 'test_history.json')
    try:
        with open(path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def analyze_student(student_id, target_role=None):
    students = load_students()
    market = load_market()
    history = load_history()
    
    student = next((s for s in students if s['id'] == student_id), None)
    if not student:
        raise ValueError(f"Student {student_id} not found")
        
    if target_role:
        role_info = next((r for r in market if r['role'].lower() == target_role.lower()), None)
        if not role_info:
            role_info = market[0] if market else {"role": "Unknown", "required_skills": [], "trending_skills": []}
    else:
        role_info = market[0] if market else {"role": "Unknown", "required_skills": [], "trending_skills": []}

    # Base skills from role
    required = set(role_info.get('required_skills', []))
    current = set(student.get('current_skills', []))
    
    # Analyze test results to add to missing skills
    student_history = [h for h in history if h.get("student_id") == student_id]
    test_gaps = []
    
    # Mapping for test sections to skill descriptions
    SECTION_SKILL_MAP = {
        "quantitative": "Quantitative Aptitude",
        "english": "English Proficiency",
        "reasoning": "Logical Reasoning",
        "computer_science": "Computer Science Fundamentals",
        "dsa_random_pool": "Data Structures and Algorithms"
    }

    if student_history:
        # Check most recent test for categorical performance
        latest_test = sorted(student_history, key=lambda x: x.get("test_date", ""), reverse=True)[0]
        cat_scores = latest_test.get("category_scores", {})
        
        for section, score_info in cat_scores.items():
            pct = 0
            if isinstance(score_info, dict):
                score = score_info.get("score", 0)
                total = score_info.get("total", 1)
                pct = (score / total) * 100 if total > 0 else 0
            elif isinstance(score_info, (int, float)):
                pct = score_info
            
            if pct < 50:
                skill_name = SECTION_SKILL_MAP.get(section, section)
                test_gaps.append(skill_name)
    
    missing = list(required - current)
    # Add gaps from tests that aren't already represented
    for tg in test_gaps:
        if tg not in missing and tg not in current:
            missing.append(tg)

    mastered = list(required & current)
    
    match_percent = (len(mastered) / len(required) * 100) if required else 0
    
    return {
        "student_id": student_id,
        "target_role": role_info.get('role'),
        "missing_skills": missing,
        "mastered_skills": mastered,
        "test_gaps": test_gaps, # Return explicitly for roadmap visualization
        "match_percent": round(match_percent, 2),
        "trending_recommendations": role_info.get('trending_skills', [])
    }
