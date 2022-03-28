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
