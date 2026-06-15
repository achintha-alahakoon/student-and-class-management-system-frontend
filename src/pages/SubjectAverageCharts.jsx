import React, { useEffect, useState } from "react";
import axios from "axios";
import AverageScoreChart from "../components/AverageScoreChart";

const SubjectAverageCharts = () => {
  const [subjectAverages, setSubjectAverages] = useState([]);

  useEffect(() => {
    const fetchSubjectAverages = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/subjects/getaverages');
        setSubjectAverages(response.data);
      } catch (error) {
        console.error("Error fetching subject averages:", error);
      }
    };

    fetchSubjectAverages();
  }, []);

  return (
    <div className="attendance-report">
      <h5>Exam mark's Averages</h5>
      <div className="subject-average-charts">
        {subjectAverages.map((subject, index) => (
          <AverageScoreChart key={index} label={subject.Subject} average={subject.average_score} />
        ))}
      </div>
    </div>
  );
};

export default SubjectAverageCharts;
