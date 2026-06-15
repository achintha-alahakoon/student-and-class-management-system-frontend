import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const AttendanceChart = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming you store the token in localStorage

        const response = await fetch("http://localhost:8081/api/attendance/getTutorAttendanceChart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({})
        });

        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }

        const data = await response.json();
        const { present, absent } = data;

        setAttendanceData([
          { id: 0, value: absent, label: "Absent" },
          { id: 1, value: present, label: "Present" }
        ]);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, []);

  return (
    <PieChart
      series={[
        {
          data: attendanceData,
          highlightScope: { faded: "global", highlighted: "item" },
          faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
          innerRadius: 55,
          outerRadius: 70,
          paddingAngle: 5,
          cornerRadius: 10,
          startAngle: -180,
          endAngle: 180,
          cx: 100,
          cy: 85,
        },
      ]}
      height={170}
    />
  );
};

export default AttendanceChart;


