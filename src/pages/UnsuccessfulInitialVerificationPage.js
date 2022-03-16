import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const UnsuccessfulInitialVerificationPage = () => {
    let {initialVerificationError, initialVerificationServerError} = useContext(AuthContext)
    return (
        <>
        <div>{
            initialVerificationServerError ? 
            <p role="alert">{initialVerificationServerError}</p> :
            <p role="alert">{initialVerificationError}</p>
            }</div>

            <p>Unsuccessful</p>
        </>
    )
}

export default UnsuccessfulInitialVerificationPage
