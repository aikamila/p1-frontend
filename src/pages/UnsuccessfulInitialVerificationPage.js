import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import './style/UnsuccessfulInitialVerification.css'

const UnsuccessfulInitialVerificationPage = () => {
    let {initialVerificationError, initialVerificationServerError} = useContext(AuthContext)
    return (
        <main role="main" className='fail-init-ver__background'>
            <div className='fail-init-ver__wrapper'>{
                initialVerificationServerError ? 
                <p role="alert" className='fail-init-ver__alert'>{initialVerificationServerError}</p> :
                <p role="alert" className='fail-init-ver__alert'>{initialVerificationError}</p>}
                <p className='fail-init-ver__alert'>Unsuccessful. Try again. Maybe something went wrong</p>
            </div>
        </main>
    )
}

export default UnsuccessfulInitialVerificationPage
