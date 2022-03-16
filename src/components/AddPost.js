import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/PostsComments'
import AuthContext from '../context/AuthContext'
import { FiLoader } from "react-icons/fi"
import './style/AddEditPost.css'
import HomeHeader from './HomeHeader'


const AddPost = () => {
  const {userId, authTokens} = useContext(AuthContext)
  const [success, setSuccess] = useState(false)
  const [failure, setFailure] = useState("")
  const [disabled, setDisabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState("")
  const [textTooLong, setTextTooLong] = useState(false)
  const [minCharsCounter, setMinCharsCounter] = useState(0)
  const countInput = (e) => {
    setFailure("")
    const result = 5000 - e.target.value.length
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
  const addPost = async() => {
    setTextTooLong(false)
    setDisabled(true)
    setLoading(true)
    try{
      const response = await api.post(`/`, {text: text}, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`
        }
      })
      if(response.status !== 201){
        throw Error("Something went wrong")
      }
      setSuccess(true)
    }catch(err){
      if(err.response && err.response.status===400){
        setFailure("Hmm... Your post seems to be invalid")
      }
      else{
        setFailure("Something went wrong. Try to submit the post later.")
      }
    }
    setLoading(false)
    setDisabled(false)
  }
  return (
    <>
      <HomeHeader/>
      <main className='post-add__background'>
        <div className='post-add__center'>
          {success ? 
          <div className='post-add__success'>
            <p>Your post was created successfully</p>
            <Link className="post-add__success_link" to="/home">Go back to the homepage</Link>
            <Link className="post-add__success_link" to={`/home/account/${userId}`}>See your posts</Link>
          </div>:
          <>
            <h1 className='post-add__title'>Add a public post</h1>
            <p className='post-add__description' id="post-description">Remember to include a full description of your offer and your requirements.</p>
            <div className='post-add__content_input_wrapper'>
              <textarea aria-label='your post' aria-describedby='post-description' placeholder='Share your idea with the world...' 
              value={text} onChange={(e) => (countInput(e))} className='post-add__content_input'></textarea>
            </div>
            {minCharsCounter !== 30 && <><span className='post-add__input_counter'>{minCharsCounter}/30</span><br/></>}
            {textTooLong && <p role="alert" className='post-add__input_err'>Your post is too long</p>} 
            {failure && <p role="alert" className='post-add__input_err'>{failure}</p>}
            <button disabled={disabled} onClick={addPost} aria-label="Add your post" className='post-add__add_button'>Add</button>
            <div className='post-add__loading_sign_div'>
              {loading && <FiLoader role="img" aria-label="loading" className='post-add__loading_sign --spinner'></FiLoader>}
            </div>
          </>
          }
        </div>
      </main>
    </>
  )
}

export default AddPost