import React, { useState, useEffect } from 'react'
import ContentHeader from '../components/ContentHeader'
import TutorClassCard from '../components/TutorClassCard'
import StudentSubjectContent from '../components/StudentSubjectContent'

const SCContent = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchStudentClasses();
  }, []);

  const fetchStudentClasses = () => {
    const token = localStorage.getItem('token');

    fetch("http://localhost:8081/api/classes/studentclasses", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSubjects(data);
        } else {
          console.error("Unexpected response format:", data);
        }
      })
      .catch(error => console.error("Error fetching classes:", error));
  };

    const handleCardClick = (subject) => {
      setSelectedSubject(subject);
    };
  
    const handleBackClick = () => {
      setSelectedSubject(null);
    };

  return (
    <div className='content'>
      <ContentHeader header="My Classes" />
      <div className='dashboard-container'>
        {selectedSubject ? (
          <StudentSubjectContent subject={selectedSubject} onBack={handleBackClick} />
        ) : (
          subjects.reduce((columns, subject, index) => {
            const columnIndex = index % 3;
            if (!columns[columnIndex]) columns[columnIndex] = [];
            columns[columnIndex].push(subject);
            return columns;
          }, []).map((column, columnIndex) => (
            <div key={columnIndex} className="column">
              {column.map((subject, subjectIndex) => (
                <div key={subjectIndex} className="class-card-container" onClick={() => handleCardClick(subject)}>
                  <TutorClassCard subject={subject} />
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SCContent

