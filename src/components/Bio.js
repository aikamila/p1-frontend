import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import './style/Bio.css'

const Bio = ({id, bio}) => {
  const {userId} = useContext(AuthContext)
  return (
    bio ? 
    <p className='bio__text'>{bio}</p> :
    userId == id ?
    <p className='bio__text'>You haven't shared anything about yourself yet...</p> :
    <p className='bio__text'>This user hasn't shared anything about them yet...</p>
  )
}

export default Bio