import React, { useState } from "react";
import "../styles/content.css";
import ContentHeader from "./ContentHeader";
import MakeAttendance from "./MakeAttendance";
import PaymentSearchbar from "./PaymentSearchbar";

const AAContent = () => {
  const [studentData, setStudentData] = useState(null);

  return (
    <div className="content">
      <ContentHeader header="Attendance" />

      <div className="payment-container">
        <div className="payment-searchbar">
          <PaymentSearchbar onStudentDataFetched={setStudentData}/>
        </div>
        
        <div className="make-attendance">
          <MakeAttendance studentData={studentData}/>
        </div>
        
      </div>
    </div>
  );
};

export default AAContent;
