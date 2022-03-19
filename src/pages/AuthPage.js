import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import AuthHeader from '../components/AuthHeader'
import { Switch } from 'react-router-dom'
import Login from '../components/Login'
import SignUp from '../components/SignUp'
import SignUpSuccessful from '../components/SignUpSuccessful'
import PublicRoute from '../utils/PublicRoute'
import './style/AuthPage.css'

const AuthPage = () => {
    const { authServerError, authSignUpServerError } = useContext(AuthContext)
    return (
        <>
        { authServerError ?
        <div className='auth-page__err_wrapper'>
            <p role="alert" className='auth-page__err'>{authServerError}</p>
        </div> :
        authSignUpServerError ?
        <div className='auth-page__err_wrapper'>
            <p role="alert" className='auth-page__err'>{authSignUpServerError}</p>
        </div> :
        <>
            <AuthHeader/>
            <Switch>
                <PublicRoute path="/auth/signup/success" component={SignUpSuccessful}/>
                <PublicRoute path="/auth/signup" component={SignUp} />
                <PublicRoute path="/auth" component={Login} />
            </Switch>
        </>
        }
        </>
    )
}

export default AuthPage
