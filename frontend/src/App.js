import React, { useState, useEffect } from 'react'
import ReadinessGauge from './ReadinessGauge'

export default function App() {
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState('S001')
  const [gapReport, setGapReport] = useState(null)
  const [readiness, setReadiness] = useState(null)
  const [skillGaps, setSkillGaps] = useState(null)

  useEffect(() => {
    // Fetch gap report and readiness for selected student
    const fetchStudentData = async () => {
      try {
        const gapRes = await fetch(`http://127.0.0.1:8000/gap_report/${selectedStudent}`)
        const gapData = await gapRes.json()
        setGapReport(gapData)

        const readRes = await fetch(`http://127.0.0.1:8000/predict_readiness/${selectedStudent}`)
        const readData = await readRes.json()
        setReadiness(readData)
      } catch (err) {
        console.error(err)
      }
    }

    fetchStudentData()
  }, [selectedStudent])

  useEffect(() => {
    // Fetch admin skill gaps
    const fetchSkillGaps = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/admin/skill_gaps')
        const data = await res.json()
        setSkillGaps(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchSkillGaps()
  }, [])

  // Generate student list (S001 to S012)
  useEffect(() => {
    const studentList = []
    for (let i = 1; i <= 12; i++) {
      studentList.push(`S${String(i).padStart(3, '0')}`)
    }
    setStudents(studentList)
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1>🎓 Education-Job Alignment System</h1>

      {/* Student Selector */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          Select Student:{' '}
          <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
            {students.map((sid) => (
              <option key={sid} value={sid}>
                {sid}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left: Readiness Gauge & Prediction */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>Placement Readiness</h2>
          {readiness && (
            <>
              <ReadinessGauge value={readiness.readiness_score_percent} />
              <p><strong>Status:</strong> {readiness.predicted_label}</p>
              <p style={{ fontSize: '12px', color: '#666' }}>
                Ready: {(readiness.probabilities.Ready * 100).toFixed(1)}% | Needs Training: {(readiness.probabilities['Needs Training'] * 100).toFixed(1)}% | Unprepared: {(readiness.probabilities.Unprepared * 100).toFixed(1)}%
              </p>
            </>
          )}
        </div>

        {/* Right: Skill Gap Report */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2>Skill Gap Analysis</h2>
          {gapReport && (
            <>
              <p><strong>Best Role Match:</strong> {gapReport.best_role_match}</p>
              <p><strong>Jaccard Score:</strong> {gapReport.jaccard_score}</p>
              <p><strong>Missing Skills ({gapReport.missing_skills.length}):</strong></p>
              <ul>
                {gapReport.missing_skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
              {gapReport.recommended_certifications.length > 0 && (
                <>
                  <p><strong>Recommended Certifications:</strong></p>
                  <ul>
                    {gapReport.recommended_certifications.map((cert) => (
                      <li key={cert}>{cert}</li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Admin Skill Gaps Dashboard */}
      <div style={{ marginTop: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>📊 Admin Dashboard: Most Missing Skills Across Cohort</h2>
        {skillGaps && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Skill</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Students Missing</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Bar</th>
              </tr>
            </thead>
            <tbody>
              {skillGaps.missing_skill_frequencies.map(([skill, count]) => (
                <tr key={skill}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{skill}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{count}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <div
                      style={{
                        height: '20px',
                        backgroundColor: '#4ade80',
                        width: `${(count / 12) * 100}%`,
                        borderRadius: '4px',
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
