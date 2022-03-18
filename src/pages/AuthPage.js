import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import AuthHeader from '../components/AuthHeader'
import { Switch } from 'react-router-dom'
import Login from '../components/Login'
import SignUp from '../components/SignUp'
import SignUpSuccessful from '../components/SignUpSuccessful'
import PublicRoute from '../utils/PublicRoute'

const AuthPage = () => {
    let { authServerError, authSignUpServerError } = useContext(AuthContext)
    return (
        <>
        { authServerError ?
        <p role="alert">{authServerError}</p> :
        authSignUpServerError ?
        <p role="alert">{authSignUpServerError}</p> :
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
