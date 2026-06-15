import React from 'react';
import ContentHeader from '../components/ContentHeader';
import APayment from '../components/APayment';

const PPContent = () => {
  return (
    <div className='content'>
      <ContentHeader header="Payment" />

      <div className='parent-payment'>
        <APayment />
      </div>
    </div>
  )
}

export default PPContent
