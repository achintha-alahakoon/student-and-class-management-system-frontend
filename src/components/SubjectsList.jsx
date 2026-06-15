import React, { useState, useEffect } from "react";
import "../styles/TutorsList.css";
import user from "../Images/user.png";
import { BiPlus,  BiSearch } from 'react-icons/bi';
import Swal from "sweetalert2";

const SubjectsList = () => {
  const [subjects, setSubject] = useState([]);

  useEffect(() => {
    fetchSubjectList();
    }, []);
  
    const fetchSubjectList = () => {
      fetch("http://localhost:8081/api/subjects/subjectslist")
        .then((response) => {
          console.log(response);
          return response.json();
        })
        .then((data) => setSubject(data))
        .catch((error) => console.error("Error fetching subject data:", error));
    };

  const handleAddSubject = () => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Restricted!",
    });
  };

  const handleDeleteStudent = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  };
  
  return (
    <div className="tutors-list">
      <div className="list-header">
      <div className="list-header-title">
          <h3>Subjects</h3>
        </div>
        <div className="list-search-box">
          <input type="text" placeholder="Search" />
          <BiSearch className="icon" />
        </div>
        <div className="edit" onClick={handleAddSubject}>
        <BiPlus className='icon' 
        />
        </div>
      </div>
      <div className="list-container">
        {subjects.map((subject) => (
          <div className="list">
            <div className="tutor-details">
            <img src={user} alt="user" />
              <h6>{subject.Subject}</h6>
            </div>
            <span className="tutor-todo" onClick={handleDeleteStudent}>:</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectsList;
