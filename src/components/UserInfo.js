import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import MailTo from './MailTo'
import Bio from './Bio'
import './style/UserInfo.css'

const UserInfo = ({name, surname, email, id, username, bio}) => {
  let {userId} = useContext(AuthContext)
  return (
    <>
      <p className='user-info__username'>{username}</p>
      <p className='user-info__full_name'>{name} {surname}</p>
      <Bio
      id={id}
      bio={bio}
      ></Bio>
      {userId.toString()!==id.toString() && <MailTo email={email} subject="Inquiry">Contact via email</MailTo>}
    </>
  )
}

export default UserInfo