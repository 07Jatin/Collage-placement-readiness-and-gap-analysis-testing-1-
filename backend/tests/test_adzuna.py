import sys
import os
from unittest.mock import patch
import json

# Append current directory to path to resolve imports properly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.adzuna_client import fetch_live_jobs, get_trending_skills_for_role

def test_adzuna():
    print("======================================")
    print("Testing Adzuna API Integration")
    print("======================================\n")

    app_id = os.getenv("ADZUNA_APP_ID")
    app_key = os.getenv("ADZUNA_APP_KEY")
    is_mock = False

    if not app_id or not app_key:
        print("Warning: Adzuna keys not found. Using Mock data to test integration logic.")
        is_mock = True

    # Setup mocks
    dummy_response_data = {
        "count": 12,
        "results": [
            {
                "title": "Frontend React Developer",
                "company": {"display_name": "Tech Corp"},
                "location": {"display_name": "New York, NY"},
                "description": "Looking for a React developer with Node, JavaScript, and SQL experience.",
                "salary_min": 80000,
                "salary_max": 120000,
                "redirect_url": "http://example.com/job1"
            },
            {
                "title": "Senior Data Scientist",
                "company": {"display_name": "Data AI"},
                "location": {"display_name": "San Francisco, CA"},
                "description": "Strong python, machine learning, sql, and aws skills required.",
                "salary_min": 130000,
                "salary_max": 180000,
                "redirect_url": "http://example.com/job2"
            }
        ]
    }

    class MockResponse:
        def __init__(self, json_data, status_code):
            self.json_data = json_data
            self.status_code = status_code
        def json(self):
            return self.json_data
        def raise_for_status(self):
            pass

    def mock_requests_get(*args, **kwargs):
        # We can implement simple matching or just always return dummy_response_data
        return MockResponse(dummy_response_data, 200)

    # Note: requests and ADZUNA_APP_ID/KEY are accessed in services.adzuna_client
    if is_mock:
        patch_get = patch('services.adzuna_client.requests.get', side_effect=mock_requests_get)
        patch_id = patch('services.adzuna_client.ADZUNA_APP_ID', 'dummy_id')
        patch_key = patch('services.adzuna_client.ADZUNA_APP_KEY', 'dummy_key')
        
        patch_get.start()
        patch_id.start()
        patch_key.start()

    print("Fetching live jobs for 'Frontend Developer'...")
    response = fetch_live_jobs(role="Frontend Developer", country="us", results_per_page=3)

    if "error" in response:
        print(f"Error fetching jobs: {response.get('error')}")
    else:
        print(f"\nSuccessfully found {response.get('total_found', 0)} jobs matching your search!")
        for idx, job in enumerate(response.get("jobs", []), 1):
            print(f"\nJob #{idx}:")
            print(f"  Title: {job.get('title')}")
            print(f"  Company: {job.get('company')}")
            print(f"  Location: {job.get('location')}")
            print(f"  Salary: {job.get('salary_min')} - {job.get('salary_max')}")
            print(f"  More Info: {job.get('url')}")
    
    print("\n--------------------------------------")
    print("Fetching trending tech skills for 'Data Scientist'...")
    trending = get_trending_skills_for_role(role="Data Scientist", country="us")
    
    if "error" not in trending:
        print(f"\nAnalyzed {trending.get('sample_size')} live roles. Top trending skills are:")
        print(f"  {', '.join(trending.get('trending_skills', []))}")
    print("\n======================================")
    print("Integration test complete.")
    
    if is_mock:
        patch_get.stop()
        patch_id.stop()
        patch_key.stop()

if __name__ == "__main__":
    test_adzuna()
