import React from 'react'
import ContentHeader from '../../components/ContentHeader'
import GradeUpload from '../GradeUpload'

const TGContent = () => {
  return (
    <div className='content'>
      <ContentHeader header="Grades" />
      <div className='grade-container'>
        <GradeUpload />
      </div>
    </div>
  )
}

export default TGContent
