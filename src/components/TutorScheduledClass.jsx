import React, { useState, useEffect } from "react";
import axios from "axios";
import { IconButton } from "@mui/material";


const TutorScheduledClass = () => {
  const [scheduledClasses, setScheduledClasses] = useState([]);

  useEffect(() => {
    const getScheduledClasses = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:8081/api/classSchedule/getTutorScheduledClasses",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setScheduledClasses(response.data);

      } catch (error) {
        console.error("Error fetching scheduled classes", error);
      }
    };

    getScheduledClasses();
  }, []);

  return (
    <div className="display-class">
      <div className="scheduled-classes">
        {scheduledClasses.map((scheduledClass) => (
          <div className="course" key={scheduledClass.ScheduleID}>
            <div className="course-details">
              <div className="course-name">
                <div className="row1">
                  <span className="title">{scheduledClass.Subject}</span>
                  <span className="tutor">{scheduledClass.Tutor}</span>
                </div>
                <div className="row2">
                  <span className="grade">Grade {scheduledClass.Grade}</span>
                  <span className="day">{scheduledClass.Repeat_On}</span>
                </div>
                <div className="row3">
                  <span className="hall">Hall {scheduledClass.Hall_Num}</span>
                  <div className="time-container">
                    <span className="time">
                      {scheduledClass.Start_Time} - {scheduledClass.End_Time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="action">
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
              >
                :
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutorScheduledClass;
