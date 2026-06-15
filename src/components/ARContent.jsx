import React from "react";
import "../styles/content.css";
import Count from "./Count";
import ContentHeader from "./ContentHeader";
import AttendanceReport from "./AttendanceReport";
import SubjectAverageCharts from "../pages/SubjectAverageCharts";


const ARContent = () => {
  return (
    <div className="content">
      <ContentHeader header="Report" />
      <div className="admin-report-container">
        <Count />
        <div className="admin-report-chart">
          <AttendanceReport />
          <SubjectAverageCharts />
        </div>
      </div>
    </div>
  );
};

export default ARContent;
