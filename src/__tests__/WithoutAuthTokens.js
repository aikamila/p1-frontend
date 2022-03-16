import React from "react";
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import App from '../App'
import { render } from '@testing-library/react'
import AuthContext from '../context/AuthContext'
import '@testing-library/jest-dom/extend-expect'


// testing all routes using no auth tokens


function renderPageWithoutAuthTokens(history) {
  return render(
    <AuthContext.Provider value={{authTokens: null}}>
      <Router history = {history}>
      <App />
      </Router>
    </AuthContext.Provider>
  );
}

test('users who are not logged in CANNOT view the homepage', () => {
    const history = createMemoryHistory();
    history.push('/home')
    renderPageWithoutAuthTokens(history)
    expect(history.location.pathname).toBe('/auth')
})

test('users who are not logged in CAN view the start page', () => {
    const history = createMemoryHistory();
    history.push('/')
    renderPageWithoutAuthTokens(history)
    expect(history.location.pathname).toBe('/')
})

test('users who are not logged in CAN view the login page', () => {
    const history = createMemoryHistory();
    history.push('/auth')
    renderPageWithoutAuthTokens(history)
    expect(history.location.pathname).toBe('/auth')
})

test('users who are not logged in CAN view the signup page', () => {
    const history = createMemoryHistory();
    history.push('/auth/signup')
    renderPageWithoutAuthTokens(history)
    expect(history.location.pathname).toBe('/auth/signup')
})

test('users who are not logged in CAN view the sign up success page', () => {
    const history = createMemoryHistory();
    history.push('/auth/signup/success')
    renderPageWithoutAuthTokens(history)
    expect(history.location.pathname).toBe('/auth/signup/success')
})

test('users who are not logged in CAN view the verification page', () => {
    const history = createMemoryHistory();
    history.push('/ididid/tokentokentoken')
    renderPageWithoutAuthTokens(history)
    expect(history.location.pathname).toBe('/ididid/tokentokentoken')
})

test('users who are not logged in CAN view the verification/unsuccessful page', () => {
    const history = createMemoryHistory();
    history.push('/verification/unsuccessful')
    renderPageWithoutAuthTokens(history)
    expect(history.location.pathname).toBe('/verification/unsuccessful')
})
