import React, { useState, useEffect } from "react";
import "../styles/TutorsList.css";
import user from "../Images/user.png";

const TutorStudentList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudentList();
  }, []);

  const fetchStudentList = () => {
    const token = localStorage.getItem('token');

    fetch("http://localhost:8081/api/students/tutorstudentslist", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then((response) => response.json())
    .then((data) => {
      // Ensure the data is an array
      if (Array.isArray(data)) {
        setStudents(data);
      } else {
        console.error("Unexpected response format:", data);
        setStudents([]);
      }
    })
    .catch((error) => {
      console.error("Error fetching student data:", error);
      setStudents([]);
    });
  };
  
  return (
    <div className="tutors-list">
      <div className="list-header">
        <h3>Students</h3>
        <select>
          <option>All</option>
          <option>Grade 06</option>
          <option>Grade 07</option>
          <option>Grade 08</option>
          <option>Grade 09</option>
          <option>Grade 10</option>
          <option>Grade 11</option>
        </select>
      </div>
      <div className="list-container">
        {students.map((student, index) => (
          <div className="list" key={index}>
            <div className="tutor-details">
              <img src={user} alt="user" />
              <h6>
                {student.FirstName} {student.LastName}
              </h6>
            </div>
            <div className="grade-container">
              <h6>Grade {student.Grade}</h6>
            </div>
            <span className="tutor-todo">:</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutorStudentList;
