import React from "react";
import ContentHeader from "../components/ContentHeader";
import Calendar from "../components/Calendar";
import ClockComponent from "../components/ClockComponent";
import StudentDisplayClassSchedule from "../components/StudentDisplayClassSchedule";

const SCSContent = () => {
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
          <div className="student-class-schedule-view">
            {/* <h4>Monawahari danda oni</h4> */}
          </div>
        </div>

        <div className="upcoming-classes">
          <h4>Upcoming Classes</h4>
          <StudentDisplayClassSchedule />
        </div>
      </div>
    </div>
  );
};

export default SCSContent;
