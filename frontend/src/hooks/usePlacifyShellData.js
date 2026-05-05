import { useEffect, useMemo, useState } from 'react';
import {
  BENCHMARK_DATA,
  buildLocalGapReportFromTest,
  buildRadarData,
  calculateReadinessScore,
  createEmptyGapReport,
  createInitialHistory,
} from '../utils/dashboardInsights';

const API_BASE_URL = 'http://127.0.0.1:8000';

function buildAuthHeaders() {
  const token = localStorage.getItem('placify_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: buildAuthHeaders(),
  });
  return response.json();
}

export function usePlacifyShellData({
  dashboardTrack,
  isAuthenticated,
  selectedStudent,
  setSelectedStudent,
  userRole,
}) {
  const [gapReport, setGapReport] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [students, setStudents] = useState([]);
  const [atRiskStudents, setAtRiskStudents] = useState([]);
  const [history, setHistory] = useState(() => createInitialHistory());

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchStudentInsights = async () => {
      try {
        const [gapData, readinessData] = await Promise.all([
          fetchJson(`/gap_report/${selectedStudent}?role=${encodeURIComponent(dashboardTrack)}`),
          fetchJson(`/predict_readiness/${selectedStudent}`),
        ]);
        setGapReport(gapData);
        setReadiness(readinessData);
      } catch (err) {
        console.error('Error fetching student insight data:', err);
      }
    };

    const fetchAtRiskStudents = async () => {
      if (userRole !== 'admin') {
        return;
      }

      try {
        const data = await fetchJson('/admin/at_risk_students');
        setAtRiskStudents(data.at_risk_students || []);
      } catch (err) {
        console.error('Error fetching at-risk students:', err);
      }
    };

    fetchStudentInsights();
    fetchAtRiskStudents();
  }, [dashboardTrack, isAuthenticated, selectedStudent, userRole]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchStudents = async () => {
      try {
        const data = await fetchJson('/api/students');
        if (Array.isArray(data)) {
          setStudents(data);
          if (data.length > 0 && selectedStudent === 'S001') {
            setSelectedStudent(data[0].id);
          }
          return;
        }

        console.warn('Backend returned non-array student list:', data);
        setStudents([]);
      } catch (err) {
        console.error('Error fetching students list:', err);
        setStudents([]);
      }
    };

    fetchStudents();
  }, [isAuthenticated, selectedStudent, setSelectedStudent]);

  const refreshGapReport = async (fallbackData = null) => {
    if (fallbackData?.scores) {
      setGapReport(buildLocalGapReportFromTest(dashboardTrack, fallbackData.scores));
    }

    try {
      const data = await fetchJson(`/gap_report/${selectedStudent}?role=${encodeURIComponent(dashboardTrack)}`);
      setGapReport(data);
    } catch (err) {
      console.error('Error refreshing gap report:', err);
      if (!fallbackData) {
        setGapReport((previous) => previous || createEmptyGapReport(dashboardTrack));
      }
    }
  };

  const radarData = useMemo(() => buildRadarData(gapReport), [gapReport]);
  const readinessScore = useMemo(
    () => calculateReadinessScore(readiness, history, radarData),
    [history, radarData, readiness]
  );

  return {
    atRiskStudents,
    benchmarkData: BENCHMARK_DATA,
    gapReport,
    history,
    radarData,
    readiness,
    readinessScore,
    refreshGapReport,
    setHistory,
    students,
  };
}
