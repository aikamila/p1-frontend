import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import userEvent from '@testing-library/user-event'
import AuthContext from '../context/AuthContext'
import HomePage from '../pages/HomePage'
import { server } from '../mocks/server'
import { rest } from 'msw'

test("all elements are initially rendered", () => {
    const history = createMemoryHistory();
    history.push("/home/post/add")
    const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
        render(
        <Router history={history}>
            <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
            userId: 1, updateToken: null}}>
                <HomePage />
            </AuthContext.Provider>
        </Router>
        )
    expect(screen.getByRole("textbox", {name:/your post/i})).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/share your idea with the world/i)).toBeInTheDocument()
    expect(screen.getByRole("button", {name: /post/i})).toBeInTheDocument()
    expect(screen.getByRole("button", {name: /post/i})).toBeDisabled()
    expect(screen.getByText("0/30")).toBeInTheDocument()

})

test("submit button gets enabled after the user types minimmum 30 characters (without whitespaces at the end and at the beginning)", () => {
    // testing the minimum word counter at the same time
    const history = createMemoryHistory();
    history.push("/home/post/add")
    const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
        render(
        <Router history={history}>
            <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
            userId: 1, updateToken: null}}>
                <HomePage />
            </AuthContext.Provider>
        </Router>
        )
    const textbox = screen.getByRole("textbox")
    userEvent.type(textbox, " ")
    expect(screen.getByRole("button", {name: /post/i})).toBeDisabled()
    expect(screen.getByText("0/30")).toBeInTheDocument()
    userEvent.type(textbox, " ".repeat(28))
    expect(screen.getByRole("button", {name: /post/i})).toBeDisabled()
    expect(screen.queryByText("0/30")).toBeInTheDocument()
    userEvent.type(textbox, "hi whats going on everybody  ")
    expect(screen.getByRole("button", {name: /post/i})).toBeDisabled()
    expect(screen.queryByText("27/30")).toBeInTheDocument()
    userEvent.type(textbox, "?")
    expect(screen.getByRole("button", {name: /post/i})).not.toBeDisabled()
    expect(screen.queryByText("/30")).not.toBeInTheDocument()
})

test("maximum lenght of input is 5000", () => {
    const history = createMemoryHistory();
    history.push("/home/post/add")
    const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
        render(
        <Router history={history}>
            <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
            userId: 1, updateToken: null}}>
                <HomePage />
            </AuthContext.Provider>
        </Router>
        )
    const textbox = screen.getByRole("textbox")
    fireEvent.change(textbox, {target: {value: "a".repeat(4999)}})
    expect(screen.queryByText(/post is too long/i)).not.toBeInTheDocument()
    userEvent.type(textbox, "a")
    expect(screen.queryByText(/post is too long/i)).not.toBeInTheDocument()
    expect(textbox).toHaveValue("a".repeat(5000))
    userEvent.type(textbox, "a")
    expect(screen.queryByText(/post is too long/i)).toBeInTheDocument()
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(textbox).toHaveValue("a".repeat(5000))
    userEvent.type(textbox, "{backspace}")
    expect(screen.queryByText(/post is too long/i)).not.toBeInTheDocument()
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(textbox).toHaveValue("a".repeat(4999))
})

test("post successfully created", async () => {
    const history = createMemoryHistory();
    history.push("/home/post/add")
    const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
        render(
        <Router history={history}>
            <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
            userId: 1, updateToken: null}}>
                <HomePage />
            </AuthContext.Provider>
        </Router>
        )
    const textbox = screen.getByRole("textbox")
    userEvent.type(textbox, "My new post my new post my new post my new post")
    userEvent.click(screen.getByRole("button", {name: /post/i}))
    expect(screen.getByRole("button", {name: /post/i})).toBeDisabled()
    expect(screen.getByRole("img", {name: /loading/i})).toBeInTheDocument()
    expect(await screen.findByText(/your post was created successfully/i)).toBeInTheDocument()
    expect(screen.getByRole("link", {name: /to the homepage/i})).toHaveAttribute("href", "/home")
    expect(screen.getByRole("link", {name: /your posts/i})).toHaveAttribute("href", "/home/account/1")
    expect(screen.queryByRole("img", {name: /loading/i})).not.toBeInTheDocument()
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
    expect(screen.queryByRole("button", {name: /post/i})).not.toBeInTheDocument()
})

test("post isn't created because server responds wth 400", async () => {
    const history = createMemoryHistory();
      history.push("/home/post/add")
      const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
          render(
          <Router history={history}>
              <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
              userId: 1, updateToken: null}}>
                  <HomePage />
              </AuthContext.Provider>
          </Router>
          )
      const textbox = screen.getByRole("textbox")
      userEvent.type(textbox, "Some invalid post some invalid post some invalid post")
      userEvent.click(screen.getByRole("button", {name: /post/i}))
      expect(screen.getByRole("button", {name: /post/i})).toBeDisabled()
      expect(screen.getByRole("img", {name: /loading/i})).toBeInTheDocument()
      expect(await screen.findByText(/seems to be invalid/i)).toBeInTheDocument()
      expect(screen.getByRole("alert")).toBeInTheDocument()
      expect(screen.queryByRole("link", {name: / go to the homepage/i})).not.toBeInTheDocument()
      expect(screen.queryByRole("link", {name: /your posts/i})).not.toBeInTheDocument()
      expect(screen.queryByRole("img", {name: /loading/i})).not.toBeInTheDocument()
      expect(screen.queryByRole("textbox")).toBeInTheDocument()
      expect(screen.queryByRole("textbox")).toHaveValue("Some invalid post some invalid post some invalid post")
      expect(screen.queryByRole("button", {name: /post/i})).toBeInTheDocument()
      expect(screen.queryByRole("button", {name: /post/i})).not.toBeDisabled()
      userEvent.type(textbox, "a")
      expect(screen.queryByText(/seems to be invalid/i)).not.toBeInTheDocument()
      expect(screen.queryByRole("alert")).not.toBeInTheDocument()
})

test("post isn't created beacuse server sends an invalid response", async () => {
    server.use(
        rest.post('https://arcane-spire-03245.herokuapp.com/api/services/posts/', (req, res, ctx) => {
          return res.once(
              ctx.status(401)
          )
        }),
      )
      const history = createMemoryHistory();
      history.push("/home/post/add")
      const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
          render(
          <Router history={history}>
              <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
              userId: 1, updateToken: null}}>
                  <HomePage />
              </AuthContext.Provider>
          </Router>
          )
      const textbox = screen.getByRole("textbox")
      userEvent.type(textbox, "My new post my new post my new post my new post")
      userEvent.click(screen.getByRole("button", {name: /post/i}))
      expect(screen.getByRole("button", {name: /post/i})).toBeDisabled()
      expect(screen.getByRole("img", {name: /loading/i})).toBeInTheDocument()
      expect(await screen.findByText(/try to submit the post later/i)).toBeInTheDocument()
      expect(screen.getByRole("alert")).toBeInTheDocument()
      expect(screen.queryByRole("link", {name: / go to the homepage/i})).not.toBeInTheDocument()
      expect(screen.queryByRole("link", {name: /your posts/i})).not.toBeInTheDocument()
      expect(screen.queryByRole("img", {name: /loading/i})).not.toBeInTheDocument()
      expect(screen.queryByRole("textbox")).toBeInTheDocument()
      expect(screen.queryByRole("textbox")).toHaveValue("My new post my new post my new post my new post")
      expect(screen.queryByRole("button", {name: /post/i})).toBeInTheDocument()
      expect(screen.queryByRole("button", {name: /post/i})).not.toBeDisabled()
      userEvent.type(textbox, "a")
      expect(screen.queryByText(/try to submit the post later/i)).not.toBeInTheDocument()
      expect(screen.queryByRole("alert")).not.toBeInTheDocument()
})

test("alert about too many characters disappears when the user submits their post", async () => {
    // this test makes sure that once an error (e.g. about an invalid server response) is displayed,
    // there is no alert about the number of letters (as this error shows up only when then number of 
    // characters is still 5000 -  a valid number)
    server.use(
        rest.post('https://arcane-spire-03245.herokuapp.com/api/services/posts/', (req, res, ctx) => {
          return res.once(
              ctx.status(500)
          )
        }),
      )
      const history = createMemoryHistory();
      history.push("/home/post/add")
      const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
          render(
          <Router history={history}>
              <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
              userId: 1, updateToken: null}}>
                  <HomePage />
              </AuthContext.Provider>
          </Router>
          )
    const textbox = screen.getByRole("textbox")
    fireEvent.change(textbox, {target: {value: "a".repeat(4999)}})
    userEvent.type(textbox, "aa")
    expect(screen.queryByText(/post is too long/i)).toBeInTheDocument()
    userEvent.click(screen.getByRole("button", {name: /post/i}))
    expect(screen.queryByText(/post is too long/i)).not.toBeInTheDocument()
    expect(await screen.findByText(/try to submit the post later/i)).toBeInTheDocument()
    expect(screen.getAllByRole('alert')).toHaveLength(1)
})