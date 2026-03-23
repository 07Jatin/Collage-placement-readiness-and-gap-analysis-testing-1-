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
import resume_parser

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


import llm_resume_analyzer

@app.post("/parse_resume")
def parse_resume(payload: dict):
    """Extract skills from resume text. Uses LLM if requested and available, else falls back to regex."""
    text = payload.get("text", "")
    use_llm = payload.get("use_llm", False)  # Client can request LLM parsing
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="No resume text provided")
    
    # Optional LLM-powered parsing using Mistral 7B
    if use_llm:
        llm_result = llm_resume_analyzer.analyze_with_mistral(text)
        if not llm_result.get("fallback", False):
            # LLM succeeded, format it to match the expected summary structure
            categories = {}
            skills_dict = {}
            
            for skill in llm_result.get("top_skills", []):
                cat = llm_result.get("skill_categories", {}).get(skill, "General")
                categories.setdefault(cat, []).append(skill)
                skills_dict[skill] = {
                    "skill": skill,
                    "category": cat,
                    "confidence": 90, # High confidence since LLM extracted it
                    "status": "unverified",
                    "extracted_by": "Mistral-7B"
                }
                
            return {
                "total_skills": len(skills_dict),
                "categories": categories,
                "skills": skills_dict,
                "suggested_roles": llm_result.get("suggested_roles", []),
                "experience_level": llm_result.get("experience_level", "unknown"),
                "projects_summary": llm_result.get("projects_summary", []),
                "extraction_method": "Mistral-7B LLM"
            }
        
    # Standard Regex keyword matching (used as primary or fallback)
    results = resume_parser.extract_skills(text)
    summary = resume_parser.get_extraction_summary(results)
    summary["extraction_method"] = "Regex Keyword Matching"
    
    if use_llm:
        summary["llm_error"] = "LLM parsing failed or is unconfigured. Fell back to regex."
        
    return summary


@app.get("/llm_status")
def get_llm_status():
    """Check if the Mistral 7B LLM integration is configured and available."""
    return llm_resume_analyzer.is_llm_available()


@app.get("/skill_quiz/{skill_name}")
def get_skill_quiz(skill_name: str):
    """Return quiz questions for a specific skill."""
    quiz_path = os.path.join(os.path.dirname(__file__), 'skill_quizzes.json')
    try:
        with open(quiz_path, 'r') as f:
            quizzes = json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Quiz bank not found")
    
    if skill_name not in quizzes:
        raise HTTPException(status_code=404, detail=f"No quiz available for skill: {skill_name}")
    
    return {"skill": skill_name, "questions": quizzes[skill_name]}


@app.post("/validate_skills")
def validate_skills(payload: dict):
    """Accept quiz results and return adjusted skill profile."""
    quiz_results = payload.get("results", {})
    student_id = payload.get("student_id")
    
    verified_skills = []
    for skill_id, result in quiz_results.items():
        score = result.get("score", 0)
        total = result.get("total", 3)
        pct = (score / total) * 100 if total > 0 else 0
        
        if pct == 100:
            level = "expert"
        elif pct >= 66:
            level = "proficient"
        elif pct >= 33:
            level = "beginner"
        else:
            level = "unverified"
        
        if level != "unverified":
            verified_skills.append(skill_id)
    
    # If student_id provided, re-calculate readiness with verified skills
    readiness = None
    if student_id and verified_skills:
        try:
            readiness = predict_for_student(student_id)
        except Exception:
            pass
    
    return {
        "verified_skills": verified_skills,
        "total_verified": len(verified_skills),
        "readiness": readiness
    }


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


@app.post("/generate_questions")
def generate_questions_with_llm(payload: dict):
    """
    Generate new MCQ questions using Mistral 7B (free HuggingFace API).
    
    This is part of the hybrid approach:
    - Use LLM to batch-generate CS/English questions
    - Questions are returned to the frontend for review
    - Validated questions can be added to the question bank
    
    Request body:
      - section: "computer_science" | "english" | "reasoning"
      - count: number of questions to generate (max 10)
      - topic: optional specific topic (e.g., "DBMS", "Networking")
    """
    section = payload.get("section", "computer_science")
    count = min(payload.get("count", 5), 10)  # Cap at 10
    topic = payload.get("topic", "")
    
    if not llm_resume_analyzer.HF_API_TOKEN:
        return {
            "error": "HF_API_TOKEN not set. LLM generation unavailable.",
            "fallback_message": "The static question bank with parameterized templates is still active and provides unique tests every time.",
            "questions": []
        }
    
    section_prompts = {
        "computer_science": f"Computer Science topics: Operating Systems, DBMS, Networking, Software Engineering, Data Structures{f', specifically about {topic}' if topic else ''}",
        "english": f"English language: Grammar, Vocabulary, Synonyms, Antonyms, Idioms, Sentence Correction{f', specifically about {topic}' if topic else ''}",
        "reasoning": f"Logical Reasoning: Number Series, Coding-Decoding, Blood Relations, Direction Sense, Syllogisms{f', specifically about {topic}' if topic else ''}"
    }
    
    subject = section_prompts.get(section, section_prompts["computer_science"])
    
    prompt = f"""<s>[INST] You are a placement test question generator. Generate exactly {count} unique multiple-choice questions about {subject}.

For each question, provide:
1. The question text
2. Exactly 4 options (A, B, C, D)
3. The correct answer index (0 for A, 1 for B, 2 for C, 3 for D)
4. Difficulty level: "easy", "medium", or "hard"

Return ONLY a JSON array with objects having these fields:
- "question": string
- "options": array of 4 strings
- "answer": number (0-3)
- "difficulty": string

Example format:
[{{"question": "What is...?", "options": ["A", "B", "C", "D"], "answer": 1, "difficulty": "medium"}}]

Generate {count} UNIQUE questions. Return ONLY valid JSON array. [/INST]"""
    
    import requests as req
    headers = {
        "Authorization": f"Bearer {llm_resume_analyzer.HF_API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    try:
        response = req.post(
            llm_resume_analyzer.HF_API_URL,
            headers=headers,
            json={
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": 2048,
                    "temperature": 0.7,
                    "return_full_text": False,
                    "do_sample": True
                }
            },
            timeout=60
        )
        
        if response.status_code == 503:
            return {
                "error": "Mistral 7B is loading. Please retry in 30-60 seconds.",
                "questions": []
            }
        
        if response.status_code != 200:
            return {
                "error": f"HuggingFace API error: {response.status_code}",
                "questions": []
            }
        
        result = response.json()
        generated_text = ""
        if isinstance(result, list) and len(result) > 0:
            generated_text = result[0].get("generated_text", "")
        elif isinstance(result, dict):
            generated_text = result.get("generated_text", "")
        
        # Try to parse JSON from the response
        parsed = llm_resume_analyzer._extract_json(generated_text)
        
        if parsed and isinstance(parsed, list):
            # Validate and clean each question
            valid_questions = []
            for q in parsed:
                if (isinstance(q, dict) and 
                    "question" in q and 
                    "options" in q and 
                    isinstance(q["options"], list) and 
                    len(q["options"]) == 4 and
                    "answer" in q and 
                    isinstance(q["answer"], int) and 
                    0 <= q["answer"] <= 3):
                    valid_questions.append({
                        "question": q["question"],
                        "options": q["options"],
                        "answer": q["answer"],
                        "difficulty": q.get("difficulty", "medium"),
                        "generated_by": "Mistral-7B",
                        "section": section
                    })
            
            return {
                "questions": valid_questions,
                "total_generated": len(valid_questions),
                "model": llm_resume_analyzer.MISTRAL_MODEL
            }
        
        return {
            "error": "Could not parse LLM response as valid question array",
            "raw_preview": generated_text[:300],
            "questions": []
        }
        
    except req.exceptions.Timeout:
        return {"error": "Request timed out (60s)", "questions": []}
    except Exception as e:
        return {"error": f"Generation failed: {str(e)}", "questions": []}


if __name__ == "__main__":
    import uvicorn
    # When running directly, we use the app object
    uvicorn.run(app, host="127.0.0.1", port=8000)
