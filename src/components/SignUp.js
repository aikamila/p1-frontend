import React, { useContext, useState, useRef } from 'react'
import AuthContext from '../context/AuthContext'
import { useHistory, Link } from 'react-router-dom'
import './style/AuthForms.css'

const SignUp = () =>{

    const API_EMAIL_ALREADY_EXISTS = "my user with this email already exists."
    const API_USERNAME_ALREADY_EXISTS = "my user with this username already exists."

    let {BACKEND_DOMAIN, setAuthSignUpServerError} = useContext(AuthContext)
    const USER_CREATION_URL = BACKEND_DOMAIN + 'api/user/registration/'

    const history = useHistory()

    const submitButtonMounted = useRef(true)

    const [signUpEmail, setSignUpEmail] = useState('')
    const [signUpPassword, setSignUpPassword] = useState('')
    const [signUpPasswordConfirmation, setSignUpPasswordConfirmation] = useState('')
    const [signUpName, setSignUpName] = useState('')
    const [signUpSurname, setSignUpSurname] = useState('')
    const [signUpUsername, setSignUpUsername] = useState('')
    const [signUpBio, setSignUpBio] = useState('')
    const [bioCharsLeft, setBioCharsLeft] = useState(150)
    const [signUpEmailError, setSignUpEmailError] = useState('')
    const [signUpPasswordError, setSignUpPasswordError] = useState('')
    const [signUpUsernameError, setSignUpUsernameError] = useState('')
    const [signUpNameError, setSignUpNameError] = useState('')
    const [signUpSurnameError, setSignUpSurnameError] = useState('')
    const [signUpBioError, setSignUpBioError] = useState('')
    const [disabled, setDisabled] = useState(false)

    const signUp = async (e) => {
        setDisabled(true)
        e.preventDefault();
        if(signUpEmail.length === 0){
            setSignUpEmailError('This field cannot be empty')
        }else if (signUpUsername.length === 0){
            setSignUpUsernameError('This field cannot be empty')
        }else if(signUpName.length === 0){
            setSignUpNameError('This field cannot be empty')
        }else if(signUpSurname.length === 0){
            setSignUpSurnameError('This field cannot be empty')
        }else if(signUpPassword.length === 0){
            setSignUpPasswordError('This field cannot be empty')
        }else if(!/^[A-Za-z]+ {1}[A-Za-z]+$|^[A-Za-z]+$/.test(signUpName.trim()) || signUpName.trim().length > 100){
            setSignUpNameError('Invalid name')
        }else if(!/^[A-Za-z]+[ -]{1}[A-Za-z]+$|^[A-Za-z]+$/.test(signUpSurname.trim()) || signUpSurname.trim().length > 100){
            setSignUpSurnameError("Invalid last name")
        }else if(!/[A-Z]/.test(signUpPassword) || !(signUpPassword.length > 7)){
            setSignUpPasswordError('Min. 8 characters. At least 1 uppercase letter.')
        }else if(signUpPasswordConfirmation !== signUpPassword){
            setSignUpPasswordError("Passwords dont't match")
        }else{
            let data;
            try{
                const response = await fetch(USER_CREATION_URL ,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'email': signUpEmail, 'password': signUpPassword, 'name': signUpName,
                'surname': signUpSurname, 'username': signUpUsername, 'bio': signUpBio})
                })
                data = await response.json()
                if (response.status === 201){
                    // to make sure that it doesn't stay here 
                    setSignUpPasswordConfirmation('')
                    setSignUpPassword('')
                    submitButtonMounted.current = false
                    history.push('/auth/signup/success')
                }else if(response.status === 400){
                    throw Error('Invalid data was sent');
                }else{
                    throw Error('Something else happened')
                }
                
            }catch(err){
                if (err.message === 'Invalid data was sent'){
                    if(data.email){
                        if(data.email[0] === API_EMAIL_ALREADY_EXISTS){
                            setSignUpEmailError('User with this email already exists. Do you wanna sign in?')
                        }else{
                            setSignUpEmailError('Invalid email')
                        }
                    }else if(data.username){
                        if(data.username[0] === API_USERNAME_ALREADY_EXISTS){
                            setSignUpUsernameError('This username is already taken')
                        }else{
                            setSignUpUsernameError('Invalid username')
                        }
                    }else if(data.name){
                        setSignUpNameError('Invalid name')
                    }else if(data.surname){
                        setSignUpSurnameError('Invalid surname')
                    }else if(data.password){
                        // in case the validation in the browser did't work for some reason
                        setSignUpPasswordError('Min. 8 characters. At least 1 uppercase letter.')
                    }else if(data.bio){
                        setSignUpBioError('Invalid bio')
                    }
                }else{
                    setAuthSignUpServerError('Upps... unexpected problem with the server occured. Try to refresh the site and create an account once again :)')
                    submitButtonMounted.current = false
                }
            }
        }
        if(submitButtonMounted.current){
            setDisabled(false)
        }
    }

    const bioCharCount= (e) => {
        let result = 150 - e.target.value.length;
        setSignUpBioError('');    
        if (result >= 0){
            setBioCharsLeft(result);
            setSignUpBio(e.target.value);
        }
    }

    return (
        <main className='sign-up-form__background'>
            <div className='sign-up-form__window'>
                <p className="sign-up-form__cta">Sign up to find<br/>your perfect coding buddy!</p>
                <div className='sign-up-form__el email'>
                    <input type="text" aria-label="email" name="name" placeholder='Email' className='email sign-up-form__input' 
                    style={signUpEmailError ? {"border": "1px solid red"} : {}} value={signUpEmail} 
                    onChange={(e) => {
                        setSignUpEmail(e.target.value);
                        setSignUpEmailError('');
                        }}/>
                    { signUpEmailError && <span className="sign-up-form__error" role="alert" data-testid="signUpEmailErr">{signUpEmailError}</span> }
                </div> 
                <div className='sign-up-form__el username'>
                    <input type="text" aria-label="username" name='username' placeholder='Username' className='username sign-up-form__input'
                    style={signUpUsernameError ? {"border": "1px solid red"} : {}} value={signUpUsername} 
                    onChange={(e) => {
                        setSignUpUsername(e.target.value)
                        setSignUpUsernameError('')
                        }}/>
                    { signUpUsernameError ?
                    <span className="sign-up-form__error" role='alert' data-testid="signUpUsernameErr">{signUpUsernameError}</span> :
                    <span>Only letters, numbers and . _ - Max. 30 characters</span> 
                    }
                </div>
                <div className="sign-up-form__el name">
                    <input type="text" name="name" aria-label="first name" placeholder='First name' className='name sign-up-form__input'
                    style={signUpNameError ? {"border": "1px solid red"} : {}} value={signUpName} 
                    onChange={(e) => {
                        setSignUpName(e.target.value)
                        setSignUpNameError('')
                        }}/>
                    {signUpNameError && <span className="sign-up-form__error" role='alert' data-testid="signUpNameErr">{signUpNameError}</span>}
                </div>
                <div className='sign-up-form__el lastname'>
                    <input type="text" name='last name' aria-label='last name' placeholder='Last name' className='lastname sign-up-form__input'
                    style={signUpSurnameError ? {"border": "1px solid red"} : {}} value={signUpSurname} 
                    onChange={(e) => {
                        setSignUpSurname(e.target.value)
                        setSignUpSurnameError('')
                        }}/>
                    {signUpSurnameError && <span className="sign-up-form__error" role='alert' data-testid="signUpSurnameErr">{signUpSurnameError}</span> }
                </div>
                <div className='sign-up-form__el password'>
                    <input type="password" aria-label="password" role="textbox" name="password" placeholder='Password' className='password sign-up-form__input'
                    style={signUpPasswordError ? {"border": "1px solid red"} : {}} value={signUpPassword} 
                    onChange={(e) => {
                        setSignUpPassword(e.target.value)
                        setSignUpPasswordError('')
                        }}/>
                    {signUpPasswordError && <span className="sign-up-form__error" role='alert' data-testid="signUpPasswordErr">{signUpPasswordError}</span>}
                </div>  
                <div className='sign-up-form__el password_second'>
                    <input type="password" aria-label="confirm your password" role="textbox" name='password' placeholder='Confirm your password' className='password_second sign-up-form__input' 
                    style={signUpPasswordError ? {"border": "1px solid red"} : {}} value={signUpPasswordConfirmation} 
                    onChange={(e) => {
                        setSignUpPasswordConfirmation(e.target.value)
                        setSignUpPasswordError('')
                        }}/>
                </div>
                <div className='sign-up-form__el bio' >   
                    <textarea name="bio" aria-label='Add bio (you can do it later)' placeholder='You can tell a little about yourself if you want' className="bio sign-up-form__input"
                    style={signUpBioError ? {"border": "1px solid red"} : {}} value={signUpBio} 
                    onChange={(e) => bioCharCount(e)}></textarea>
                    <span>{`${bioCharsLeft}/150`}</span>
                    {signUpBioError && <span className="sign-up-form__error" role='alert' data-testid="signUpBioErr"> {signUpBioError}</span>}
                </div>
                <button onClick={signUp}disabled={disabled} className="sign-up-form__button">Sign up</button>
                <p className='sign-up-form__login'>Already have an account? <Link to="/auth" className='sign-up-form__login_link'>Log in</Link> instead</p>
            </div>
        </main>
    )
}

export default SignUp

export const API_EMAIL_ALREADY_EXISTS = "my user with this email already exists."
export const API_USERNAME_ALREADY_EXISTS = "my user with this username already exists."
