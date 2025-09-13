import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // ✅ Import CSS file

function App() {
  const [studyHours, setStudyHours] = useState("");
  const [attendance, setAttendance] = useState("");
  const [previousGrades, setPreviousGrades] = useState("");
  const [activities, setActivities] = useState("Yes");
  const [parentEdu, setParentEdu] = useState("High School");
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      study_hours: parseFloat(studyHours),
      attendance: parseFloat(attendance),
      previous_grades: parseFloat(previousGrades),
      activities,
      parent_edu: parentEdu,
    };
    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", data);
      setResult(res.data.Passed ? "✅ Student will Pass" : "❌ Student may Fail");
    } catch (err) {
      console.error(err);
      setResult("⚠️ Error connecting to backend");
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">🎓 Student Grade Prediction</h1>
      <form onSubmit={handleSubmit} className="form-box">
        <input
          className="input-field"
          placeholder="Study Hours per Week"
          value={studyHours}
          onChange={(e) => setStudyHours(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Attendance Rate (%)"
          value={attendance}
          onChange={(e) => setAttendance(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Previous Grades (%)"
          value={previousGrades}
          onChange={(e) => setPreviousGrades(e.target.value)}
        />

        <label className="label">Extracurricular Activities</label>
        <select
          className="select-box"
          value={activities}
          onChange={(e) => setActivities(e.target.value)}
        >
          <option>Yes</option>
          <option>No</option>
        </select>

        <label className="label">Parent Education Level</label>
        <select
          className="select-box"
          value={parentEdu}
          onChange={(e) => setParentEdu(e.target.value)}
        >
          <option>High School</option>
          <option>Associate</option>
          <option>Bachelor</option>
          <option>Master</option>
        </select>

        <button type="submit" className="btn">Predict</button>
      </form>

      <h2 className="result">{result}</h2>
    </div>
  );
}

export default App;
