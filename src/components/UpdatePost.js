import React, { useContext, useEffect, useState } from 'react'
import { FiLoader } from "react-icons/fi"
import { useParams, Link } from 'react-router-dom'
import api from '../api/PostsComments'
import AuthContext from '../context/AuthContext'
import './style/AddEditPost.css'
import './style/animations/Spinner.css'
import HomeHeader from './HomeHeader'


const UpdatePost = () => {
  const {postId} = useParams()
  const {authTokens, userId} = useContext(AuthContext)
  const [text, setText] = useState("")
  const [initLoading, setInitLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [failure, setFailure] = useState(null)
  const [textTooLong, setTextTooLong] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [minCharsCounter, setMinCharsCounter] = useState(30)
  const [initFailure, setInitFailure] = useState(null)
  const [success, setSuccess] = useState(false)

  
  useEffect(() => {
    const fetchPost = async () => {
      try{
        const response = await api.get(`/${postId}/basic/`, {
          headers : {
            Authorization: `Bearer ${authTokens.access}`
          }
        })
        if(response.status !== 200){
          throw Error("Something went wrong")
        }else if(response.data.user.id !== userId){
          throw Error("Not the author")
        }
        setText(response.data.text)
      }catch(err){
        if (err.message === "Not the author"){
          setInitFailure("Hmmm... Unfortunately, you are not the author of this post")
        }else if(err.response && err.response.status === 404 && err.response.data.message === "This post doesn't exist"){
          setInitFailure("Hmm... this post doesn't exist")
        }else{
          setInitFailure("Upps... Something went wrong. Try to load this page later.")
        }
      }
    setInitLoading(false)
    }
    fetchPost()
  }, [postId, userId])

  const countInput = (e) => {
    setFailure(null)
    let result = 5000 - e.target.value.length
    if(result>=0){
      setText(e.target.value)
      setTextTooLong(false)
    }else{
      setTextTooLong(true)
    }
    if(e.target.value.trim().length < 30){
      setDisabled(true)
      setMinCharsCounter(e.target.value.trim().length)
    }else{
      setDisabled(false)
      setMinCharsCounter(30)
    }
  }

  const updatePost = async () => {
    setTextTooLong(false)
    setDisabled(true)
    setLoading(true)
    try{
      const response = await api.put(`/${postId}/`, {text: text}, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`
        }
      })
      if(response.status !== 200){
        throw Error("Something went wrong")
      }
      setSuccess(true)
    }catch(err){
      if(err.response && err.response.status===400){
        setFailure("Hmm... Your post seems to be invalid")
      }
      else{
        setFailure("Something went wrong. Try to save the post later.")
      }
    }
    setLoading(false)
    setDisabled(false)
  }
  return (
    <>
      <HomeHeader/>
      <main className='post-edit__background' role="main">
        {
        initLoading ?
        <div className='post-edit__init_loading_div'>
          <FiLoader role="img" aria-label='loading' className='post-edit__init_loading_sign --spinner'></FiLoader>
        </div> :
        success ?
        <div className='post-edit__center'>
          <div className='post-edit__success'>
            <p>Your post was updated successfully</p>
            <Link to="/home">Go back to the homepage</Link>
            <Link to={`/home/account/${userId}`}>See your posts</Link>
          </div>
        </div> :
        initFailure ? 
        <div className='post-edit__init_err_div'>
          <p className='post-edit__init_failure'>{initFailure}</p>
        </div> :
        <div className='post-edit__center'>
          <h1 className='post-edit__title'>Edit your post</h1>
          <p className='post-edit__description' id="post-description">Don't change the overall meaning of your post. Add only necessary information.</p>
          <div className='post-edit__content_input_wrapper'>
            <textarea aria-label='your edited post' aria-describedby='post-description' value={text} placeholder='Share your idea with the world...'
            onChange={(e) => countInput(e)} className="post-edit__content_input"/>
          </div>
          {minCharsCounter !== 30 && <><span className="post-edit__input_counter">{minCharsCounter}/30</span><br/></>}
          {textTooLong && <p role="alert" className='post-edit__input_err'>Your post is too long</p>}
          {failure && <p role="alert" className='post-edit__input_err'>{failure}</p>}
          <button onClick={updatePost} disabled={disabled} className='post-edit__save_button'>
            Save changes
          </button>
          <div className='post-edit__loading_sign_div'>
            {loading && <FiLoader role="img" aria-label="loading" className='post-edit__loading_sign --spinner'></FiLoader>}
          </div>
        </div>
        }
      </main>
    </>
  )
}

export default UpdatePost