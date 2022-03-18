import React from 'react'
import { Link } from 'react-router-dom'
import './style/StartHeader.css';
;


const StartHeader = () => {
    return (
        <header className='start-header' role="banner">
            <nav className='start-header__navbar' aria-label='main navigation' role="navigation">
            <Link className="start-header__sign-up" role="button" to='/auth/signup'>Sign up</Link>
            <span className='start-header__division'>   |   </span>
            <Link className="start-header__log-in" role="button" to='/auth'>Log in</Link>
            </nav>
        </header>
        
    )
}

export default StartHeader
