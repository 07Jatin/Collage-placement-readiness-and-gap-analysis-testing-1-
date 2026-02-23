"""
Resume Skill Extractor

Approach:
  1. Define a dictionary of skills with associated keywords/synonyms
  2. Scan resume text with regex word-boundary matching
  3. Score confidence based on keyword frequency
  4. Return structured skill profile

This relies purely on deterministic keyword matching.
"""

import re
import json
import os

# Comprehensive skill → keyword mapping
# Each skill has multiple synonyms/related terms that appear on resumes
SKILL_KEYWORDS = {
    "python": {
        "keywords": [
            "python", "django", "flask", "fastapi", "pandas", "numpy",
            "scipy", "matplotlib", "jupyter", "pip", "virtualenv",
            "pep8", "pytest", "celery", "asyncio", "pydantic"
        ],
        "category": "Programming Language"
    },
    "sql": {
        "keywords": [
            "sql", "mysql", "postgresql", "postgres", "sqlite",
            "oracle", "sql server", "stored procedure", "database",
            "dbms", "rdbms", "query", "plsql", "t-sql", "nosql",
            "mongodb", "cassandra", "redis"
        ],
        "category": "Database"
    },
    "react": {
        "keywords": [
            "react", "reactjs", "react.js", "redux", "jsx",
            "next.js", "nextjs", "react hooks", "react native",
            "context api", "react router", "material ui"
        ],
        "category": "Frontend Framework"
    },
    "git": {
        "keywords": [
            "git", "github", "gitlab", "bitbucket", "version control",
            "source control", "merge", "branching", "pull request"
        ],
        "category": "Version Control"
    },
    "algorithms": {
        "keywords": [
            "algorithm", "sorting", "searching", "dynamic programming",
            "greedy", "divide and conquer", "backtracking", "bfs",
            "dfs", "dijkstra", "binary search", "recursion",
            "time complexity", "space complexity", "big o"
        ],
        "category": "Computer Science"
    },
    "data-structures": {
        "keywords": [
            "data structure", "array", "linked list", "stack",
            "queue", "hash table", "hash map", "heap", "binary tree",
            "graph", "trie", "priority queue", "set"
        ],
        "category": "Computer Science"
    },
    "rest-api": {
        "keywords": [
            "rest api", "restful", "api", "endpoint", "http",
            "crud", "json api", "graphql", "swagger", "postman",
            "api development", "microservice"
        ],
        "category": "Backend Development"
    },
    "docker": {
        "keywords": [
            "docker", "container", "dockerfile", "docker-compose",
            "docker hub", "containerization", "docker image"
        ],
        "category": "DevOps"
    },
    "kubernetes": {
        "keywords": [
            "kubernetes", "k8s", "kubectl", "helm", "pod",
            "deployment", "service mesh", "container orchestration",
            "istio", "minikube"
        ],
        "category": "DevOps"
    },
    "aws": {
        "keywords": [
            "aws", "amazon web services", "ec2", "s3", "lambda",
            "cloudformation", "dynamodb", "rds", "sqs", "sns",
            "cloudwatch", "iam", "vpc", "elastic beanstalk", "ecs"
        ],
        "category": "Cloud Computing"
    },
    "machine-learning": {
        "keywords": [
            "machine learning", "deep learning", "neural network",
            "tensorflow", "pytorch", "keras", "scikit-learn",
            "classification", "regression", "clustering", "nlp",
            "computer vision", "cnn", "rnn", "lstm", "transformers",
            "random forest", "xgboost", "svm", "knn"
        ],
        "category": "AI/ML"
    },
    "statistics": {
        "keywords": [
            "statistics", "statistical analysis", "probability",
            "hypothesis testing", "regression analysis", "bayesian",
            "p-value", "confidence interval", "normal distribution",
            "chi-square", "anova", "standard deviation", "correlation"
        ],
        "category": "Mathematics"
    },
    "pandas": {
        "keywords": [
            "pandas", "dataframe", "data manipulation",
            "data wrangling", "data cleaning", "csv", "excel processing"
        ],
        "category": "Data Science"
    },
    "linux": {
        "keywords": [
            "linux", "ubuntu", "centos", "debian", "fedora",
            "unix", "kernel", "chmod", "grep", "awk", "sed",
            "systemd", "cron"
        ],
        "category": "Operating System"
    },
    "bash": {
        "keywords": [
            "bash", "shell scripting", "shell script",
            "command line", "terminal", "zsh", "cron job",
            "scripting"
        ],
        "category": "Scripting"
    },
    "ci-cd": {
        "keywords": [
            "ci/cd", "ci cd", "continuous integration",
            "continuous deployment", "continuous delivery",
            "jenkins", "github actions", "circleci", "travis ci",
            "pipeline", "devops pipeline", "gitlab ci"
        ],
        "category": "DevOps"
    },
    "monitoring": {
        "keywords": [
            "monitoring", "prometheus", "grafana", "nagios",
            "datadog", "new relic", "alerting", "logging",
            "elk stack", "splunk", "observability"
        ],
        "category": "DevOps"
    }
}


def extract_skills(text):
    """
    Extract skills from resume text using keyword matching.
    Pure deterministic regex matching.

    Returns dict of skill_id -> { confidence, match_count, matched_keywords, ... }
    """
    text_lower = text.lower()
    results = {}

    for skill_id, skill_info in SKILL_KEYWORDS.items():
        total_matches = 0
        found_keywords = []

        for keyword in skill_info["keywords"]:
            # Word-boundary matching to avoid partial matches
            # e.g., "react" should not match "reactive" unless intended
            pattern = r'\b' + re.escape(keyword) + r'(?:s|es|ing|ed)?\b'
            matches = re.findall(pattern, text_lower, re.IGNORECASE)
            if matches:
                total_matches += len(matches)
                if keyword not in found_keywords:
                    found_keywords.append(keyword)

        if total_matches > 0:
            # Confidence formula:
            #   1 match  = 38%  (mentioned once — could be passing reference)
            #   2 matches = 56%  (used in context)
            #   3 matches = 74%  (demonstrated usage)
            #   4+ matches = 85%+ (core skill, capped at 95%)
            confidence = min(95, 20 + total_matches * 18)

            results[skill_id] = {
                "skill": skill_id,
                "category": skill_info["category"],
                "confidence": confidence,
                "match_count": total_matches,
                "matched_keywords": found_keywords,
                "status": "unverified"
            }

    return results


def get_extraction_summary(results):
    """Generate a human-readable summary of extracted skills."""
    if not results:
        return {"total_skills": 0, "categories": {}, "skills": []}

    categories = {}
    for skill_id, info in results.items():
        cat = info["category"]
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(skill_id)

    return {
        "total_skills": len(results),
        "categories": categories,
        "skills": results
    }
