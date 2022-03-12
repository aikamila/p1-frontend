import React, { useContext, useState, useEffect } from 'react'
import AuthContext from '../context/AuthContext'
import api from '../api/PostsComments'
import ListEachPost from './ListEachPost'
import './style/ListPosts.css'
import { FiLoader } from 'react-icons/fi'
import './style/animations/Spinner.css'


const ListPosts = () => {
  const {authTokens, updateToken} = useContext(AuthContext)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)
//   const [postDeleteError, setPostDeleteError] = useState(false)
//   const [postDeleteSuccess, setPostDeleteSuccess] = useState(false)
  
  useEffect(() => {
    const fetchPosts = async () => {
        try{
            const response = await api.get('/', {
            headers: {
                Authorization: 'Bearer ' + authTokens.access
                }})
            if (response.status !== 200){
                throw Error("Something bad happened")
            }
            setPosts(response.data)
            setLoading(false)
        } catch (err){
            if(err.response && err.response.status === 401){
                await updateToken()
            }else{
                setFetchError(true)
                setLoading(false)
            }
        }
        }  
    fetchPosts()
    return () => {setPosts([])
      setFetchError(false)
      setLoading(true)}
  }, [])
  return (
    <main className='list-posts__background'>
      <div className='list-posts__center'>
      {/* {postDeleteError && <dialog open>Uppps... something went wrong. Try to delete your post once again.</dialog>}
      {postDeleteSuccess && <dialog open>Post successfully deleted!</dialog>} */}
      {loading ?
      <div className='list-posts__loading'>
        <FiLoader aria-label="wait a second" role="img" className='list-posts__loading_sign --spinner'></FiLoader>
      </div> :
      fetchError ? 
      <p className='list-posts__init_err'>We're not able to load the resources from the server. Please try again later.</p> :
      <div className='list-posts__window'>
        <h1 id="page-description" className='list-posts__title'>Recent Posts</h1>
        <section aria-labelledby='page-description' className='list-posts__section' >
          {
          posts.map((post) => <ListEachPost 
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
      </div>
      }
      </div>
    </main>
  )
}

export default ListPosts