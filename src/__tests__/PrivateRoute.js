import React from "react";
import { createMemoryHistory } from 'history'
import { Router, Route } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import AuthContext from '../context/AuthContext'
import PrivateRoute from "../utils/PrivateRoute";

test("PrivateRoute redirects users to login page", () => {
  const history = createMemoryHistory({ initialEntries: ["/secret"] });
  const PrivateComponent = () => <p>Private!</p>
  const PublicComponent = () => <p>Redirected!</p>
  render(
    <AuthContext.Provider value={{authTokens: null}}>
      <Router history={history}>
        <PrivateRoute exact path="/secret">
          <PrivateComponent/>
        </PrivateRoute>
        <Route exact path="/auth" component={PublicComponent} />
      </Router>
    </AuthContext.Provider>
  );
  expect(screen.queryByText("Private!")).not.toBeInTheDocument();
  expect(screen.queryByText("Redirected!")).toBeInTheDocument();
  expect(history.location.pathname).toBe("/auth")
});
