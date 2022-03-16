import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { AiFillStar } from 'react-icons/ai'
import './style/InitialVerificationPage.css'

const InitialVerificationPage = () => {
    let {id, token} = useParams();
    let {verifyEmail, initialVerificationError, initialVerificationServerError } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 3000)
    },[])
    
    return(
        <div>
            {initialVerificationError ? 
            <p role="alert">{initialVerificationError}</p> :
            initialVerificationServerError ?
            <p role="alert">{initialVerificationServerError}</p> :
            loading ?
            <AiFillStar role="img" aria-label="Loading! One more sec!" className="init-verification__loading" alt="Loading! One more sec!" title='Loading...'/> : 
            <button onClick={() => verifyEmail(id, token)} className="init-verification__button">Verify my email</button>}
        </div>
    )
}

export default InitialVerificationPage
