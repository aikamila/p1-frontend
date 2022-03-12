import React from 'react'
import {render, screen, waitFor, fireEvent } from '@testing-library/react'
import {Router} from 'react-router-dom'
import {createMemoryHistory} from 'history'
import userEvent from '@testing-library/user-event'
import renderer from 'react-test-renderer'
import AuthContext from '../context/AuthContext'
import HomePage from '../pages/HomePage'
import {server} from '../mocks/server'
import {rest} from 'msw'

test("given post doesn't exist", async () => {
    server.use(
        rest.get('https://arcane-spire-03245.herokuapp.com/api/services/posts/10/basic/', (req, res, ctx) => {
          return res.once(
              ctx.status(404),
              ctx.json({
                  message: "This post doesn't exist"
              })
          )
        }),
      )
      const history = createMemoryHistory();
      history.push("/home/post/10/update")
      const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
          render(
          <Router history={history}>
              <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
              userId: 7, updateToken: null}}>
                  <HomePage />
              </AuthContext.Provider>
          </Router>
          )
                
    expect(screen.getByRole("img", {name:/loading/i})).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole("img", {name:/loading/i})).not.toBeInTheDocument())
    expect(screen.getByText(/this post doesn't exist/i)).toBeInTheDocument()
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
})

test("handling an error while fetching initial data", async () => {
    server.use(
        rest.get('https://arcane-spire-03245.herokuapp.com/api/services/posts/10/basic/', (req, res, ctx) => {
          return res.once(
              ctx.status(500)
          )
        }),
      )
      const history = createMemoryHistory();
      history.push("/home/post/10/update")
      const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
          render(
          <Router history={history}>
              <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
              userId: 7, updateToken: null}}>
                  <HomePage />
              </AuthContext.Provider>
          </Router>
          )
    expect(screen.getByRole("img", {name:/loading/i})).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole("img", {name:/loading/i})).not.toBeInTheDocument())
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
})

test("only the author can access the page", async () => {
    const history = createMemoryHistory();
    history.push("/home/post/10/update")
    const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
        render(
        <Router history={history}>
            <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
            userId: 8, updateToken: null}}>
                <HomePage />
            </AuthContext.Provider>
        </Router>
        )
    expect(screen.getByRole("img", {name:/loading/i})).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole("img", {name:/loading/i})).not.toBeInTheDocument())
    expect(screen.getByText(/not the author of this post/i)).toBeInTheDocument()
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
})

test("the page is rendered correctly", async () => {
    const history = createMemoryHistory();
    history.push("/home/post/10/update")
    const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
        render(
        <Router history={history}>
            <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
            userId: 7, updateToken: null}}>
                <HomePage />
            </AuthContext.Provider>
        </Router>
        )
    expect(screen.getByRole("img", {name:/loading/i})).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole("img", {name:/loading/i})).not.toBeInTheDocument())
    expect(screen.getByRole("textbox", {name:/your edited post/i})).toBeInTheDocument()
    expect(screen.getByRole("textbox", {name:/your edited post/i})).toHaveValue("Valid post valid post valid post.")
    expect(screen.getByPlaceholderText(/share your idea with the world/i)).toBeInTheDocument()
    expect(screen.getByRole("button", {name: /save changes/i})).toBeInTheDocument()
    expect(screen.getByRole("button", {name: /save changes/i})).not.toBeDisabled()
    expect(screen.queryByText("/30")).not.toBeInTheDocument()
})

test("submit button is enabled only when the input consists of 30 characters (without whitespaces at the beginning and the end)", async () => {
    const history = createMemoryHistory();
    history.push("/home/post/10/update")
    const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
        render(
        <Router history={history}>
            <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
            userId: 7, updateToken: null}}>
                <HomePage />
            </AuthContext.Provider>
        </Router>
        )
    await waitFor(() => expect(screen.queryByRole("img", {name:/loading/i})).not.toBeInTheDocument())
    const input = screen.getByRole("textbox", {name:/your edited post/i})
    input.setSelectionRange(20, 33)
    userEvent.type(input, "{backspace}")
    expect(screen.getByText("20/30")).toBeInTheDocument()
    expect(screen.getByRole("button", {name: /save changes/i})).toBeDisabled()
    userEvent.type(input, " ".repeat(5))
    expect(screen.getByText("20/30")).toBeInTheDocument()
    expect(screen.getByRole("button", {name: /save changes/i})).toBeDisabled()
    userEvent.type(input, "a".repeat(5))
    expect(screen.queryByText("/30")).not.toBeInTheDocument()
    expect(screen.getByRole("button", {name: /save changes/i})).not.toBeDisabled()
})

test("maximum length of input is 5000", async () => {
    const history = createMemoryHistory();
    history.push("/home/post/10/update")
    const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
        render(
        <Router history={history}>
            <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
            userId: 7, updateToken: null}}>
                <HomePage />
            </AuthContext.Provider>
        </Router>
        )
    await waitFor(() => expect(screen.queryByRole("img", {name:/loading/i})).not.toBeInTheDocument())
    const input = screen.getByRole("textbox", {name:/your edited post/i})
    fireEvent.change(input, {target: {value: "a".repeat(4999)}})
    expect(screen.queryByText(/post is too long/i)).not.toBeInTheDocument()
    userEvent.type(input, "a")
    expect(screen.queryByText(/post is too long/i)).not.toBeInTheDocument()
    expect(input).toHaveValue("a".repeat(5000))
    userEvent.type(input, "a")
    expect(screen.queryByText(/post is too long/i)).toBeInTheDocument()
    expect(input).toHaveValue("a".repeat(5000))
    expect(screen.getByRole("alert")).toBeInTheDocument()
    userEvent.type(input, "{backspace}")
    expect(screen.queryByText(/post is too long/i)).not.toBeInTheDocument()
    expect(input).toHaveValue("a".repeat(4999))
})

test("post is updated successfully", async () => {
    const history = createMemoryHistory();
    history.push("/home/post/10/update")
    const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
        render(
        <Router history={history}>
            <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
            userId: 7, updateToken: null}}>
                <HomePage />
            </AuthContext.Provider>
        </Router>
        )
    await waitFor(() => expect(screen.queryByRole("img", {name:/loading/i})).not.toBeInTheDocument())
    const textbox = screen.getByRole("textbox")
    textbox.setSelectionRange(0,33)
    userEvent.type(textbox, "{backspace}My updated post my updated post my updated post my updated post")
    userEvent.click(screen.getByRole("button", {name: /save changes/i}))
    expect(screen.getByRole("button", {name: /save changes/i})).toBeDisabled()
    expect(screen.getByRole("img", {name: /loading/i})).toBeInTheDocument()
    expect(await screen.findByText(/your post was updated successfully/i)).toBeInTheDocument()
    expect(screen.getByRole("link", {name: /to the homepage/i})).toHaveAttribute("href", "/home")
    expect(screen.getByRole("link", {name: /your posts/i})).toHaveAttribute("href", "/home/account/7")
    expect(screen.queryByRole("img", {name: /loading/i})).not.toBeInTheDocument()
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
    expect(screen.queryByRole("button", {name: /save changes/i})).not.toBeInTheDocument()
})

test("post isn't updated because the server responds with 400", async () => {
    const history = createMemoryHistory();
    history.push("/home/post/10/update")
    const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
        render(
        <Router history={history}>
            <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
            userId: 7, updateToken: null}}>
                <HomePage />
            </AuthContext.Provider>
        </Router>
        )
    await waitFor(() => expect(screen.queryByRole("img", {name:/loading/i})).not.toBeInTheDocument())
    const textbox = screen.getByRole("textbox")
    textbox.setSelectionRange(0,33)
    userEvent.type(textbox, "{backspace}Some invalid post some invalid post some invalid post")
    userEvent.click(screen.getByRole("button", {name: /save changes/i}))
    expect(screen.getByRole("button", {name: /save changes/i})).toBeDisabled()
    expect(screen.getByRole("img", {name: /loading/i})).toBeInTheDocument()
    expect(await screen.findByText(/seems to be invalid/i)).toBeInTheDocument()
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.queryByRole("link", {name: / go to the homepage/i})).not.toBeInTheDocument()
    expect(screen.queryByRole("link", {name: /your posts/i})).not.toBeInTheDocument()
    expect(screen.queryByRole("img", {name: /loading/i})).not.toBeInTheDocument()
    expect(screen.queryByRole("textbox")).toBeInTheDocument()
    expect(textbox).toHaveValue("Some invalid post some invalid post some invalid post")
    expect(screen.queryByRole("button", {name: /save changes/i})).toBeInTheDocument()
    expect(screen.queryByRole("button", {name: /save changes/i})).not.toBeDisabled()
    userEvent.type(textbox, "a")
    expect(screen.queryByText(/seems to be invalid/i)).not.toBeInTheDocument()
})

test("post isn't updated beacause the server sends an invalid response", async () => {
    server.use(
        rest.put('https://arcane-spire-03245.herokuapp.com/api/services/posts/10/', (req, res, ctx) => {
          return res.once(
              ctx.status(405)
          )
        }),
      )
    const history = createMemoryHistory();
    history.push("/home/post/10/update")
    const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
        render(
        <Router history={history}>
            <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
            userId: 7, updateToken: null}}>
                <HomePage />
            </AuthContext.Provider>
        </Router>
        )
    await waitFor(() => expect(screen.queryByRole("img", {name:/loading/i})).not.toBeInTheDocument())
    const textbox = screen.getByRole("textbox")
    userEvent.type(textbox, "Now my post is updated. I'm so happy about this :)))))) Yeah!")
    userEvent.click(screen.getByRole("button", {name: /save changes/i}))
    expect(screen.getByRole("button", {name: /save changes/i})).toBeDisabled()
    expect(screen.getByRole("img", {name: /loading/i})).toBeInTheDocument()
    expect(await screen.findByText(/try to save the post later/i)).toBeInTheDocument()
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.queryByRole("link", {name: / go to the homepage/i})).not.toBeInTheDocument()
    expect(screen.queryByRole("link", {name: /your posts/i})).not.toBeInTheDocument()
    expect(screen.queryByRole("img", {name: /loading/i})).not.toBeInTheDocument()
    expect(screen.queryByRole("textbox")).toBeInTheDocument()
    expect(screen.queryByRole("textbox")).not.toHaveValue("")
    expect(screen.queryByRole("button", {name: /save changes/i})).toBeInTheDocument()
    expect(screen.queryByRole("button", {name: /save changes/i})).not.toBeDisabled()
    userEvent.type(textbox, "a")
    expect(screen.queryByText(/try to save the post later/i)).not.toBeInTheDocument()
})

test("alert about too many characters disappears when the user saves their post", async () => {
    // this test makes sure that once an error (e.g. about an invalid server response) is displayed,
    // there is no alert about the number of letters (as this error shows up only when then number of 
    // characters is still 5000 - a valid number)
    server.use(
        rest.put('https://arcane-spire-03245.herokuapp.com/api/services/posts/10/', (req, res, ctx) => {
          return res.once(
              ctx.status(401)
          )
        }),
      )
      const history = createMemoryHistory();
      history.push("/home/post/10/update")
      const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
          render(
          <Router history={history}>
              <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
              userId: 7, updateToken: null}}>
                  <HomePage />
              </AuthContext.Provider>
          </Router>
          )
    const textbox = await screen.findByRole("textbox")
    fireEvent.change(textbox, {target: {value: "a".repeat(4999)}})
    userEvent.type(textbox, "aa")
    expect(screen.queryByText(/post is too long/i)).toBeInTheDocument()
    userEvent.click(screen.getByRole("button", {name: /save changes/i}))
    expect(screen.queryByText(/post is too long/i)).not.toBeInTheDocument()
    expect(await screen.findByText(/try to save the post later/i)).toBeInTheDocument()
})