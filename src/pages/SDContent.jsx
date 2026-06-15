import React, { useEffect, useState } from 'react';
import ContentHeader from '../components/ContentHeader';
import BigCalendar from '../components/BigCalendar';

const SDContent = () => {
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    fetchStudentName();
  }, []);

  const fetchStudentName = () => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:8081/api/name/getstudentname', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.firstName && data.lastName) {
          setStudentName(`${data.firstName} ${data.lastName}`);
        } else {
          console.error("Unexpected response format:", data);
        }
      })
      .catch(error => console.error("Error fetching student's name:", error));
  };

  return (
    <div className='content'>
      <ContentHeader header="Dashboard" />
      <div className='student-name'>
        Hi, {studentName} ..! 👋
      </div>
      <div className='dashboard-container'>
        <BigCalendar />
      </div>
    </div>
  );
};

export default SDContent;

