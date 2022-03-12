import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'

const HomeHeader = () => {
    let { logout } = useContext(AuthContext)
    return (
        <header>
            <nav>
                <p role="button" onClick={logout}>Log out</p>
            </nav>
        </header>
    )
}

export default HomeHeader
