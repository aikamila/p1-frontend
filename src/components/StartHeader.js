import React from 'react'
import { Link } from 'react-router-dom'
import './style/StartHeader.css';
import Logo from './Logo'


const StartHeader = () => {
    return (
        <header className='start-header' role="banner">
            <div className='start-header__logo'>
                <Logo></Logo>
            </div>
            <nav className='start-header__navbar' aria-label='main navigation' role="navigation">
            <Link className="start-header__sign_up" role="button" to='/auth/signup'>Sign up</Link>
            <span className='start-header__division'>   |   </span>
            <Link className="start-header__log_in" role="button" to='/auth'>Log in</Link>
            </nav>
        </header>
        
    )
}

export default StartHeader
