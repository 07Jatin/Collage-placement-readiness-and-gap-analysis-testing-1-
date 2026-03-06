import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import os
import skill_analyzer

def predict_for_student(student_id):
    # Load historical data for training
    base_dir = os.path.dirname(__file__)
    csv_path = os.path.join(base_dir, 'historical_placement.csv')
    
    if not os.path.exists(csv_path):
        return {"error": "Historical data not found"}
        
    df = pd.read_csv(csv_path)
    
    # Simple training (In a real app, this would be pre-trained and saved)
    X = df[['cgpa', 'num_projects', 'skill_match_percent']]
    y = df['label']
    
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X, y)
    
    # Get current student metrics
    students = skill_analyzer.load_students()
    student = next((s for s in students if s['id'] == student_id), None)
    
    if not student:
        return {"error": f"Student {student_id} not found"}
        
    report = skill_analyzer.analyze_student(student_id)
    
    cgpa = student.get('cgpa', 0)
    num_projects = len(student.get('projects', []))
    skill_match = report.get('match_percent', 0)
    
    # Predict
    features = pd.DataFrame([[cgpa, num_projects, skill_match]], 
                            columns=['cgpa', 'num_projects', 'skill_match_percent'])
    
    prediction = clf.predict(features)[0]
    probs = clf.predict_proba(features)[0]
    classes = clf.classes_
    
    # Calculate a composite readiness score
    ready_idx = -1
    for i, c in enumerate(classes):
        if c == 'Ready':
            ready_idx = i
            break
            
    readiness_score = 0
    if ready_idx != -1:
        readiness_score = probs[ready_idx] * 100
    else:
        # Fallback if "Ready" class isn't in sample
        readiness_score = skill_match
        
    return {
        "student_id": student_id,
        "prediction": prediction,
        "readiness_score_percent": round(readiness_score, 2),
        "status_probs": {classes[i]: round(probs[i]*100, 2) for i in range(len(classes))}
    }
