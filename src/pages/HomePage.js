import React,{useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { Switch, Route } from 'react-router-dom'
import ListPosts from '../components/ListPosts'
import PostDetails from '../components/PostDetails'
import UpdatePost from '../components/UpdatePost'
import AddPost from '../components/AddPost'
import UserAccount from '../components/UserAccount'
import './style/HomePage.css'


const HomePage = () => {
    let {initialVerificationSuccessful} = useContext(AuthContext)

    return (
        <>
            {initialVerificationSuccessful && <p role="alert">Your email was successfully verified!</p>}
            <Switch>
                <Route path="/home/account/:id" component={UserAccount} />
                <Route path="/home/post/:postId/update" component={UpdatePost}/>
                <Route path="/home/post/add" component={AddPost} />
                <Route path="/home/post/:postId" component={PostDetails}/>
                <Route path="/home">
                    <ListPosts />
                </Route>
            </Switch>
        </>
    )
}

export default HomePage

