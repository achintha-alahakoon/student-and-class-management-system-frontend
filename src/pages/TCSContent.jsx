import React from 'react'
import ContentHeader from '../components/ContentHeader'
import AddClass from '../components/AddClass'
import TutorAllScheduledClasses from '../components/TutorAllScheduledClasses'

const TCSContent = () => {
  return (
    <div className='content'>
      <ContentHeader header="Class Schedule" />

      <div className='dashboard-container'>
        <div className='container'>
          <AddClass />
        </div>
        <div className='upcoming-classes'>
          <TutorAllScheduledClasses />
        </div>
      </div>
    </div>
  )
}

export default TCSContent

