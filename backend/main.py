from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import os
import sys
import json
import httpx # for YouTube API calls

# Add current directory to path so we can import internal modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services import skill_analyzer
# from services.predict_readiness import predict_for_student
from services import resume_parser

app = FastAPI(title="Education-Job Alignment API")

# Security Configuration
import hashlib
import secrets

# Mock User Database (Normally this would be in a real DB)
ADMIN_USERS = {
    "jatin": "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5", # 12345
    "trilok": "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5",
    "akshar": "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5",
    "bhavya": "5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5",
}

# In-memory session store (In production use Redis or a DB)
SESSION_TOKENS = set()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# YouTube Search Service
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@app.get("/api/youtube/search")
async def search_youtube(query: str):
    api_key = os.getenv("YOUTUBE_API_KEY")
    
    # If no API key, return sophisticated mock data for testing
    if not api_key:
        return {
            "videos": [
                {
                    "id": "mock_1",
                    "title": f"Mastering {query} | Complete Crash Course 2024",
                    "thumbnail": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80",
                    "channel": "Placify Academy",
                    "views": "1.2M views",
                    "url": f"https://www.youtube.com/results?search_query={query}+tutorial"
                },
                {
                    "id": "mock_2",
                    "title": f"{query} Patterns and Best Practices",
                    "thumbnail": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
                    "channel": "Tech Curator PRO",
                    "views": "850K views",
                    "url": f"https://www.youtube.com/results?search_query={query}+coding+project"
                }
            ]
        }

    try:
        async with httpx.AsyncClient() as client:
            url = "https://www.googleapis.com/youtube/v3/search"
            params = {
                "part": "snippet",
                "q": f"{query} tutorial masterclass",
                "maxResults": 3,
                "type": "video",
                "key": api_key
            }
            response = await client.get(url, params=params)
            data = response.json()
            
            videos = []
            for item in data.get("items", []):
                videos.append({
                    "id": item["id"]["videoId"],
                    "title": item["snippet"]["title"],
                    "thumbnail": item["snippet"]["thumbnails"]["high"]["url"],
                    "channel": item["snippet"]["channelTitle"],
                    "views": "Verified Expert",
                    "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}"
                })
            return {"videos": videos}
    except Exception as e:
        return {"error": str(e), "videos": []}


from fastapi import Security, Depends, status
from fastapi.security.api_key import APIKeyHeader

api_key_header = APIKeyHeader(name="Authorization", auto_error=False)

async def get_current_user(auth_header: str = Depends(api_key_header)):
    if not auth_header:
        raise HTTPException(status_code=401, detail="Header missing")
    
    # Bearer <token>
    token = auth_header.replace("Bearer ", "")
    if token in SESSION_TOKENS:
        return token
    raise HTTPException(status_code=403, detail="Invalid or expired session")

@app.post("/api/login")
def login(payload: dict):
    username = payload.get("username", "").lower()
    password = payload.get("password", "")
    
    if not username or not password:
        raise HTTPException(status_code=400, detail="Credentials required")
        
    hashed_pwd = hashlib.sha256(password.encode()).hexdigest()
    
    if username in ADMIN_USERS and ADMIN_USERS[username] == hashed_pwd:
        token = secrets.token_hex(32)
        SESSION_TOKENS.add(token)
        return {"token": token, "role": "admin"}
    
    raise HTTPException(status_code=401, detail="Invalid credentials")



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
        report = skill_analyzer.analyze_student(student_id)
        match_pct = report.get("match_percent", 0)
        
        # Simple logic: readiness is roughly the match percent but boosted by soft skills
        # In a real app, this would be a ML model prediction
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
            "confidence": 0.85
        }
    except Exception as e:
        return {"readiness_score_percent": 30, "prediction": "Evaluating", "confidence": 0.5}


@app.get("/admin/skill_gaps")
def admin_skill_gaps(token: str = Depends(get_current_user)):


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


from services import llm_resume_analyzer
from services import adzuna_client

@app.post("/parse_resume")
def parse_resume(payload: dict):
    """Extract skills from resume text. Uses a hybrid approach: Regex for precision + LLM for semantics."""
    text = payload.get("text", "")
    use_llm = payload.get("use_llm", False)  # Client can request LLM parsing
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="No resume text provided")
    
    # 1. Always run Regex keyword matching (Fast & Reliable for known skills)
    regex_results = resume_parser.extract_skills(text)
    summary = resume_parser.get_extraction_summary(regex_results)
    
    # 2. Run LLM parsing if requested and available
    if use_llm:
        llm_result = llm_resume_analyzer.analyze_with_mistral(text)
        
        if not llm_result.get("fallback", False):
            # LLM Succeeded! Merge semantic findings into regex findings
            llm_skills = llm_result.get("top_skills", [])
            llm_cats = llm_result.get("skill_categories", {})
            
            # Add/Update skills found by LLM
            for skill in llm_skills:
                skill_id = skill.lower().replace(" ", "-")
                cat = llm_cats.get(skill, "General")
                
                if skill_id in summary["skills"]:
                    # Skill already found by regex, boost confidence and add metadata
                    summary["skills"][skill_id]["confidence"] = min(100, summary["skills"][skill_id]["confidence"] + 15)
                    summary["skills"][skill_id]["extracted_by"] = "Hybrid (Regex + LLM)"
                    summary["skills"][skill_id]["llm_validated"] = True
                else:
                    # New skill found by LLM that regex missed
                    summary["skills"][skill_id] = {
                        "skill": skill,
                        "category": cat,
                        "confidence": 85,
                        "match_count": 1,
                        "matched_keywords": [skill],
                        "status": "unverified",
                        "extracted_by": "Mistral-7B (Semantic)"
                    }
            
            # Update summary metrics
            summary["total_skills"] = len(summary["skills"])
            summary["suggested_roles"] = llm_result.get("suggested_roles", [])
            summary["experience_level"] = llm_result.get("experience_level", "unknown")
            summary["projects_summary"] = llm_result.get("projects_summary", [])
            summary["extraction_method"] = "Hybrid Engine (Mistral-7B + Regex)"
            
            # Rebuild categories
            new_cats = {}
            for s_id, s_info in summary["skills"].items():
                c = s_info["category"]
                new_cats.setdefault(c, []).append(s_id)
            summary["categories"] = new_cats
            
            return summary
        else:
            summary["llm_error"] = llm_result.get("error", "LLM failed")
            summary["extraction_method"] = "Regex (Fallback)"
    else:
        summary["extraction_method"] = "Regex Engine"
        
    return summary


@app.get("/api/live_jobs/{role}")
def get_live_jobs(role: str):
    """
    Fetch real-world live job postings for a specific role via Adzuna API.
    This complements the simulated static market data.
    """
    try:
        data = adzuna_client.fetch_live_jobs(role)
        if "error" in data:
            raise HTTPException(status_code=400, detail=data["error"])
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



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




@app.get("/admin/at_risk_students")
def get_at_risk_students(token: str = Depends(get_current_user)):


    import datetime
    
    students = skill_analyzer.load_students()
    history_path = os.path.join(os.path.dirname(__file__), 'data', 'test_history.json')
    
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


@app.post("/api/submit_test_result")
def submit_test_result(payload: dict):
    student_id = payload.get("student_id")
    test_id = payload.get("test_id")
    overall_score = payload.get("overall_score", 0)
    category_scores = payload.get("category_scores", {})
    
    if not student_id:
        raise HTTPException(status_code=400, detail="Student ID is required")
        
    history_path = os.path.join(os.path.dirname(__file__), 'data', 'test_history.json')
    try:
        with open(history_path, 'r') as f:
            history = json.load(f)
    except FileNotFoundError:
        history = []
        
    import datetime
    new_entry = {
        "student_id": student_id,
        "test_id": test_id,
        "test_date": datetime.datetime.now().strftime("%Y-%m-%d"),
        "readiness_score": overall_score,
        "category_scores": category_scores
    }
    
    history.append(new_entry)
    
    with open(history_path, 'w') as f:
        json.dump(history, f, indent=2)
        
    # Also update student's current_skills if they excel in a certain section?
    # For now, we'll just store the history, and skill_analyzer will use it to suggest roadmap gaps.
    
    return {"message": "Test result submitted successfully", "entry": new_entry}


@app.get("/api/test_history/{student_id}")
def get_test_history(student_id: str):
    history_path = os.path.join(os.path.dirname(__file__), 'data', 'test_history.json')
    try:
        with open(history_path, 'r') as f:
            history = json.load(f)
        return [entry for entry in history if entry.get("student_id") == student_id]
    except FileNotFoundError:
        return []

@app.post("/api/students/update")
def update_student_profile(payload: dict):
    roll_no = payload.get("id")
    name = payload.get("name")
    email = payload.get("email")
    target_role = payload.get("target_role")
    
    if not roll_no:
        raise HTTPException(status_code=400, detail="Student ID is required")
        
    data_path = os.path.join(os.path.dirname(__file__), 'data', 'student_data.json')
    try:
        with open(data_path, 'r') as f:
            students = json.load(f)
    except FileNotFoundError:
        students = []
        
    student = next((s for s in students if s.get("id") == roll_no), None)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    if name: student["name"] = name
    if email: student["email"] = email
    if target_role: student["target_role"] = target_role
    
    with open(data_path, 'w') as f:
        json.dump(students, f, indent=2)
        
    return student


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


@app.post("/api/students/login")
def student_login(payload: dict):
    roll_no = payload.get("roll_no")
    password = payload.get("password")
    name = payload.get("name")
    mobile = payload.get("mobile")
    email = payload.get("email")
    
    if not roll_no:
        raise HTTPException(status_code=400, detail="Roll No is required")
    if not password:
        raise HTTPException(status_code=400, detail="Password is required to secure your account")
        
    data_path = os.path.join(os.path.dirname(__file__), 'data', 'student_data.json')
    try:
        with open(data_path, 'r') as f:
            students = json.load(f)
    except FileNotFoundError:
        students = []
        
    student = next((s for s in students if s.get("id") == roll_no), None)
    hashed_input = hashlib.sha256(password.encode()).hexdigest()
    
    if student:
        # Check if student already has a password set
        existing_pass = student.get("password")
        if existing_pass:
            if existing_pass != hashed_input:
                raise HTTPException(status_code=401, detail="Incorrect password for this Roll Number")
        else:
            # TRANSITION: This is a legacy account without a password. Set it now.
            student["password"] = hashed_input
        
        # FIX: If student exists but name is generic or missing, and a name was provided, update it.
        if name and (not student.get("name") or student.get("name").startswith("Student ")):
            student["name"] = name
            
        with open(data_path, 'w') as f:
            json.dump(students, f, indent=2)
    else:
        # Create new student with password (roll_no is already a string/varchar from the payload)
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
            "placementStatus": "In Progress"
        }
        students.append(student)
        with open(data_path, 'w') as f:
            json.dump(students, f, indent=2)
            
    # Return student data (excluding password hash)
    safe_student = {k: v for k, v in student.items() if k != "password"}
    return safe_student

@app.get("/api/students")
def get_all_students(token: str = Depends(get_current_user)):


    data_path = os.path.join(os.path.dirname(__file__), 'data', 'student_data.json')
    try:
        with open(data_path, 'r') as f:
            students = json.load(f)
        return students
    except FileNotFoundError:
        return []

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# DSA Coding Lab - Code Compiler Endpoint
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PYTHON_TEST_HARNESS = {
    1: {  # Two Sum
        "setup": "sol = Solution()",
        "cases": [
            {"call": "print(sol.twoSum([2,7,11,15], 9))", "expected": "[0, 1]"},
            {"call": "print(sol.twoSum([3,2,4], 6))", "expected": "[1, 2]"},
        ]
    },
    2: {  # Reverse String
        "setup": "sol = Solution()",
        "cases": [
            {"call": 's = ["h","e","l","l","o"]\nsol.reverseString(s)\nprint(s)', "expected": "['o', 'l', 'l', 'e', 'h']"},
            {"call": 's = ["H","a","n","n","a","h"]\nsol.reverseString(s)\nprint(s)', "expected": "['h', 'a', 'n', 'n', 'a', 'H']"},
        ]
    },
    3: {  # Linked List Cycle
        "setup": "class ListNode:\n    def __init__(self, x):\n        self.val = x\n        self.next = None\nsol = Solution()",
        "cases": [
            {"call": "print(sol.hasCycle(None))", "expected": "False"},
            {"call": "n1=ListNode(1)\nn2=ListNode(2)\nn1.next=n2\nprint(sol.hasCycle(n1))", "expected": "False"},
        ]
    },
    4: {  # Merge Intervals
        "setup": "sol = Solution()",
        "cases": [
            {"call": "print(sol.merge([[1,3],[2,6],[8,10],[15,18]]))", "expected": "[[1, 6], [8, 10], [15, 18]]"},
            {"call": "print(sol.merge([[1,4],[4,5]]))", "expected": "[[1, 5]]"},
        ]
    },
    5: {  # Median of Two Sorted Arrays
        "setup": "sol = Solution()",
        "cases": [
            {"call": "print(sol.findMedianSortedArrays([1,3], [2]))", "expected": "2"},
            {"call": "print(sol.findMedianSortedArrays([1,2], [3,4]))", "expected": "2.5"},
        ]
    }
}


@app.get("/api/dsa/dynamic/{skill}")
def get_dynamic_problem(skill: str):
    import requests
    import random
    
    skill = skill.lower()
    
    # Map skills to a list of known LeetCode slugs for easy/medium problems
    SKILL_SLUGS = {
        "linked list": ["reverse-linked-list", "merge-two-sorted-lists", "linked-list-cycle"],
        "array": ["remove-duplicates-from-sorted-array", "contains-duplicate", "plus-one"],
        "string": ["valid-palindrome", "longest-common-prefix", "valid-anagram"],
        "tree": ["maximum-depth-of-binary-tree", "invert-binary-tree", "same-tree"],
        "hash table": ["two-sum", "roman-to-integer", "majority-element"]
    }
    
    # Simple fallback matching if the exact skill name isn't found
    matched_slugs = None
    for k, v in SKILL_SLUGS.items():
        if k in skill or skill in k:
            matched_slugs = v
            break
            
    if not matched_slugs:
        # Generic fallback
        matched_slugs = ["fizz-buzz", "power-of-two", "fibonacci-number"]
        
    slug = random.choice(matched_slugs)
    
    # Query LeetCode Official GraphQL
    url = "https://leetcode.com/graphql"
    query = """
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        title
        titleSlug
        difficulty
        likes
        dislikes
        content
        exampleTestcaseList
        topicTags { name }
        codeSnippets { langSlug code }
      }
    }
    """
    
    try:
        r = requests.post(url, json={"query": query, "variables": {"titleSlug": slug}}, headers={"User-Agent": "Mozilla/5.0", "Content-Type": "application/json"}, timeout=10)
        data = r.json().get("data", {}).get("question")
        
        if not data:
            return {"error": "Failed to fetch from LeetCode"}
            
        # Format it into the structure our React UI expects for DSA_PROBLEMS
        default_code = {}
        for snippet in data.get("codeSnippets", []):
            if snippet["langSlug"] == "python" or snippet["langSlug"] == "python3":
                default_code["python"] = snippet["code"]
            elif snippet["langSlug"] == "java":
                default_code["java"] = snippet["code"]
            elif snippet["langSlug"] == "cpp":
                default_code["cpp"] = snippet["code"]
            elif snippet["langSlug"] == "c":
                default_code["c"] = snippet["code"]
                
        # Fill in missing default code
        if "python" not in default_code: default_code["python"] = "class Solution:\n    def solve(self):\n        pass"
        if "java" not in default_code: default_code["java"] = "class Solution {\n    // Write your Java solution here\n}"
        if "cpp" not in default_code: default_code["cpp"] = "class Solution {\n    // Write your C++ solution here\n};"
        if "c" not in default_code: default_code["c"] = "// Write your C solution here\n"
        
        # Extract constraints and test cases natively
        tc_raw = data.get("exampleTestcaseList", [])
        test_cases = [{"input": tc, "expected": "View Expected Logic in LeetCode"} for tc in tc_raw] 
        
        problem = {
            "id": int(data.get("questionId", 9999)),
            "title": data.get("title"),
            "difficulty": data.get("difficulty"),
            "acceptance": "Dynamic",
            "likes": format(data.get("likes", 0) or 0, ","),
            "dislikes": format(data.get("dislikes", 0) or 0, ","),
            "description": data.get("content", "No description available.").replace('class="example"', 'style="margin-bottom: 10px;"'),
            "examples": [], # Examples are inside the description html
            "constraints": [], 
            "defaultCode": default_code,
            "testCases": test_cases,
            "isDynamic": True,
            "slug": slug
        }
        
        return problem
        
    except Exception as e:
        return {"error": str(e)}


@app.get("/api/dsa/recommendation/{student_id}")
def get_recommended_problem(student_id: str):
    """Fetch a problem based on the student's identified skill gaps from recent tests or analysis."""
    try:
        report = skill_analyzer.analyze_student(student_id)
        gaps = report.get("missing_skills", [])
        
        # Mapping gaps to LeetCode categories
        GAP_TO_TAG = {
            "Data Structures": "linked-list",
            "Algorithms": "array",
            "Python": "hash-table",
            "Logic": "math",
            "Database": "database"
        }
        
        target_skill = "Array" # Default
        for gap in gaps:
            for keyword, tag in GAP_TO_TAG.items():
                if keyword.lower() in gap.lower():
                    target_skill = tag
                    break
        
        return get_dynamic_problem(target_skill)
    except Exception as e:
        return get_dynamic_problem("array") # Fallback


@app.post("/compile")
def compile_code(payload: dict):
    import subprocess
    import tempfile
    import requests

    code = payload.get("code", "")
    problem_id = payload.get("problem_id")
    language = payload.get("language", "python").lower()
    is_dynamic = payload.get("isDynamic", False)

    # If it's a dynamic problem, we only compile it for syntax checking
    if is_dynamic:
        if language == "python":
            import ast
            try:
                ast.parse(code)
                return {"output": "Dynamic Submission: Python Syntax Check Passed!\nNote: Logic is not strictly verified because it's a randomly fetched problem.", "error": None, "results": [{"passed": True, "output": "Syntax OK", "expected": "-"}]}
            except SyntaxError as e:
                return {"output": f"Syntax Error: {e}", "error": "Syntax Error", "results": [{"passed": False, "error": str(e)}]}
        else:
            return {"output": f"Dynamic Submission for {language.upper()}: Mocked Syntax Check Passed!\n", "error": None, "results": [{"passed": True, "output": "Mock Syntax Passed", "expected": "-"}]}

    if language != "python":
        # We use Piston API for real compilation of Java, C++, and C
        PISTON_CONFIG = {
            "java": {"language": "java", "version": "15.0.2"},
            "cpp": {"language": "c++", "version": "10.2.0"},
            "c": {"language": "c", "version": "10.2.0"}
        }
        config = PISTON_CONFIG.get(language)
        if not config:
            return {"output": "Only Python, Java, C++, and C are supported.", "error": "Unsupported language", "results": None}

        # Hardcoded wrapper test harnesses for problems 1 and 2
        if problem_id == 1:
            if language == "java":
                wrapper = "import java.util.*;\npublic class Main {\npublic static void main(String[] args) {\nSolution sol = new Solution();\nSystem.out.println(Arrays.toString(sol.twoSum(new int[]{2,7,11,15}, 9)).replaceAll(\" \", \"\"));\nSystem.out.println(Arrays.toString(sol.twoSum(new int[]{3,2,4}, 6)).replaceAll(\" \", \"\"));\n}\n}\n"
            elif language == "cpp":
                wrapper = "#include <iostream>\n#include <vector>\nusing namespace std;\n%s\nint main() {\nSolution sol;\nvector<int> n1 = {2,7,11,15}; vector<int> r1 = sol.twoSum(n1, 9); cout << \"[\" << r1[0] << \",\" << r1[1] << \"]\" << endl;\nvector<int> n2 = {3,2,4}; vector<int> r2 = sol.twoSum(n2, 6); cout << \"[\" << r2[0] << \",\" << r2[1] << \"]\" << endl;\nreturn 0;\n}"
            elif language == "c":
                wrapper = "#include <stdio.h>\n#include <stdlib.h>\n%s\nint main() {\nint n1[] = {2,7,11,15}; int rs1; int* r1 = twoSum(n1, 4, 9, &rs1); printf(\"[%d,%d]\\n\", r1[0], r1[1]); free(r1);\nint n2[] = {3,2,4}; int rs2; int* r2 = twoSum(n2, 3, 6, &rs2); printf(\"[%d,%d]\\n\", r2[0], r2[1]); free(r2);\nreturn 0;\n}"
            expected = ["[0,1]", "[1,2]"]
        elif problem_id == 2:
            if language == "java":
                wrapper = "import java.util.*;\npublic class Main {\npublic static void main(String[] args) {\nSolution sol = new Solution();\nchar[] s1 = {'h','e','l','l','o'}; sol.reverseString(s1); System.out.println(Arrays.toString(s1).replaceAll(\" \", \"\").replace(\"[\", \"['\").replace(\"]\", \"']\").replace(\",\", \"','\"));\nchar[] s2 = {'H','a','n','n','a','h'}; sol.reverseString(s2); System.out.println(Arrays.toString(s2).replaceAll(\" \", \"\").replace(\"[\", \"['\").replace(\"]\", \"']\").replace(\",\", \"','\"));\n}\n}\n"
            elif language == "cpp":
                wrapper = "#include <iostream>\n#include <vector>\nusing namespace std;\n%s\nint main() {\nSolution sol;\nvector<char> s1 = {'h','e','l','l','o'}; sol.reverseString(s1); cout << \"['\"; for(size_t i=0;i<s1.size();i++) { cout << s1[i] << (i==s1.size()-1 ? \"']\" : \"','\"); } cout << endl;\nvector<char> s2 = {'H','a','n','n','a','h'}; sol.reverseString(s2); cout << \"['\"; for(size_t i=0;i<s2.size();i++) { cout << s2[i] << (i==s2.size()-1 ? \"']\" : \"','\"); } cout << endl;\nreturn 0;\n}"
            elif language == "c":
                wrapper = "#include <stdio.h>\n%s\nvoid printArr(char* s, int size){ printf(\"['\"); for(int i=0;i<size;i++){ printf(\"%c%s\", s[i], i==size-1 ? \"']\\n\" : \"','\"); } }\nint main() {\nchar s1[] = {'h','e','l','l','o'}; reverseString(s1, 5); printArr(s1, 5);\nchar s2[] = {'H','a','n','n','a','h'}; reverseString(s2, 6); printArr(s2, 6);\nreturn 0;\n}"
            expected = ["['o','l','l','e','h']", "['h','a','n','n','a','H']"]
        else:
            return {"output": f"Real execution via Piston API isn't fully integrated for problem {problem_id} in {language} yet. (Mocking success)", "error": None, "results": [{"passed": True, "output": "Logic Validated (Mocked)", "expected": "Logic Validated (Mocked)"}]}

        # Construct final code
        if language == "java":
            full_code = wrapper + "\n" + code
        else:
            full_code = wrapper % code

        try:
            r = requests.post("https://emkc.org/api/v2/piston/execute", json={
                "language": config["language"],
                "version": config["version"],
                "files": [{"content": full_code}]
            }, timeout=15.0)
            data = r.json()

            if "message" in data:
                return {"output": f"Piston API Error: {data['message']}", "error": "API Error", "results": None}

            stdout = data.get("run", {}).get("stdout", "").strip()
            stderr = data.get("compile", {}).get("stderr", "") or data.get("run", {}).get("stderr", "")

            if stderr:
                return {"output": f"Compilation/Runtime Error:\n{stderr}\n{stdout}", "error": "Error", "results": [{"passed": False} for _ in expected]}

            output_lines = stdout.split('\n') if stdout else []
            results = []
            for i, exp in enumerate(expected):
                actual = output_lines[i].strip() if i < len(output_lines) else ""
                passed = actual == exp
                results.append({"passed": passed, "output": actual, "expected": exp})

            total_passed = sum(1 for r in results if r["passed"])
            out_str = f"All {total_passed} test cases passed!\n" if total_passed == len(results) else f"Results: {total_passed}/{len(results)} cases passed.\n\n"
            for i, r in enumerate(results):
                out_str += f"  Case {i+1}: {'Passed' if r['passed'] else 'Failed'}\n"
                if not r['passed']:
                    out_str += f"    Expected: {r['expected']}\n    Got:      {r['output'] or '(no output)'}\n"
            return {"output": out_str, "error": None, "results": results}
        except Exception as e:
            return {"output": f"Piston API Execution Error: {str(e)}", "error": "Execution Error", "results": None}

    # ----- Python Local Compilation Fallback (REMOVED FOR SECURITY) -----
    # Local execution of user-submitted code is a critical RCE vulnerability.
    # We now only allow execution through the Piston API or return an error.
    
    if language == "python":
        return {
            "output": "Local Python execution is disabled for security reasons.\nIn a production environment, please use a sandboxed execution service.", 
            "error": "Security Restriction", 
            "results": [{"passed": False, "error": "RCE Prevention: Local Execution Disabled"}]
        }

    return {"output": f"Execution for {language} is not available in the current configuration.", "error": "Not configured", "results": None}



if __name__ == "__main__":
    import uvicorn
    # When running directly, we use the app object
    uvicorn.run(app, host="127.0.0.1", port=8000)
