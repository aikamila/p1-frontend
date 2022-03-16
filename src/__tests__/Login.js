import { render, screen, waitFor } from '@testing-library/react'
import App from '../App'
import { AuthProvider } from '../context/AuthContext'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import * as storageUtils from '../utils/LocalStorage'
import userEvent from '@testing-library/user-event'
import * as timingUtils from "../utils/Timing"
import renderer from 'react-test-renderer'
import { server } from '../mocks/server'
import { rest } from 'msw'


afterEach(() => {
  localStorage.removeItem("authTokens")
})

jest.setTimeout(6000)

function renderLoginPage(history) {
  history.push('/auth')
  return render(
    <Router history = {history}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}

test("all fields work properly + behavior when invalid email or password", async () => {
  const history=createMemoryHistory()
  renderLoginPage(history)
  const email = screen.getByRole('textbox', {name: /email/i})
  const password = screen.getByRole('textbox', {name: /password/i})
  expect(email).toBeInTheDocument()
  expect(password).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
  userEvent.type(email, 'invalid@mail.com')
  expect(email).toHaveValue('invalid@mail.com')
  userEvent.type(password, 'Password')
  expect(password).toHaveValue('Password')
  const submitButton = screen.getByRole('button', {name: /log in/i})
  expect(submitButton).toBeInTheDocument()
  expect(submitButton).not.toBeDisabled()
  userEvent.click(submitButton)
  expect(submitButton).toBeDisabled()
  const invalidCredentials = await screen.findByText(/invalid credentials/i)
  expect(submitButton).not.toBeDisabled()
  let alerts = screen.queryAllByRole("alert")
  expect(alerts).toHaveLength(1)
  expect(invalidCredentials).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /email/i})).toHaveStyle('border: 1px solid red')
  expect(screen.getByRole('textbox', {name: /password/i})).toHaveStyle('border: 1px solid red')
  expect(password).toHaveValue('')
  userEvent.type(password, "D")
  alerts = screen.queryAllByRole('alert')
  expect(alerts).toHaveLength(0)
  expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /email/i})).not.toHaveStyle('border: 1px solid red')
  expect(screen.getByRole('textbox', {name: /password/i})).not.toHaveStyle('border: 1px solid red')
  userEvent.click(submitButton)
  alerts = await screen.findAllByRole("alert")
  expect(alerts).toHaveLength(1)
  expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument()
  userEvent.type(email, "D")
  expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /email/i})).not.toHaveStyle('border: 1px solid red')
  expect(screen.getByRole('textbox', {name: /password/i})).not.toHaveStyle('border: 1px solid red')
  alerts = screen.queryAllByRole('alert')
  expect(alerts).toHaveLength(0)
  expect(password.value).toBe('')
  expect(localStorage.getItem("authTokens")).toBeNull()
})

test("password value disappears when the user changes the url - email doesn't", () => {
  const history=createMemoryHistory()
  renderLoginPage(history)
  const email = screen.getByRole('textbox', {name: /email/i})
  const password = screen.getByRole('textbox', {name: /password/i})
  userEvent.type(email, 'invalid@mail.com')
  userEvent.type(password, 'Password')
  history.push('/')
  history.push('/auth')
  expect(screen.getByRole('textbox', {name: /email/i})).toHaveValue('invalid@mail.com')
  expect(screen.getByRole('textbox', {name: /password/i})).toHaveValue('')
})


describe("all links work properly", () => {
  test("sigup link works properly", () => {
    const history=createMemoryHistory()
    renderLoginPage(history)
    const signupLink = screen.queryByRole("link", {name: /sign up instead/i})
    expect(signupLink).toBeInTheDocument()
    expect(signupLink).toHaveAttribute("href", "/auth/signup")
  })
  test("start page link works properly", () => {
    const history=createMemoryHistory()
    renderLoginPage(history)
    const startPageLink = screen.queryByRole("link", {name: /go back to the homepage/i})
    expect(startPageLink).toBeInTheDocument()
    expect(startPageLink).toHaveAttribute("href", "/")
  })
})

test("invalid credentials alert disappears after changing the url", async () => {
  const history=createMemoryHistory()
  renderLoginPage(history)
  const email = screen.getByRole('textbox', {name: /email/i})
  const password = screen.getByRole('textbox', {name: /password/i})
  userEvent.type(email, 'invalid@mail.com')
  userEvent.type(password, 'Password')
  const submitButton = screen.getByRole('button', {name: /log in/i})
  userEvent.click(submitButton)
  const invalidCredentials = await screen.findByText(/invalid credentials/i)
  expect(invalidCredentials).toBeInTheDocument()  
  expect(screen.getByRole('textbox', {name: /email/i})).toHaveStyle('border: 1px solid red')
  expect(screen.getByRole('textbox', {name: /password/i})).toHaveStyle('border: 1px solid red')
  history.push("/")
  history.push("/auth")
  expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /email/i})).not.toHaveStyle('border: 1px solid red')
  expect(screen.getByRole('textbox', {name: /password/i})).not.toHaveStyle('border: 1px solid red')
})

test("server error alert appears and then disappears after changing the url", async () => {
    const history = createMemoryHistory()
    renderLoginPage(history)
    const password = screen.getByRole('textbox', {name: /password/i})
    userEvent.type(password, "StrongPassword")
    const login = screen.getByRole('textbox', {name: /email/i})
    userEvent.type(login, 'servererror@mail.com')
    userEvent.click(screen.getByRole('button', {name: 'Log in'}))
    expect(await screen.findByText(/unexpected problem with the server/i)).toBeInTheDocument();
    expect(screen.queryByRole('textbox', {name: /password/i})).not.toBeInTheDocument()
    expect(screen.queryByRole('textbox', {name: /email/i})).not.toBeInTheDocument()
    expect(screen.queryByRole('button', {name: /Log in/i})).not.toBeInTheDocument();
    expect(screen.queryByRole('link', {name: /to the homepage/i})).not.toBeInTheDocument()
    expect(screen.queryByText(/sign up instead/i)).not.toBeInTheDocument()
    history.push('/')
    history.push('/auth')
    expect(screen.queryByText(/unexpected problem with the server/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('textbox', {name: /password/i})).toBeInTheDocument()
    expect(screen.queryByRole('textbox', {name: /email/i})).toBeInTheDocument()
    expect(screen.queryByRole('button', {name: /Log in/i})).toBeInTheDocument();
    expect(screen.queryByRole('link', {name: /to the homepage/i})).toBeInTheDocument()
    expect(screen.queryByText(/sign up instead/i)).toBeInTheDocument()
    expect(localStorage.getItem("authTokens")).toBeNull()
})

test("server error alert appears when an unexpected response staus is received and the error disappears after changng the url", async () => {
  const history = createMemoryHistory()
  renderLoginPage(history)
  const password = screen.getByRole('textbox', {name: /password/i})
  userEvent.type(password, "StrongPassword")
  const login = screen.getByRole('textbox', {name: /email/i})
  userEvent.type(login, "fourohfour@mail.com")
  userEvent.click(screen.getByRole('button', {name: 'Log in'}))
  expect(await screen.findByText(/unexpected problem with the server/i)).toBeInTheDocument();
  expect(screen.queryByRole('textbox', {name: /password/i})).not.toBeInTheDocument()
  expect(screen.queryByRole('textbox', {name: /email/i})).not.toBeInTheDocument()
  expect(screen.queryByRole('button', {name: /Log in/i})).not.toBeInTheDocument();
  expect(screen.queryByRole('link', {name: /to the homepage/i})).not.toBeInTheDocument()
  expect(screen.queryByText(/sign up instead/i)).not.toBeInTheDocument()
  history.push('/')
  history.push('/auth')
  expect(screen.queryByText(/unexpected problem with the server/i)).not.toBeInTheDocument()
  expect(screen.queryByRole('textbox', {name: /password/i})).toBeInTheDocument()
  expect(screen.queryByRole('textbox', {name: /email/i})).toBeInTheDocument()
  expect(screen.queryByRole('button', {name: /Log in/i})).toBeInTheDocument();
  expect(screen.queryByRole('link', {name: /to the homepage/i})).toBeInTheDocument()
  expect(screen.queryByText(/sign up instead/i)).toBeInTheDocument()
  expect(localStorage.getItem("authTokens")).toBeNull()
})

test("user logs in and everything works as expected", async () => {
  const history=createMemoryHistory()
  renderLoginPage(history)
  const calculateTimeMock = jest.spyOn(timingUtils, 'calculateTime')
  expect(calculateTimeMock(0,4,0)).toEqual(240000)
  // mock implementation that reduces the time in which tokens are updated x1000
  calculateTimeMock.mockImplementation((hours, minutes, seconds) => {return hours * 60 * 60 + minutes * 60 + seconds})
  const setItemWith8MonthExpiryMock = jest.spyOn(storageUtils, "setItemwith8MonthExpiry")
  const email = screen.getByRole('textbox', {name: /email/i})
  const password = screen.getByRole('textbox', {name: /password/i})
  userEvent.type(email, 'valid@mail.com')
  userEvent.type(password, 'Password')
  const submitButton = screen.getByRole('button', {name: /log in/i})
  userEvent.click(submitButton)
  await waitFor(() => expect(history.location.pathname).toBe('/home'))
  await waitFor(() => expect(localStorage.getItem('authTokens')).toContain("valid-access"))
  await waitFor(() => expect(localStorage.getItem('authTokens')).toContain("new-access"))
  await waitFor(() => expect(localStorage.getItem('authTokens')).toContain("new-new-access"))
  expect(setItemWith8MonthExpiryMock).toHaveBeenCalledTimes(3) // checking if tokens are set for 8 months
  expect(calculateTimeMock).toHaveBeenLastCalledWith(0, 4, 0)
  expect(history.location.pathname).toBe('/home')
  calculateTimeMock.mockRestore()
  setItemWith8MonthExpiryMock.mockRestore()
})

test("user logs in but gets logged out - the refresh token is invalid", async () => {
  const history=createMemoryHistory()
  renderLoginPage(history)
  const calculateTimeMock = jest.spyOn(timingUtils, 'calculateTime')
  calculateTimeMock.mockImplementation((hours, minutes, seconds) => {return hours * 60 * 60 + minutes * 60 + seconds})
  const email = screen.getByRole('textbox', {name: /email/i})
  const password = screen.getByRole('textbox', {name: /password/i})
  userEvent.type(email, 'invalidtoken@mail.com')
  userEvent.type(password, 'Password')
  const submitButton = screen.getByRole('button', {name: /log in/i})
  userEvent.click(submitButton)
  await waitFor(() => expect(history.location.pathname).toBe('/home'))
  await waitFor(() => expect(localStorage.getItem('authTokens')).toContain("invalid-refresh")) 
  await waitFor(() => expect(history.location.pathname).toBe('/'))
  expect(screen.getByText(/Something went wrong and you were logged out/i)).toBeInTheDocument()
  expect(localStorage.getItem('authTokens')).toBeNull()
  expect(calculateTimeMock).toHaveBeenLastCalledWith(0, 4, 0)
  await waitFor(() => expect(screen.queryByText(/Something went wrong and you were logged out/i)).not.toBeInTheDocument(), {timeout: 5050})
  calculateTimeMock.mockRestore()
})

test("user has been logged in previously - tokens are not refreshed because of a server error", async () => {
  storageUtils.setItemwith8MonthExpiry("authTokens", {access: "valid-access", refresh: "servererror"})
  const history=createMemoryHistory()
  renderLoginPage(history)
  expect(localStorage.getItem('authTokens')).toContain("servererror")
  await waitFor(() => expect(history.location.pathname).toBe("/"))
  expect(screen.getByText(/Something went wrong and you were logged out/i)).toBeInTheDocument()
  expect(localStorage.getItem('authTokens')).toBeNull()
  await waitFor(() => expect(screen.queryByText(/Something went wrong and you were logged out/i)).not.toBeInTheDocument(), {timeout: 5050})
})

test("login form is rendered correctly", () => {
  const history = createMemoryHistory();
  history.push("/auth")
  const page = renderer
    .create(
      <Router history = {history}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
    )
    .toJSON()
    expect(page).toMatchSnapshot()
})

test("email is saved in the form and is still visible when the user logs out", async () => {
  const history=createMemoryHistory()
  renderLoginPage(history)
  const email = screen.getByRole('textbox', {name: /email/i})
  const password = screen.getByRole('textbox', {name: /password/i})
  userEvent.type(email, 'valid@mail.com')
  userEvent.type(password, 'Password')
  const submitButton = screen.getByRole('button', {name: /log in/i})
  userEvent.click(submitButton)
  const logoutButton = await screen.findByRole("button", {name: /log out/i})
  userEvent.click(logoutButton)
  await waitFor(() => expect(history.location.pathname).toBe("/"))
  history.push("/auth")
  expect(screen.getByRole("textbox", {name: /email/i})).toHaveValue("valid@mail.com")
})

test("user has been logged in previously - everything works as expected", async() => {
  const calculateTimeMock = jest.spyOn(timingUtils, 'calculateTime')
  storageUtils.setItemwith8MonthExpiry("authTokens", {access: "valid-access", refresh: "valid-refresh"})
  calculateTimeMock.mockImplementation((hours, minutes, seconds) => {return hours * 60 * 60 + minutes * 60 + seconds})
  const setItemWith8MonthExpiryMock = jest.spyOn(storageUtils, "setItemwith8MonthExpiry")
  const history=createMemoryHistory()
  renderLoginPage(history)
  expect(localStorage.getItem('authTokens')).toContain("valid-refresh")
  await waitFor(() => expect(history.location.pathname).toBe("/home"))
  await waitFor(() => expect(localStorage.getItem('authTokens')).toContain("new-refresh"))
  await waitFor(() => expect(localStorage.getItem('authTokens')).toContain("new-new-refresh"))
  expect(history.location.pathname).toBe("/home")
  expect(setItemWith8MonthExpiryMock).toHaveBeenCalledTimes(2) // checking if tokens are set for 8 months
  calculateTimeMock.mockRestore()
  setItemWith8MonthExpiryMock.mockRestore()
})

test("auth tokens disappear from local storage after 8 months", () => {
  storageUtils.setItemwith8MonthExpiry("authTokens", {access: "valid", refresh: "valid"})
  jest.useFakeTimers()
  jest.advanceTimersByTime(1000 * 60 * 60 * 24 * 31 * 7)
  expect(storageUtils.getItemAndCheckExpiry("authTokens")).not.toBeNull()
  jest.advanceTimersByTime(1000 * 60 * 60 * 24 * 31 * 1)
  expect(storageUtils.getItemAndCheckExpiry("authTokens")).toBeNull()
  jest.useRealTimers()
})

test("user logs in but gets logged out - server responds with an unexpected response status (while refreshing tokens)", async () => {
  const history=createMemoryHistory()
  renderLoginPage(history)
  const calculateTimeMock = jest.spyOn(timingUtils, 'calculateTime')
  calculateTimeMock.mockImplementation((hours, minutes, seconds) => {return hours * 60 * 60 + minutes * 60 + seconds})
  const email = screen.getByRole('textbox', {name: /email/i})
  const password = screen.getByRole('textbox', {name: /password/i})
  userEvent.type(email, '404token@mail.com')
  userEvent.type(password, 'Password')
  const submitButton = screen.getByRole('button', {name: /log in/i})
  userEvent.click(submitButton)
  await waitFor(() => expect(history.location.pathname).toBe('/home'))
  await waitFor(() => expect(localStorage.getItem('authTokens')).toContain("404")) 
  await waitFor(() => expect(localStorage.getItem('authTokens')).toContain("valid-access")) 
  await waitFor(() => expect(history.location.pathname).toBe('/'))
  expect(screen.getByText(/Something went wrong and you were logged out/i)).toBeInTheDocument()
  expect(localStorage.getItem('authTokens')).toBeNull()
  expect(calculateTimeMock).toHaveBeenLastCalledWith(0, 4, 0)
  await waitFor(() => expect(screen.queryByText(/Something went wrong and you were logged out/i)).not.toBeInTheDocument(), {timeout: 5050})
  calculateTimeMock.mockRestore()
})

test("bug fix -- if one or more of the fields are empty and the server response is not 401, the user should see 'invalid credentials' instead of server error", async () => {
  server.use(
    rest.post('https://arcane-spire-03245.herokuapp.com/api/user/token/', (req, res, ctx) => {
      return res.once(
        ctx.status(400),
        ctx.json({})
      )
    })
  )
  server.use(
    rest.post('https://arcane-spire-03245.herokuapp.com/api/user/token/', (req, res, ctx) => {
      return res.once(
        ctx.status(404),
        ctx.json({})
      )
    })
  )
  const history = createMemoryHistory()
  renderLoginPage(history)
  userEvent.type(screen.getByRole("textbox", {name: /email/i}), "ee")
  userEvent.click(screen.getByRole("button", {name: /log in/i}))
  expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument()
  userEvent.type(screen.getByRole("textbox", {name: /email/i}), "{backspace}{backspace}")
  screen.debug()
  userEvent.type(screen.getByRole("textbox", {name: /password/i}), "ee")
  userEvent.click(screen.getByRole("button", {name: /log in/i}))
  expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument()
})