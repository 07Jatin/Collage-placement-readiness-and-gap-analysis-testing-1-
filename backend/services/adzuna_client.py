import requests
import os
from dotenv import load_dotenv

load_dotenv()

# Store your Adzuna App ID and Key in a .env file like this:
# ADZUNA_APP_ID=your_app_id
# ADZUNA_APP_KEY=your_app_key

ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID", "")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY", "")
BASE_URL = "https://api.adzuna.com/v1/api/jobs"

def fetch_live_jobs(role: str, country: str = "us", results_per_page: int = 5):
    """
    Fetch live job listings for a specific role and country using Adzuna API.
    """
    if not ADZUNA_APP_ID or not ADZUNA_APP_KEY:
        raise ValueError("ADZUNA_APP_ID or ADZUNA_APP_KEY is missing. Please set them in your .env file.")
        
    url = f"{BASE_URL}/{country}/search/1"
    
    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_APP_KEY,
        "results_per_page": results_per_page,
        "what": role,
        "content-type": "application/json"
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        jobs = []
        for result in data.get("results", []):
            jobs.append({
                "title": result.get("title", ""),
                "company": result.get("company", {}).get("display_name", "Unknown Company"),
                "location": result.get("location", {}).get("display_name", "Remote"),
                "description": result.get("description", ""),
                "salary_min": result.get("salary_min"),
                "salary_max": result.get("salary_max"),
                "url": result.get("redirect_url", "")
            })
            
        return {
            "role": role,
            "total_found": data.get("count", 0),
            "jobs": jobs
        }
    except requests.exceptions.RequestException as e:
        print(f"Error fetching from Adzuna: {e}")
        return {"error": str(e), "jobs": []}

def get_trending_skills_for_role(role: str, country: str = "us"):
    """
    Extract raw skills from recent job descriptions to find trending technologies.
    """
    # Use Adzuna to fetch ~20 recent jobs to analyze descriptions
    data = fetch_live_jobs(role, country, results_per_page=20)
    if "error" in data:
        return data
        
    descriptions = " ".join([job["description"] for job in data["jobs"]]).lower()
    
    # A simple keyword counter for demonstration 
    # (in production, this would use NLP or NLP logic from llm_resume_analyzer)
    tech_keywords = [
        "python", "java", "javascript", "react", "node", "sql", "aws", 
        "docker", "kubernetes", "azure", "c++", "django", "machine learning"
    ]
    
    skill_counts = {}
    for skill in tech_keywords:
        count = descriptions.count(skill)
        if count > 0:
            skill_counts[skill] = count
            
    # Sort by frequency
    sorted_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)
    top_skills = [skill for skill, count in sorted_skills[:5]]
    
    return {
        "role": role,
        "sample_size": len(data["jobs"]),
        "trending_skills": top_skills
    }
