import React from 'react'
import { BiMale } from 'react-icons/bi';

const user = [
    {
        title: 'All Students',
        icon: <BiMale />
    },
    {
        title: 'All Tutors',
        icon: <BiMale />
    },
    {
        title: 'All Parents',
        icon: <BiMale />
    },
    {
        title: 'All Subjects',
        icon: <BiMale />
    },
];

const Card = ({ onCardClick, selectedCard }) => {
  return (
    <div className='card-container'>
      {user.map((item) => (
        <div className={`card ${item.title === selectedCard ? 'selected' : ''}`} onClick={() => onCardClick(item.title)}>
          <div className='card-cover'>{item.icon}</div>
            <div className='card-title'>
              <h5>{item.title}</h5>
              </div>
          </div>
      ))}
    </div>
  )
}

export default Card
