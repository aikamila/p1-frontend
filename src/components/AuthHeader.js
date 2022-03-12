import {AiOutlineClose} from "react-icons/ai";
import {useHistory, Link} from 'react-router-dom'
import React from 'react'
import './style/AuthHeader.css'
import shangify from './style/images/shangify.png'

const AuthHeader = () => {
    const history = useHistory();
    return (
        <header className="auth-header">
            <img src={shangify} alt="shangify brand logo"></img>
            <nav aria-label="main navigation">
                <Link className="auth-header__homepage_link"aria-label="Go back to the homepage" to="/"><AiOutlineClose /></Link>
            </nav>
        </header>
    )
}

export default AuthHeader
