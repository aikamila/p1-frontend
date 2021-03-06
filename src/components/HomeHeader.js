import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'
import './style/HomeHeader.css'
// import shangify_logo from './style/images/shangify_logo.png'
// import shangify_brand_name from './style/images/shangify_brand_name.png'
import Logo from './Logo'
import { BiPlusCircle } from "react-icons/bi";
import { BiHomeAlt } from "react-icons/bi";
import { BsFillPersonFill } from "react-icons/bs"



const HomeHeader = ({disabled = false}) => {
    const {logout, userId} = useContext(AuthContext)
    return (
        <header role="banner" className='home-header__background'>
            <div>
                <Logo/>
                {/* <img className="home-header__img1" src={shangify_logo} alt="shangify brand logo"></img>
                <img className="home-header__img2" src={shangify_brand_name} alt=""></img> */}
            </div>
            <nav role="navigation" aria-label='main navigation' className='home-header__nav'>
                <Link to="/home/post/add" aria-label="add a post" title='Add a post'
                 style={disabled ? {pointerEvents: 'none'} : {pointerEvents: 'auto'}}><BiPlusCircle/></Link>
                <Link to="/home" aria-label="homepage" title="Homepage" 
                style={disabled ? {pointerEvents: 'none'} : {pointerEvents: 'auto'}}><BiHomeAlt/></Link>
                <Link to={`/home/account/${userId}`} aria-label="my account" title="My account"
                style={disabled ? {pointerEvents: 'none'} : {pointerEvents: 'auto'}}><BsFillPersonFill/></Link>
                <button onClick={logout} disabled={disabled}>Log out</button>
            </nav>
        </header>
    )
}

export default HomeHeader
