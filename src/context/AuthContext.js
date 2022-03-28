import { createContext, useState, useEffect, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { getItemAndCheckExpiry, setItemwith8MonthExpiry } from "../utils/LocalStorage";
import { calculateTime } from "../utils/Timing";
import { decodeUser } from "../utils/JWTDecode";

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {

    const history = useHistory()

    let location = useLocation()

    const [authTokens, setAuthTokens] = useState(null)
    const [userId, setUserId] = useState(null)

    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')

    // const [pwResetEmail, setPwResetEmail] = useState('')
    // const [pwResetPassword, setPwResetPassword] = useState('')
    // const [pwResetPasswordSecond, setPwResetPasswordSecond] = useState('')

    const [loginError, setLoginError] = useState(null) // invalid credentials
 
    const [authServerError, setAuthServerError] = useState(null) // server error while logging in
    const [authSignUpServerError, setAuthSignUpServerError] = useState(null) // server error while signing up
    const [unexpectedLogoutError, setUnexpectedLogoutError] = useState('Something went wrong and you were logged out.')
    const [initialVerificationError, setInitialVerificationError] = useState(null)
    const [initialVerificationServerError, setInitialVerificationServerError] = useState(null)
    const [initialVerificationSuccessful, setInitialVerificationSuccessful] = useState(true)

    const [loginButtonDisabled, setLoginButtonDisabled] = useState(false)

    const BACKEND_DOMAIN = 'https://arcane-spire-03245.herokuapp.com/'
    const TOKENS_OBTAIN_URL = BACKEND_DOMAIN + 'api/user/token/'
    const TOKENS_REFRESH_URL = BACKEND_DOMAIN + 'api/user/token/refresh/'
    const TOKENS_BLACKLIST_URL = BACKEND_DOMAIN + 'api/user/token/blacklist/'
    const INITIAL_EMAIL_VERIFICATION = BACKEND_DOMAIN + 'api/user/token/verification/'

    const login = useCallback(async (e) => {
        e.preventDefault();
        setLoginButtonDisabled(true)
        try{
            const response = await fetch(TOKENS_OBTAIN_URL ,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'email': loginEmail, 'password': loginPassword})
            })
            const data = await response.json()
            if (response.status === 401) {
                throw Error('Invalid credentials')
            }else if (response.status === 200){
                setUserId(decodeUser(data))
                setItemwith8MonthExpiry('authTokens', data)
                setAuthTokens(data)
                setLoginPassword('')
                history.push('/home')
            }else if(loginEmail.length === 0 || loginPassword.length === 0){
                throw Error('Invalid credentials')
            }else{
                throw Error('Something else happened')
            }
        }catch (err){
            switch (err.message){
                case 'Invalid credentials':
                    setLoginError(err.message)
                    setLoginPassword('')
                    break;
                default:
                    setAuthServerError('Upps... unexpected problem with the server occured. Try to refresh the site and log in again :)')
            }
        }
        setLoginButtonDisabled(false)
    }, 
    [TOKENS_OBTAIN_URL, loginEmail, loginPassword, history]
    )

    const logout = useCallback(async () => {
        try{
            await fetch(TOKENS_BLACKLIST_URL,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'refresh': authTokens.refresh})
            })}catch(err){
                // doing nothing if the blacklisting of tokens goes wrong on the backend
            }
        const tokens = localStorage.getItem('authTokens')
        if (tokens){
            localStorage.removeItem('authTokens')
        }
        setAuthTokens(null)
        setUserId(null)
        history.push('/')
    }, [TOKENS_BLACKLIST_URL])

    const updateToken = useCallback(async () => {
        try{
            const tokens = getItemAndCheckExpiry('authTokens')
            // we get them from the local storage bc when the user comes back, they don't have the hook set (so we would send null :( )
            const response = await fetch(TOKENS_REFRESH_URL ,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'refresh': tokens.refresh})
            })
            const data = await response.json()
            if (response.status !== 200) {
                throw Error('Invalid credentials')
            }else{
                setItemwith8MonthExpiry('authTokens', data)
                setAuthTokens(data)
                setUserId(decodeUser(data))
            }
        }catch(err){
            logout(); 
            setUnexpectedLogoutError('Something went wrong and you were logged out.')
            setTimeout(() => {
                setUnexpectedLogoutError(null)
            }, 5000)
        }
    }, [TOKENS_REFRESH_URL, logout]
    )

    const verifyEmail = async (id, token) => {
        try{
            const response = await fetch(INITIAL_EMAIL_VERIFICATION, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'id': id, 'token': token})
                })
            if(response.status === 401){
                throw Error('Invalid link')
            }else if(response.status !== 200){
                throw Error("Something else happened")
            }
            const data = await response.json()
            if(response.status===200){
                await logout(); // if there is a user that is logged in, their token should be blacklisted
                setAuthTokens(data);
                setUserId(decodeUser(data))
                setItemwith8MonthExpiry('authTokens', data)
                setInitialVerificationSuccessful(true)
                setTimeout(() => {
                    setInitialVerificationSuccessful(false)
                }, 5000)
                history.push('/home')
            }
            }catch(err){
                if(err.message === 'Invalid link'){
                    setInitialVerificationError('The link is invalid. If you have already used it, just log into your account.')
                }else(
                    setInitialVerificationServerError('Something went wrong. Please use the link once again.')
                )
                history.push("/verification/unsuccessful")
            }
        
    }

    useEffect(() => {
        const fourMinutes = calculateTime(0, 4, 0)
        let interval = setInterval(() => {
            if (authTokens){
                updateToken()
            }
        }, fourMinutes)
        return () => clearInterval(interval)
    }, [authTokens, updateToken])

    useEffect(() => {
        const updateTokenAtTheBeginning = async () => {
            const tokens = getItemAndCheckExpiry('authTokens')
            if(tokens !== null){
                await updateToken();
            }
        }   
        updateTokenAtTheBeginning()
    }, [updateToken])

    useEffect(() => {
        setLoginPassword('')
        setLoginError(null)
        setAuthSignUpServerError(null)
        setAuthServerError(null)
    }, [location])

    let contextData = {
        login: login,
        loginEmail: loginEmail,
        setLoginEmail: setLoginEmail,
        loginPassword: loginPassword,
        setLoginPassword: setLoginPassword,
        loginError: loginError,
        authTokens: authTokens, 
        logout: logout,
        authServerError: authServerError,
        unexpectedLogoutError: unexpectedLogoutError,
        verifyEmail: verifyEmail,
        initialVerificationError: initialVerificationError,
        initialVerificationServerError: initialVerificationServerError,
        initialVerificationSuccessful: initialVerificationSuccessful,
        setAuthSignUpServerError: setAuthSignUpServerError,
        authSignUpServerError: authSignUpServerError,
        BACKEND_DOMAIN: BACKEND_DOMAIN,
        setLoginError: setLoginError,
        userId: userId,
        updateToken: updateToken,
        loginButtonDisabled: loginButtonDisabled,
    }

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )}