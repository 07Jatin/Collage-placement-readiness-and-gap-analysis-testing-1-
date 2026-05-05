import requests
import json

payload = {
    "student_id": "S001",
    "test_id": "TEST_AUTO_999",
    "overall_score": 45,
    "category_scores": {
        "quantitative": {"score": 2, "total": 25}, # 8% (Low)
        "english": {"score": 5, "total": 25},     # 20% (Low)
        "reasoning": {"score": 28, "total": 30},   # 93% (High)
        "computer_science": {"score": 14, "total": 15}, # 93% (High)
        "dsa_random_pool": {"score": 5, "total": 6}     # 83% (High)
    }
}

try:
    r = requests.post("http://127.0.0.1:8000/api/submit_test_result", json=payload)
    print("Status Code:", r.status_code)
    print("Response:", r.json())
except Exception as e:
    print("Error:", e)
