import {findAllByRole, render, screen, fireEvent, getByRole, getByPlaceholderText, waitFor, getByText} from '@testing-library/react'
import Login from '../components/Login'
import App from '../App'
import AuthContext, { AuthProvider } from '../context/AuthContext'
import {Router} from 'react-router-dom'
import {createMemoryHistory} from 'history'
import { useHistory } from 'react-router-dom'
import * as storageUtils from '../utils/LocalStorage'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import StartHeader from '../components/StartHeader'
import renderer from 'react-test-renderer';

test('sign up link takes the user to the sign up page', () => {
    const history = createMemoryHistory();
    history.push('/')
    render(
        <Router history={history}>
            <StartHeader/>
        </Router>
    )
    userEvent.click(screen.getByRole("button", {name: /sign up/i}))
    expect(history.location.pathname).toBe('/auth/signup')
})

test('log in link takes the user to the sign up page', () => {
    const history = createMemoryHistory();
    history.push('/')
    render(
        <Router history={history}>
            <StartHeader/>
        </Router>
    )
    userEvent.click(screen.getByRole("button", {name: /log in/i}))
    expect(history.location.pathname).toBe('/auth')
})


test('the start page is rendered correctly', () => {
    const history = createMemoryHistory();
    history.push('/')
    const page = renderer
    .create(
        <Router history={history}>
            <AuthContext.Provider value={{authTokens: null}}>
                <App/>
            </AuthContext.Provider>
        </Router>
    )
    .toJSON()
    expect(page).toMatchSnapshot()
})
