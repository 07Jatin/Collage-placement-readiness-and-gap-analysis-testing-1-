import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

STUDENT_DATA_PATH = DATA_DIR / "student_data.json"
TEST_HISTORY_PATH = DATA_DIR / "test_history.json"
MARKET_DATA_PATH = DATA_DIR / "market_data.json"
QUIZ_BANK_PATH = BASE_DIR / "skill_quizzes.json"

SECTION_SKILL_MAP = {
    "quantitative": ["statistics"],
    "english": ["Business Communication"],
    "reasoning": ["Logical Reasoning"],
    "computer_science": ["python", "sql", "linux", "rest-api"],
    "dsa_random_pool": ["data-structures", "algorithms", "git"],
}


def load_json(path: Path, default):
    try:
        with open(path, "r", encoding="utf-8") as handle:
            return json.load(handle)
    except FileNotFoundError:
        return default


def save_json(path: Path, payload) -> None:
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)


def load_students():
    return load_json(STUDENT_DATA_PATH, [])


def save_students(students) -> None:
    save_json(STUDENT_DATA_PATH, students)


def load_test_history():
    return load_json(TEST_HISTORY_PATH, [])


def save_test_history(history) -> None:
    save_json(TEST_HISTORY_PATH, history)


def load_skill_quizzes():
    return load_json(QUIZ_BANK_PATH, {})
