import React from 'react';
import { BiEdit } from 'react-icons/bi';

const ProfileHeader = (props) => {
  return (
    <div className='profile-header'>
      <h2 className='header-title' >{props.header}</h2>
      <div className='edit'>
        <BiEdit className='icon' />
      </div>
    </div>
  )
}

export default ProfileHeader
