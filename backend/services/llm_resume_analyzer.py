"""
LLM-Powered Resume Analyzer using Mistral 7B

Uses the Hugging Face Inference API (free) to analyze resumes
with Mistral 7B Instruct model. Falls back to regex-based
extraction if the API is unavailable.

Setup:
  1. Get a free HuggingFace token from https://huggingface.co/settings/tokens
  2. Set environment variable: HF_API_TOKEN=your_token_here
     OR create a .env file in the backend directory with: HF_API_TOKEN=your_token
"""

import os
import json
import re
import requests

# Try to load .env file
try:
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if '=' in line and not line.startswith('#'):
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()
except Exception:
    pass

# Hugging Face API config
HF_API_TOKEN = os.environ.get("HF_API_TOKEN", "")
MISTRAL_MODEL = "mistralai/Mistral-7B-Instruct-v0.3"
HF_API_URL = f"https://api-inference.huggingface.co/models/{MISTRAL_MODEL}"


def _build_prompt(resume_text: str) -> str:
    """Build the prompt for Mistral 7B to analyze a resume."""
    return f"""<s>[INST] You are a technical recruitment engine. Analyze the following resume and return a JSON object with:
1. "top_skills": array of technical skills found (programming languages, frameworks, tools, cloud platforms, etc.)
2. "suggested_roles": array of job roles this candidate is suited for
3. "skill_categories": object mapping each skill to its category (e.g., "Python" -> "Programming Language")
4. "experience_level": one of "fresher", "junior", "mid", "senior" based on experience
5. "projects_summary": array of brief one-line descriptions of projects mentioned

Return ONLY valid JSON, no extra text or explanation.

RESUME:
{resume_text[:3000]}
[/INST]"""


def analyze_with_mistral(resume_text: str) -> dict:
    """
    Analyze resume using Mistral 7B via HuggingFace Inference API.
    
    Returns dict with: top_skills, suggested_roles, skill_categories, 
                       experience_level, projects_summary, model_used
    """
    if not HF_API_TOKEN:
        return {
            "error": "HF_API_TOKEN not set. Set it in environment or backend/.env file.",
            "model_used": "none",
            "fallback": True
        }

    headers = {
        "Authorization": f"Bearer {HF_API_TOKEN}",
        "Content-Type": "application/json"
    }

    payload = {
        "inputs": _build_prompt(resume_text),
        "parameters": {
            "max_new_tokens": 1024,
            "temperature": 0.3,
            "return_full_text": False,
            "do_sample": True
        }
    }

    try:
        response = requests.post(
            HF_API_URL,
            headers=headers,
            json=payload,
            timeout=60
        )

        if response.status_code == 503:
            # Model is loading
            return {
                "error": "Mistral 7B model is loading on HuggingFace. Please retry in 30-60 seconds.",
                "model_used": MISTRAL_MODEL,
                "fallback": True,
                "loading": True
            }

        if response.status_code != 200:
            return {
                "error": f"HuggingFace API error: {response.status_code} - {response.text[:200]}",
                "model_used": MISTRAL_MODEL,
                "fallback": True
            }

        result = response.json()

        # Extract the generated text
        if isinstance(result, list) and len(result) > 0:
            generated_text = result[0].get("generated_text", "")
        elif isinstance(result, dict):
            generated_text = result.get("generated_text", "")
        else:
            generated_text = str(result)

        # Try to parse JSON from the response
        parsed = _extract_json(generated_text)

        if parsed:
            parsed["model_used"] = MISTRAL_MODEL
            parsed["fallback"] = False
            return parsed
        else:
            return {
                "error": "Could not parse LLM response as JSON",
                "raw_response": generated_text[:500],
                "model_used": MISTRAL_MODEL,
                "fallback": True
            }

    except requests.exceptions.Timeout:
        return {
            "error": "Request to HuggingFace API timed out (60s)",
            "model_used": MISTRAL_MODEL,
            "fallback": True
        }
    except Exception as e:
        return {
            "error": f"LLM analysis failed: {str(e)}",
            "model_used": MISTRAL_MODEL,
            "fallback": True
        }


def _extract_json(text: str) -> dict:
    """Extract JSON object from LLM response text."""
    # Try direct parse first
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        pass

    # Try to find JSON block in the response
    json_patterns = [
        r'\{[\s\S]*\}',  # Match everything between first { and last }
        r'```json\s*([\s\S]*?)```',  # Markdown code block
        r'```\s*([\s\S]*?)```',  # Generic code block
    ]

    for pattern in json_patterns:
        match = re.search(pattern, text)
        if match:
            try:
                json_str = match.group(1) if match.lastindex else match.group(0)
                return json.loads(json_str)
            except (json.JSONDecodeError, IndexError):
                continue

    return None


def is_llm_available() -> dict:
    """Check if the Mistral LLM API is configured and reachable."""
    status = {
        "configured": bool(HF_API_TOKEN),
        "model": MISTRAL_MODEL,
        "token_set": bool(HF_API_TOKEN)
    }

    if HF_API_TOKEN:
        try:
            headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
            resp = requests.get(
                f"https://api-inference.huggingface.co/models/{MISTRAL_MODEL}",
                headers=headers,
                timeout=10
            )
            data = resp.json()
            status["available"] = resp.status_code == 200
            status["model_loaded"] = not data.get("error", "").startswith("Model")
            if "error" in data:
                status["model_status"] = data["error"]
        except Exception as e:
            status["available"] = False
            status["error"] = str(e)
    else:
        status["available"] = False
        status["setup_instructions"] = (
            "1. Get free token from https://huggingface.co/settings/tokens | "
            "2. Create backend/.env with HF_API_TOKEN=your_token"
        )

    return status
