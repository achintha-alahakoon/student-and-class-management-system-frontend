import React from 'react';
import PDContent from '../pages/PDContent';
import '../styles/Parent.css'

const ParentDashboard = () => {
  return (
    <div className='dashboard'>
      <div className="dashboard-content">
        <PDContent />
      </div>
    </div>
  )
}

export default ParentDashboard
