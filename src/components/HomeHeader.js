import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'

const HomeHeader = () => {
    let { logout, userId} = useContext(AuthContext)
    return (
        <header>
            <nav>
                <Link to="/home/post/add">Add a post</Link>
                <Link to="/home">Homepage</Link>
                <Link to={`/home/account/${userId}`}>My account</Link>
                <button onClick={logout}>Log out</button>
            </nav>
        </header>
    )
}

export default HomeHeader
