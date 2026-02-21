import json
import random
import csv
from pathlib import Path


OUTPUT_DIR = Path("data")
OUTPUT_DIR.mkdir(exist_ok=True)


def generate_market():
    roles = [
        {
            "role": "Software Engineer",
            "required_skills": [
                "python",
                "git",
                "algorithms",
                "data-structures",
                "rest-api",
            ],
            "trending_skills": ["docker", "kubernetes", "aws", "react"],
            "entry_level_salary": 70000,
        },
        {
            "role": "Data Scientist",
            "required_skills": [
                "python",
                "statistics",
                "pandas",
                "machine-learning",
                "sql",
            ],
            "trending_skills": ["pytorch", "tensorflow", "xgboost", "spark"],
            "entry_level_salary": 75000,
        },
        {
            "role": "DevOps Engineer",
            "required_skills": [
                "linux",
                "bash",
                "ci-cd",
                "docker",
                "monitoring",
            ],
            "trending_skills": ["kubernetes", "terraform", "aws", "prometheus"],
            "entry_level_salary": 72000,
        },
    ]

    with open(OUTPUT_DIR / "market_data.json", "w", encoding="utf-8") as f:
        json.dump(roles, f, indent=2)


def generate_students(n=8):
    sample_skills = [
        "python",
        "git",
        "algorithms",
        "data-structures",
        "rest-api",
        "pandas",
        "statistics",
        "machine-learning",
        "sql",
        "linux",
        "docker",
        "kubernetes",
        "aws",
        "react",
        "ci-cd",
    ]

    students = []
    for i in range(1, n + 1):
        skills = random.sample(sample_skills, k=random.randint(2, 7))
        projects = [
            {"name": f"proj_{i}_{j}", "tech": random.sample(skills, k=min(2, len(skills)))}
            for j in range(random.randint(0, 4))
        ]
        cgpa = round(random.uniform(5.0, 10.0), 2)
        students.append(
            {
                "id": f"S{i:03}",
                "name": f"Student {i}",
                "current_skills": skills,
                "projects": projects,
                "cgpa": cgpa,
            }
        )

    with open(OUTPUT_DIR / "student_data.json", "w", encoding="utf-8") as f:
        json.dump(students, f, indent=2)


def generate_historical_csv(rows=200):
    # Columns: cgpa, num_projects, skill_match_percent, label
    header = ["cgpa", "num_projects", "skill_match_percent", "label"]
    rows_out = []

    for _ in range(rows):
        cgpa = round(random.uniform(5.0, 10.0), 2)
        num_projects = random.randint(0, 6)
        skill_match = random.randint(0, 100)

        if cgpa >= 8.0 and skill_match >= 70 and num_projects >= 2:
            label = "Ready"
        elif cgpa >= 6.5 and skill_match >= 40:
            label = "Needs Training"
        else:
            label = "Unprepared"

        rows_out.append([cgpa, num_projects, skill_match, label])

    with open(OUTPUT_DIR / "historical_placement.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(rows_out)


if __name__ == "__main__":
    generate_market()
    generate_students(n=12)
    generate_historical_csv(rows=300)
    print("Mock data generated in ./data/")
