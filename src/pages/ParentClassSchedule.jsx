import React from 'react';
import PCSContent from '../pages/PCSContent';
import '../styles/Parent.css'

const ParentClassSchedule = () => {
  return (
    <div className='dashboard'>
      <div className="dashboard-content">
        <PCSContent />
      </div>
    </div>
  )
}

export default ParentClassSchedule
