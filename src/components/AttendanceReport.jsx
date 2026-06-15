import React, { useState, useEffect } from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const AttendanceReport = () => {

  const [genderCounts, setGenderCounts] = useState([]);

  useEffect(() => {

    const fetchStudentData = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/students/studentslist");
        const data = await response.json();
        
        const genderCountsObj = data.reduce((acc, student) => {
          acc[student.Gender] = (acc[student.Gender] || 0) + 1;
          return acc;
        }, {});

        const genderCountsArr = Object.keys(genderCountsObj).map(Gender => ({
          label: Gender,
          value: genderCountsObj[Gender]
        }));
        
        setGenderCounts(genderCountsArr);
      } catch (error) {
        console.error('Error', error);
      };
    };
    
    fetchStudentData();
  }, []);

  return (
    <div className="attendance-report">
      <h5>Student Count by Gender</h5>
      <PieChart
        series={[
          {
            data: genderCounts,
            highlightScope: { faded: "global", highlighted: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
          },
        ]}
        height={200}
      />
    </div>
  );
};

export default AttendanceReport;
