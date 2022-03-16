import React from 'react'
import { Link } from 'react-router-dom'

const Reply = ({ author, text, timeSincePosted, disabled }) => {
  return (
    <article className='post-details__reply'>
      <Link to={`/home/account/${author.id}`} style={
              disabled ? {pointerEvents: 'none'} : {pointerEvents: 'auto'}
            } className="post-details__author">{author.username}</Link>
      <br />
      <span className='post-details__time'>{timeSincePosted}</span>
      <p className='post-details__content'>{text}</p>
    </article>
  )
}

export default Reply