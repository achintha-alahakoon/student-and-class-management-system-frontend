import React from 'react';
import ContentHeader from '../../components/ContentHeader';
import ParentStudentGradeView from '../../components/ParentStudentGradeView';

const PGContent = () => {
  return (
    <div className='content'>
      <ContentHeader header="Grades" />
      <div>
        <ParentStudentGradeView />
      </div>
    </div>
  )
}

export default PGContent
