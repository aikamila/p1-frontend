import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import './style/AuthForms.css'

const Login = () => {
    let {login, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginError, setLoginError , loginButtonDisabled} = useContext(AuthContext)
    return (
        <main className="log-in-form__background">
            <div className="log-in-form__window">
                <div className='log-in-form__el cta'>
                    <p>Welcome again!<br></br>Log in and share your creative ideas with the world!</p>
                </div>
                <div className="log-in-form__el email">
                    <input type="text" aria-label="email" name="email" placeholder='Email' 
                    value={loginEmail} className="log-in-form__input" style={loginError ? {"border": "1px solid red"} : {}} onChange={(e) => {
                        setLoginEmail(e.target.value)
                        setLoginError(null)}
                        }/>
                </div>
                <div className='log-in-form__el password'>
                    <input type="password" role="textbox" aria-label='password' name='password' placeholder='Password'
                    value={loginPassword} className="log-in-form__input" style={loginError ? {"border": "1px solid red"} : {}} onChange={(e) => {
                        setLoginPassword(e.target.value)
                        setLoginError(null)
                        }
                        }/>
                    {loginError && <span role="alert" className='log-in-form__error'>{`${loginError}`}</span>}
                </div>
                <button onClick={login} className="log-in-form__button" disabled={loginButtonDisabled}>Log in</button>
                <p>I wanna <Link to="/auth/signup" className='log-in-form__signup_link'>sign up instead</Link></p>
            </div>
        </main>
    )
}

export default Login
