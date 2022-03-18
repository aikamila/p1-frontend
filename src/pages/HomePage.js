import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { Switch } from 'react-router-dom'
import ListPosts from '../components/ListPosts'
import PostDetails from '../components/PostDetails'
import UpdatePost from '../components/UpdatePost'
import AddPost from '../components/AddPost'
import UserAccount from '../components/UserAccount'
import PrivateRoute from '../utils/PrivateRoute'
import './style/HomePage.css'


const HomePage = () => {
    let {initialVerificationSuccessful} = useContext(AuthContext)

    return (
        <>
            {initialVerificationSuccessful && <p role="alert">Your email was successfully verified!</p>}
            <Switch>
                <PrivateRoute path="/home/account/:id" component={UserAccount} />
                <PrivateRoute path="/home/post/:postId/update" component={UpdatePost}/>
                <PrivateRoute path="/home/post/add" component={AddPost} />
                <PrivateRoute path="/home/post/:postId" component={PostDetails}/>
                <PrivateRoute path="/home">
                    <ListPosts />
                </PrivateRoute>
            </Switch>
        </>
    )
}

export default HomePage

