import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { AiFillStar } from 'react-icons/ai'
import './style/InitialVerificationPage.css'

const InitialVerificationPage = () => {
    let {id, token} = useParams();
    let {verifyEmail, initialVerificationError, initialVerificationServerError } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 3000)
        return () => setLoading(true)
    },[])
    
    return(
        <main className='init-verification__background' role="main">
          <div className='init-verification__wrapper'>
            {initialVerificationError ? 
            <p role="alert" className='init-verification__alert'>{initialVerificationError}</p> :
            initialVerificationServerError ?
            <p role="alert" className='init-verification__alert'>{initialVerificationServerError}</p> :
            loading ?
            <AiFillStar role="img" aria-label="Loading! One more sec!" className="init-verification__loading" title='Loading...'/> : 
            <>
                <p className='init-verification__prompt' id="verification-prompt">Thanks for registration!
                <br/> Click on the button below. You will be redirected to the homepage :)</p>
                <button onClick={() => verifyEmail(id, token)} className="init-verification__button" 
                aria-describedby='verification-prompt' disabled={disabled}>Verify my email</button>
            </>
            }
          </div>
        </main>
    )
}

export default InitialVerificationPage
