import React from "react";
import ContentHeader from "../../components/ContentHeader";
import Calendar from "../../components/Calendar";
import ClockComponent from "../../components/ClockComponent";
import ParentStudentClassSchedule from "../../components/ParentStudentClassSchedule";

const PCSContent = () => {
  return (
    <div className="content">
      <ContentHeader header="Class Schedule" />
      <div className="dashboard-container">
        <div>
          <div className="student-class-schedule-content">
            <div className="calendar">
              <Calendar />
            </div>
            <div className="clock">
              <ClockComponent />
            </div>
          </div>
          <div>
            <div className="student-class-schedule-view">
              {/* <h4>Monawahari danda oni</h4> */}
            </div>
          </div>
        </div>

        <div className="upcoming-classes">
          <h4>Upcoming Classes</h4>
          <ParentStudentClassSchedule />
        </div>
      </div>
    </div>
  );
};

export default PCSContent;
