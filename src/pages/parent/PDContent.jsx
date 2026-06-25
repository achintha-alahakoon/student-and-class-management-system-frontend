import React, { useState, useEffect } from "react";
import ContentHeader from "../../components/ContentHeader";
import MyStudentCard from "../../components/MyStudentCard";
import { BiPlus } from "react-icons/bi";
import OveroleChart from "../../components/OveroleChart";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AddStudentModal from "../../components/AddStudentModal";

const PDContent = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [parentName, setParentName] = useState('');


  useEffect(() => {
    fetchParentName();
  }, []);

  const fetchParentName = async () => {
    const token = localStorage.getItem('token');
    
    fetch('http://localhost:8081/api/name/getparentname', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.firstName && data.lastName) {
          setParentName(`${data.firstName} ${data.lastName}`);
        } else {
          console.error("Unexpected response format:", data);
        }
      })
      .catch(error => console.error("Error fetching parent's name:", error));
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8081/api/assign/getStudents', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setStudents(Array.isArray(data) ? data : []); // Ensure the data is an array
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleAddStudent = (newStudent) => {
    const studentArray = newStudent.parentChildren || [];
    setStudents(prevStudents => [...prevStudents, ...studentArray]);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="content">
      <ContentHeader header="Dashboard" />
      <div className="student-name">
        Hi, {parentName} ..! 👋
      </div><br />
      <div className="dashboard-container">
        <div className="student-card-container">
          <div className="student-card-header">
            <h4>My Students</h4>
            <div className="add-student">
              <Tooltip title="Add Student">
                <IconButton onClick={handleOpen}>
                  <BiPlus className="icon" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <div className="student-cards">
            {students.map(student => (
              <MyStudentCard 
                key={student.StudentID} 
                firstName={student.FirstName} 
                lastName={student.LastName} 
                grade={student.Grade} 
              />
            ))}
          </div>
        </div>
        <div className="overall">
          <div className="overall-chart">
            <OveroleChart title="Overall Student Attendance Chart" /><br />
            {/* <OveroleChart title="Overall Student Payment Chart" /> */}
          </div>
          <div></div>
        </div>
      </div>
      <AddStudentModal open={modalOpen} handleClose={handleClose} handleAddStudent={handleAddStudent} />
    </div>
  );
};

export default PDContent;
