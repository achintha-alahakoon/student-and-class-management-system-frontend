import React from 'react'
import ContentHeader from '../../components/ContentHeader'
import GradeView from '../GradeView'

const SGContent = () => {
  return (
    <div className='content'>
      <ContentHeader header="Grades" />
      <div>
        <GradeView />
      </div>
    </div>
  )
}

export default SGContent
