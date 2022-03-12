import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import AuthHeader from '../components/AuthHeader'
import { Switch, Route } from 'react-router-dom'
import Login from '../components/Login'
import SignUp from '../components/SignUp'
import SignUpSuccessful from '../components/SignUpSuccessful'

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
                <Route path="/auth/signup/success" component={SignUpSuccessful}/>
                <Route path="/auth/signup" component={SignUp} />
                <Route path="/auth" component={Login} />
            </Switch>
        </>
        
        }
        </>
    )
}

export default AuthPage
