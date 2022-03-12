import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'
import './style/ListEachPost.css'

const ListEachPost = ({id, text, user, time, username, engagementRate}) => {
  const {userId} = useContext(AuthContext)
  return (
    <article className='list-each-post__container'>
      <Link className="list-each-post__username" to={`/home/account/${user}`}>{username}</Link><br></br>
      <span className='list-each-post__time'>{time}</span>
      {text.length < 121 ? <p className='list-each-post__content'>{text}</p> : <p className='list-each-post__content'>{`${text.slice(0,120)}...`}</p>}
      <Link className='list-each-post__see_more' aria-label='see more about this post on another page' to={`/home/post/${id}`}>See more...</Link><br></br>
      <span className='list-each-post__comment_count'>{engagementRate} comments</span><br></br>
      {userId === user && <Link className='list-each-post__update_link' aria-label='edit this post' to={`/home/post/${id}/update`}>Edit</Link>}
    </article>
  )
}

export default ListEachPost