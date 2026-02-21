from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

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
def gap_report(student_id: str):
    try:
        report = skill_analyzer.analyze_student(student_id)
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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
