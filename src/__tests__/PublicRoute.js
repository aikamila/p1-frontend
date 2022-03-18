import React from "react";
import { createMemoryHistory } from 'history'
import { Router, Route } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import AuthContext from '../context/AuthContext'
import PublicRoute from "../utils/PublicRoute";


test("PublicRoute redirects logged-in users to homepage", () => {
  const history = createMemoryHistory({ initialEntries: ["/forEveryone"] });
  const PublicComponent = () => <p>Public!</p>
  const Homepage = () => <p>Back to the homepage</p>
  render(
    <AuthContext.Provider value={{authTokens: {access: "access-token", refresh: "refresh-token"}}}>
      <Router history={history}>
        <PublicRoute exact path="/forEveryone">
          <PublicComponent/>
        </PublicRoute>
        <Route exact path="/home" component={Homepage} />
      </Router>
    </AuthContext.Provider>
  );
  expect(screen.queryByText("Public!")).not.toBeInTheDocument();
  expect(screen.queryByText("Back to the homepage")).toBeInTheDocument();
  expect(history.location.pathname).toBe("/home")
});


// function renderPageWithAuthTokens(history) {
//     return render(
//       <AuthContext.Provider value={{authTokens: {access: 'valid-access', refresh: 'valid-refresh'}}}>
//         <Router history = {history}>
//             <App />
//         </Router>
//       </AuthContext.Provider>
//     );
//   }
  
//   test('users who are logged in CAN view the homepage', () => {
//     //   const history = createMemoryHistory();
//     //   history.push('/home')
//     //   renderPageWithAuthTokens(history)
//     //   expect(history.location.pathname).toBe('/home')
//   })
  
//   test('users who are logged in CANNOT view the start page', () => {
//       const history = createMemoryHistory();
//       history.push('/')
//       renderPageWithAuthTokens(history)
//       expect(history.location.pathname).toBe('/home')
//   })
  
//   test('users who are logged in CANNOT view the login page', () => {
//       const history = createMemoryHistory();
//       history.push('/auth')
//       renderPageWithAuthTokens(history)
//       expect(history.location.pathname).toBe('/home')
//   })
  
//   test('users who are logged in CANNOT view the signup page', () => {
//       const history = createMemoryHistory();
//       history.push('/auth/signup')
//       renderPageWithAuthTokens(history)
//       expect(history.location.pathname).toBe('/home')
//   })
  
//   test('users who are logged in CANNOT view the sign up success page', () => {
//       const history = createMemoryHistory();
//       history.push('/auth/signup/success')
//       renderPageWithAuthTokens(history)
//       expect(history.location.pathname).toBe('/home')
//   })
  
//   test('users who are logged in CAN view the verification page', () => {
//       const history = createMemoryHistory();
//       history.push('/ididid/tokentokentoken')
//       renderPageWithAuthTokens(history)
//       expect(history.location.pathname).toBe('/ididid/tokentokentoken')
//   })
  
//   test('users who are logged in CAN view the verification/unsuccessful page', () => {
//       const history = createMemoryHistory();
//       history.push('/verification/unsuccessful')
//       renderPageWithAuthTokens(history)
//       expect(history.location.pathname).toBe('/verification/unsuccessful')
//   })