import React, {useContext, useEffect, useState} from 'react'
import Reply from './Reply'
import { Link } from 'react-router-dom'
import api from '../api/PostsComments'
import { response } from 'msw'
import AuthContext from '../context/AuthContext'

const Comment = ({commentId, author, text, timeSincePosted, comment, disabled, showDeleteDialog}) => {
  let {authTokens, userId} = useContext(AuthContext)
  const [reply, setReply] = useState("")
  const [replyTooLong, setReplyTooLong] = useState(false)
  const [disabledSubmit, setDisabledSubmit] = useState(false)
  const [replySubmitError, setReplySubmitError] = useState(null)

  const countReply = (e) => {
    setReplySubmitError(null)
    let result = 5000 - e.target.value.length
    if(result>=0){
      setReply(e.target.value)
      setReplyTooLong(false)
    }else{
      setReplyTooLong(true)
    }
  }

  const addReply = async () => {
    setDisabledSubmit(true)
    try{
      const response = await api.post(`/comments/${commentId}/replies/add/`,
      {text: reply}, {headers: {
        Authorization: 'Bearer ' + authTokens.access
        }})
      if(response.status !== 201){
        throw Error("Something went wrong")
      }
      setReply("")
      comment.replies = [...comment.replies, {id: response.data.id, user: {username: "YOU", id: userId}, text: reply, time_since_posted: "Just now"}]
    }catch(err){
      if(err.response && err.response.status === 400 && reply.trim().length === 0){
        setReplySubmitError("You can't add an empty reply")
      }else if(err.response && err.response.status === 400){
        setReplySubmitError("Your reply seems to be invalid")
      }else{
        setReplySubmitError("Upps... Something went wrong")
      }
    }
    setDisabledSubmit(false)
  }
  
  return (
    <>
      <article className='post-details__comment'>
        <Link to={`/home/account/${author.id}`} style={
            disabled ? {pointerEvents: 'none'} : {pointerEvents: 'auto'}
          } className="post-details__author">{author.username}</Link>
        <br/>
        <span className='post-details__time'>{timeSincePosted}</span>
        <p className='post-details__content'>{text}</p>
        <section aria-label={`replies to the comment: ${text.slice(0,120)}`}
        className="post-details__replies_section">
          {comment.replies.map(reply => <Reply
              key={reply.id}
              replyId={reply.id}
              author={reply.user}
              text={reply.text}
              timeSincePosted={reply.time_since_posted}
              disabled={disabled}
          >
          </Reply>)}
        </section>
        {replySubmitError && <span role="alert" className='post-details__input_err'>{replySubmitError}</span>}
        { replyTooLong && <span role="alert" className='post-details__input_err'>Your reply can't be longer than 5000 characters.</span>}
        <div className='post-details__input_el'>
          <textarea data-testid={`input-comment-${commentId}`} value={reply} onChange={(e) => countReply(e)} placeholder='Add a reply...'
          aria-label={`add a reply to the comment: ${text.slice(0,120)}`} className="post-details__input" 
          style={showDeleteDialog ? {backgroundColor: 'rgb(175, 174, 174)'} : {}}/>
          <button data-testid={`button-comment-${commentId}`} disabled={disabled||disabledSubmit} 
          onClick={addReply} aria-label="submit your reply" className='post-details__add_button reply'
          style={showDeleteDialog ? {backgroundColor: 'rgb(175, 174, 174)', color: "black"} : {}}>Submit</button>
        </div>
      </article>
    </>
  )
}

export default Comment