import React from "react";
import ContentHeader from "../components/ContentHeader";
import AttendanceChart from "../components/AttendanceChart";
import PaymentChart from "../components/PaymentChart";
import TutorStudentList from "../components/TutorStudentList";
import TutorScheduledClass from "../components/TutorScheduledClass";

const TDContent = () => {
  return (
    <div className="content">
      <ContentHeader header="Dashboard" />

      <div className="dashboard-container">
        <div className="container">
          <div className="charts">

            <div className="attendance-chart">
              <h6>Attendance</h6>
              <AttendanceChart />
            </div>
            <div className="payment-chart">
              <h6>Payment</h6>
              <PaymentChart />
            </div>
          </div>
          <div className="student-list">
            <TutorStudentList />
          </div>
        </div>

        <div className="upcoming-classes">
          <h4>Upcoming Classes</h4>
          <TutorScheduledClass />
        </div>
      </div>
    </div>
  );
};

export default TDContent;
