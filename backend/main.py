from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import os
import sys
import json

# Add current directory to path so we can import internal modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import skill_analyzer
from predict_readiness import predict_for_student

app = FastAPI(title="Education-Job Alignment API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/gap_report/{student_id}")
def gap_report(student_id: str, role: str = None):
    try:
        report = skill_analyzer.analyze_student(student_id, target_role=role)
        return report
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/predict_readiness/{student_id}")
def get_readiness_prediction(student_id: str):
    try:
        pred = predict_for_student(student_id)
        return pred
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/admin/skill_gaps")
def admin_skill_gaps():
    # aggregate missing skills across all students
    students = skill_analyzer.load_students()
    market = skill_analyzer.load_market()

    gap_counts = {}
    for s in students:
        sid = s.get("id")
        try:
            rep = skill_analyzer.analyze_student(sid)
            for miss in rep.get("missing_skills", []):
                gap_counts[miss] = gap_counts.get(miss, 0) + 1
        except Exception:
            continue

    # return sorted list of skills by frequency
    items = sorted(gap_counts.items(), key=lambda x: x[1], reverse=True)
    return {"missing_skill_frequencies": items}


@app.post("/compile")
def compile_code(payload: dict):
    import subprocess
    import tempfile
    
    code = payload.get("code", "")
    problem_id = payload.get("problem_id")
    language = payload.get("language", "python").lower()
    
    if language != "python":
        return {
            "output": f"Warning: {language.upper()} compiler not found in current environment.\nMock result: Logic submitted successfully for problem {problem_id}.\nIn a production environment, this would execute via a Dockerized {language} runtime.",
            "results": [{"passed": True, "output": "Logic Validated (Mock)"}]
        }
    
    # Define test cases for each problem
    test_harness = {
        1: [ # Two Sum
            {"call": "two_sum([2,7,11,15], 9)", "expected": "[0, 1]"},
            {"call": "two_sum([3,2,4], 6)", "expected": "[1, 2]"}
        ],
        2: [ # Reverse String
            {"call": "reverse_string(['h','e','l','l','o'])", "expected": "['o', 'l', 'l', 'e', 'h']"}
        ],
        3: [ # Linked List Cycle (Simple mock for demo)
            {"call": "hasCycle(None)", "expected": "False"}
        ],
        4: [ # Merge Intervals
            {"call": "merge([[1,3],[2,6],[8,10]])", "expected": "[[1, 6], [8, 10]]"}
        ],
        5: [ # Median of Two Sorted Arrays
            {"call": "findMedianSortedArrays([1,3], [2])", "expected": "2.0"}
        ]
    }
    
    cases = test_harness.get(problem_id, [])
    results = []
    full_output = ""
    
    for case in cases:
        wrapped_code = f"{code}\nprint({case['call']})"
        
        try:
            with tempfile.NamedTemporaryFile(suffix=".py", delete=False, mode='w') as f:
                f.write(wrapped_code)
                f_path = f.name
            
            proc = subprocess.run(
                [sys.executable, f_path],
                capture_output=True,
                text=True,
                timeout=2
            )
            
            os.unlink(f_path)
            
            if proc.returncode == 0:
                actual = proc.stdout.strip()
                passed = actual == str(case['expected'])
                results.append({"passed": passed, "output": actual})
                if not passed:
                    full_output += f"Case Failed: Expected {case['expected']}, got {actual}\n"
            else:
                results.append({"passed": False, "error": proc.stderr})
                full_output += f"Execution Error: {proc.stderr}\n"
                
        except subprocess.TimeoutExpired:
            results.append({"passed": False, "error": "Timeout"})
            full_output += "Error: Execution timed out (infinite loop?)\n"
        except Exception as e:
            full_output += f"Internal Error: {str(e)}\n"

    total_passed = sum(1 for r in results if r.get("passed"))
    summary = f"Results: {total_passed}/{len(results)} cases passed.\n" + full_output
    
    return {
        "output": summary,
        "results": results
    }


@app.get("/admin/at_risk_students")
def get_at_risk_students():
    import datetime
    
    students = skill_analyzer.load_students()
    history_path = os.path.join(os.path.dirname(__file__), 'test_history.json')
    
    try:
        with open(history_path, 'r') as f:
            test_history = json.load(f)
    except Exception:
        test_history = []
        
    at_risk = []
    today = datetime.datetime.now()
    thirty_days_ago = today - datetime.timedelta(days=30)
    
    for s in students:
        sid = s.get("id")
        # Filter tests for this student in the last 30 days
        s_tests = [
            t for t in test_history 
            if t["student_id"] == sid and datetime.datetime.strptime(t["test_date"], "%Y-%m-%d") >= thirty_days_ago
        ]
        
        if len(s_tests) >= 2:
            s_tests.sort(key=lambda x: x["test_date"])
            initial_score = s_tests[0]["readiness_score"]
            latest_score = s_tests[-1]["readiness_score"]
            improvement = latest_score - initial_score
            
            # If improvement is minimal (less than 5%)
            if improvement < 5:
                at_risk.append({
                    "id": sid,
                    "name": s.get("name"),
                    "initial_score": initial_score,
                    "latest_score": latest_score,
                    "improvement": round(improvement, 2),
                    "tests_taken": len(s_tests),
                    "status": "Stagnant" if improvement >= 0 else "Declining"
                })
        elif len(s_tests) == 1:
            # Maybe include them if they only took one test and it was very low?
            # For now, stick to the "despite taking tests" (plural/multiple) logic
            pass
            
    return {"at_risk_students": at_risk}


if __name__ == "__main__":
    import uvicorn
    # When running directly, we use the app object
    uvicorn.run(app, host="127.0.0.1", port=8000)
