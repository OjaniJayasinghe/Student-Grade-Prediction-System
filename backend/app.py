from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

# Load trained model
model = joblib.load("D:/student grade prediction system/backend/student_grade_model.pkl")

app = FastAPI()

# Allow React frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class StudentData(BaseModel):
    study_hours: float
    attendance: float
    previous_grades: float
    activities: str   # "Yes" or "No"
    parent_edu: str   # "High School", "Associate", "Bachelor", "Master"


@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}


@app.post("/predict")
def predict(data: StudentData):
    # Encode categorical features
    activities = 1 if data.activities == "Yes" else 0
    parent_map = {"High School": 0, "Associate": 1, "Bachelor": 2, "Master": 3}
    parent_edu = parent_map.get(data.parent_edu, 0)

    # ✅ Build DataFrame with the SAME column names used during training
    features = pd.DataFrame([{
        "Study Hours per Week": data.study_hours,
        "Attendance Rate": data.attendance,
        "Previous Grades": data.previous_grades,
        "Participation in Extracurricular Activities": activities,
        "Parent Education Level": parent_edu
    }])

    prediction = model.predict(features)

    return {"Passed": bool(prediction[0])}
