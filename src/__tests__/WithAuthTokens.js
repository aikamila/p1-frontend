import React from "react";
import Signup from "../components/SignUp"
import {createMemoryHistory} from 'history'
import {Router} from 'react-router-dom'
import App from '../App'
import {findAllByRole, render, screen, fireEvent} from '@testing-library/react'
import { context } from "msw";
import AuthContext from '../context/AuthContext'
import '@testing-library/jest-dom/extend-expect'
import SignUp from "../components/SignUp";

// testing all routes using auth tokens


function renderPageWithAuthTokens(history) {
    return render(
      <AuthContext.Provider value={{authTokens: {access: 'valid-access', refresh: 'valid-refresh'}}}>
        <Router history = {history}>
            <App />
        </Router>
      </AuthContext.Provider>
    );
  }
  
  test('users who are logged in CAN view the homepage', () => {
      const history = createMemoryHistory();
      history.push('/home')
      renderPageWithAuthTokens(history)
      expect(history.location.pathname).toBe('/home')
  })
  
  test('users who are logged in CANNOT view the start page', () => {
      const history = createMemoryHistory();
      history.push('/')
      renderPageWithAuthTokens(history)
      expect(history.location.pathname).toBe('/home')
  })
  
  test('users who are logged in CANNOT view the login page', () => {
      const history = createMemoryHistory();
      history.push('/auth')
      renderPageWithAuthTokens(history)
      expect(history.location.pathname).toBe('/home')
  })
  
  test('users who are logged in CANNOT view the signup page', () => {
      const history = createMemoryHistory();
      history.push('/auth/signup')
      renderPageWithAuthTokens(history)
      expect(history.location.pathname).toBe('/home')
  })
  
  test('users who are logged in CANNOT view the sign up success page', () => {
      const history = createMemoryHistory();
      history.push('/auth/signup/success')
      renderPageWithAuthTokens(history)
      expect(history.location.pathname).toBe('/home')
  })
  
  test('users who are logged in CAN view the verification page', () => {
      const history = createMemoryHistory();
      history.push('/ididid/tokentokentoken')
      renderPageWithAuthTokens(history)
      expect(history.location.pathname).toBe('/ididid/tokentokentoken')
  })
  
  test('users who are logged in CAN view the verification/unsuccessful page', () => {
      const history = createMemoryHistory();
      history.push('/verification/unsuccessful')
      renderPageWithAuthTokens(history)
      expect(history.location.pathname).toBe('/verification/unsuccessful')
  })