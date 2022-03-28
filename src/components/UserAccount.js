import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import UserInfo from './UserInfo'
import api from '../api/PostsComments'
import user_api from '../api/User'
import AuthContext from '../context/AuthContext'
import { FiLoader } from 'react-icons/fi'
import ListEachPost from './ListEachPost'
import './style/UserAccount.css'
import './style/animations/Spinner.css'
import HomeHeader from './HomeHeader'
import Footer from './Footer'


const UserAccount = () => {
  const {id} = useParams()
  const {authTokens, userId} = useContext(AuthContext)
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [userInfoLoading, setUserInfoLoading] = useState(true)
  const [postsLoading, setPostsLoading] = useState(false)
  const [userInfoLoadingFailure, setUserInfoLoadingFailure] = useState("we weren't able to load data about this user. Try again later. Sorry.")
  const [posts, setPosts] = useState([])
  const [postsLoadingFailure, setPostsLoadingFailure] = useState(null)
  const [postsLoadingSuccess, setPostsLoadingSucccess] = useState(false)


  const fetchPosts = useCallback(async () => {
    setPostsLoading(true)
    try{
      const response = await api.get(`/?user__id=${id}`, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`
        }
      })
      if(response.status !== 200){
        throw Error("Something went wrong")
      }
      setPosts(response.data)
      setPostsLoadingSucccess(true)
    }catch(err){
      setPostsLoadingFailure("We weren't able to load the posts. Try again later.")
    }
    setPostsLoading(false)
  }, [id]
)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try{
        const response = await user_api.get(`/${id}/`, {
          headers: {
            Authorization: `Bearer ${authTokens.access}`
          }
        })
        if(response.status !== 200){
          throw Error("Something went wrong")
        }
        setName(response.data.name)
        setSurname(response.data.surname)
        setUsername(response.data.username)
        setEmail(response.data.email)
        setBio(response.data.bio)
        setUserInfoLoading(false)
        // await fetchPosts()
      }catch(err){
        if(err.response && err.response.status === 404 && err.response.data.message === "This user does not exist."){
          setUserInfoLoadingFailure("Uppps... it seems that this user doesn't exist.")
        }else{
          setUserInfoLoadingFailure("Something went wrong and we weren't able to load the page. Try again later.")
        }
        setUserInfoLoading(false)
      }
    }
    fetchUserInfo()
  }, [id, fetchPosts])

  return (
    <>
      <HomeHeader/>
      <main className='user-account__background' role="main">
        <div className='user-account__window'>
        { 
          userInfoLoading ? 
            <div className='user-account__loading_div'>
          <FiLoader role="img" aria-label='loading data about the user' className=' user-account__user_loading --spinner'></FiLoader>
            </div> :
          userInfoLoadingFailure ? 
          <p role="alert" className='user-account__user_data_failure'>{userInfoLoadingFailure}</p> :
          <section aria-label={`information about ${username}`} className="user-account__info_section">
            <UserInfo
            id={id}
            name={name}
            surname={surname}
            email={email}
            username={username}
            bio={bio}
            />
          </section>
        }
        {
          postsLoading ? 
          <div className='user-account__loading_div'>
            <FiLoader role="img" aria-label='loading posts' className='user-account__posts_loading --spinner'></FiLoader>
          </div> :
          postsLoadingFailure ?
          <p role="alert" className='user-account__posts_data_failure'>{postsLoadingFailure}</p> :
          <>
            {postsLoadingSuccess && 
              <section aria-label={`latest posts of ${username}`}>
                {
                  posts.length === 0 ?
                    <>
                    {userId == id ? 
                    <p className='user-account__no_posts'>You don't have any posts yet...</p> :
                    <p className='user-account__no_posts'>This user doesn't have any posts yet...</p>}
                    </> :
                    posts.map(post => <ListEachPost 
                    key={post.id}
                    id={post.id} 
                    text={post.text}
                    user={post.user.id}
                    username={post.user.username}
                    time={post.time_since_posted}
                    engagementRate={post.engagement_rate}
                    ></ListEachPost>) 
                }
              </section>
            }
          </>
        }
        </div>
      </main>
      <Footer></Footer>
    </>
  )
}

export default UserAccount