import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import './style/EmailVerification.css'

const UnsuccessfulInitialVerificationPage = () => {
    let {initialVerificationError, initialVerificationServerError} = useContext(AuthContext)
    return (
        <main role="main" className='fail-init-ver__background'>
            <div className='fail-init-ver__wrapper'>{
                initialVerificationServerError ? 
                <p role="alert" className='fail-init-ver__alert'>{initialVerificationServerError}</p> :
                <p role="alert" className='fail-init-ver__alert'>{initialVerificationError}</p>}
            </div>
        </main>
    )
}

export default UnsuccessfulInitialVerificationPage
