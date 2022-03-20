import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api/PostsComments'
import AuthContext from '../context/AuthContext'
import Comment from './Comment'
import { FiLoader } from "react-icons/fi"
import './style/PostDetails.css'
import './style/animations/Spinner.css'
import HomeHeader from './HomeHeader'
import Footer from './Footer'


const PostDetails = () => {
  const {authTokens, userId, updateToken} = useContext(AuthContext)
  let {postId} = useParams();
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error404, setError404] = useState(null)
  const [serverError, setServerError] = useState(null)
  const [postDeleteSuccess, setPostDeleteSuccess] = useState(null)
  const [postDeleteFailure, setPostDeleteFailure] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [comment, setComment] = useState("")
  const [commentTooLong, setCommentTooLong] = useState(false)
  const [disabledSubmit, setDisabledSubmit] = useState(false)
  const [commentSubmitErr, setCommentSubmitErr] = useState(null)

  const countComment = (e) => {
    setCommentSubmitErr(null)
    let result = 5000 - e.target.value.length
    if(result>=0){
      setComment(e.target.value)
      setCommentTooLong(false)
    }else{
      setCommentTooLong(true)
    }
  }

  const addComment = async () => {
    setDisabledSubmit(true)
    try{
      const response = await api.post(`/${postId}/comments/add/`, {text: comment}, {headers: {
        Authorization: 'Bearer ' + authTokens.access
        }
      })
      if(response.status !== 201){
        throw Error("Something went wrong")
      }
      post.comments = [...post.comments, {id: response.data.id, user: {username: "YOU", id: userId}, text: comment, time_since_posted: "Just now", replies: []}]
      setComment("")
    }catch(err){
      if(err.response && err.response.status===400 && comment.trim().length===0){
        setCommentSubmitErr("You can't add an empty comment")
      }else if(err.response && err.response.status===400){
        setCommentSubmitErr("Upps... your comment seems to be invalid")
      }else{
        setCommentSubmitErr("Upps... something went wrong")
      }
    }
    setDisabledSubmit(false)
  }
  const handlePostDelete = async () => {
    setLoadingDelete(true)
    try{
      const response = await api.delete(`/${postId}/`, {headers: {
          Authorization: 'Bearer ' + authTokens.access
          }})
        if(response.status !== 204){
          throw Error("Something went wrong")
        }
        setPostDeleteSuccess(true)
        setDisabled(false)
        setShowDeleteDialog(false)
        setLoadingDelete(false)
      }catch(err){
        setPostDeleteFailure(true)
        setLoadingDelete(false)
      }
  }

  const openDeleteDialog = () => {
      setDisabled(true)
      setShowDeleteDialog(true)
  }

  const closeDeleteDialog = () => {
    setPostDeleteFailure(false)
    setDisabled(false)
    setShowDeleteDialog(false)
  }

  useEffect(() => {
    const fetchPost = async (postId) => {
      try{
        const response = await api.get(`/${postId}/`, {headers: {
          Authorization: 'Bearer ' + authTokens.access
          }})
        if(response.status !== 200){
          throw Error("Something went wrong")
        }
        setPost(response.data)
        setLoading(false)
      }catch(err) {
        if(err.response && err.response.status === 404 && err.response.data.message === "This post doesn't exist"){
          setError404(true)
          setLoading(false)
        }else if(err.response && err.response.status === 401){
          await updateToken()
        }else{
          setServerError(true)
          setLoading(false)
        }
      }
    }
    fetchPost(postId) 
  }, [postId, updateToken])

  return (
    <>
      <HomeHeader disabled={disabled}/>
      <main className="post-details__background" role="main">
      { !postDeleteSuccess ? 
        loading ? 
          <FiLoader role="img" aria-label="loading" className='post-details__init_loading_sign --spinner'></FiLoader> :
          error404 ?
          <p className='post-details__init_err'>This post doesn't exist anymore :(</p> :
          serverError ?
          <p className='post-details__init_err'>We weren't able to load the resource. Try again later</p> :
          <div data-testid="before-delete-success" className='post-details__window'>
            <article className='post-details__main'>
              {showDeleteDialog && <dialog className='post-details__delete_dialog' open>
              {loadingDelete ?
              <FiLoader role="img" className="post-details__del_loading_sign --spinner" aria-label="wait a moment"></FiLoader> :
              postDeleteFailure ?
              <>
              <p>An error occured. Try to delete your post later</p>
              <button onClick={closeDeleteDialog}>OK</button>
              </> :
                <>
                <p>Are you sure that you wanna delete this post?</p>
                <div>
                  <button onClick={handlePostDelete}>Yes</button>
                  <button onClick={closeDeleteDialog}>No</button>
                </div>
                </>
              }
                </dialog>}

              <Link to={`/home/account/${post.user.id}`} style={
                disabled ? {pointerEvents: 'none'} : {pointerEvents: 'auto'}
              } className="post-details__author">{post.user.username}</Link>

              <br/>

              <span className='post-details__time'>{post.time_since_posted}</span>

              <p className='post-details__content'>{post.text}</p>

              {post.user.id === userId && <Link to={`/home/post/${postId}/update`} style={
                disabled ? {pointerEvents: 'none'} : {pointerEvents: 'auto'}
              } className="post-details__edit_link" aria-label="Edit this post">Edit</Link>}

              {post.user.id === userId && <button disabled={disabled} id="detail-delete-button"
              onClick={() => openDeleteDialog()} aria-label="Delete this post"
              className='post-details__delete_button'>Delete</button>}  


              <section className='post-details__comments_section' aria-label={`Comments on the post: ${post.text.slice(0,120)}`}>
                {post.comments.map(comment => <Comment
                key={comment.id}
                commentId={comment.id}
                author={comment.user}
                text={comment.text}
                timeSincePosted={comment.time_since_posted}
                comment={comment}
                disabled={disabled}
                >
                </Comment>)}
              </section>
              {commentSubmitErr && <><span role="alert" className='post-details__input_err'>{commentSubmitErr}</span><br/></>}
              { commentTooLong && <span role="alert" className='post-details__input_err'
              >Your comment can't be longer than 5000 characters.</span>}
              <div className='post-details__input_el'>
                <textarea value={comment} onChange={(e) => countComment(e)} placeholder='Add a comment...'
                aria-label={`add a comment to the post: ${post.text.slice(0,120)}`}
                className="post-details__input"/>
                <button disabled={disabled || disabledSubmit} onClick={addComment} aria-label="submit your comment"
                className='post-details__add_button comment'>Submit</button>
              </div>
            </article>
          </div>
        :
        <>
          <p className='post-details__del_success'>Your post was successfully deleted</p>
          <Link to="/home/post/add" className='post-details__del_success_link'>Create a new post</Link>
          <Link to="/home" className='post-details__del_success_link'>Go back to the homepage</Link>
        </>
      }
      </main>
      <Footer/>
    </>
  )
}

export default PostDetails