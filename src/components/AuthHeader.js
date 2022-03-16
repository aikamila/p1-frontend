import { AiOutlineClose } from "react-icons/ai";
import { Link } from 'react-router-dom'
import React from 'react'
import './style/AuthHeader.css'
import shangify_logo from './style/images/shangify_logo.png'
import shangify_brand_name from './style/images/shangify_brand_name.png'


const AuthHeader = () => {
    return (
        <header className="auth-header" role="banner">
            <img className="auth-header__img1" src={shangify_logo} alt="shangify brand logo"></img>
            <img className="auth-header__img2" src={shangify_brand_name} alt=""></img>
            <nav aria-label="main navigation" className="auth-header__nav" role="navigation">
                <Link className="auth-header__homepage_link"aria-label="Go back to the homepage" to="/"><AiOutlineClose /></Link>
            </nav>
        </header>
    )
}

export default AuthHeader
