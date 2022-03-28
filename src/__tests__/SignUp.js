import React from "react";
import Signup from "../components/SignUp"
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import App from '../App'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthContext, { AuthProvider } from '../context/AuthContext'
import '@testing-library/jest-dom/extend-expect'
import userEvent from "@testing-library/user-event";
import renderer from 'react-test-renderer';

const renderSignUpComponentWithFakeContext = () => {
  const history = createMemoryHistory()
  return(  
    render(
    <Router history={history}>
      <AuthContext.Provider value={{BACKEND_DOMAIN: 'https://arcane-spire-03245.herokuapp.com/', setAuthSignUpServerError: null}}>
        <Signup/>
      </AuthContext.Provider>
    </Router>
  ))
}

const renderSignUpComponentWithNormalContext = (history) => {
  history.push('/auth/signup')
  return(  
    render(
      <Router history={history}>
        <AuthProvider>
          <App/>
        </AuthProvider>
      </Router>
  ))
}

test('email field - client-side validation', () => {
  renderSignUpComponentWithFakeContext()
  const email = screen.getByRole('textbox', {name: /email/i})
  expect(email).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
  const submitButton = screen.getByRole('button', {name: /sign up/i})
  expect(submitButton).toBeInTheDocument()
  expect(submitButton).not.toBeDisabled()
  userEvent.click(submitButton)
  const alerts = screen.getAllByRole('alert')
  expect(alerts).toHaveLength(1)
  expect(screen.getByTestId('signUpEmailErr')).toBeInTheDocument()
  expect(screen.getByText(/cannot be empty/i)).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /email/i})).toHaveStyle('border: 1px solid red')
  fireEvent.change(email, {target: {value: 'myemail@mail.com'}})
  expect(screen.queryAllByRole('alert')).toHaveLength(0)
  expect(screen.queryByText(/cannot be empty/i)).not.toBeInTheDocument()
  expect(email).toHaveValue('myemail@mail.com')
})

test('name field - client-side validation', () => {
  renderSignUpComponentWithFakeContext()
  expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument()
  const email = screen.getByRole('textbox', {name: /email/i})
  const username = screen.getByRole('textbox', {name: /username/i})
  const surname = screen.getByRole('textbox', {name: /last name/i})
  const name = screen.getByRole('textbox', {name: /first name/i})
  const password = screen.getByRole('textbox', {name: /^password/i})
  const passwordConfirmation = screen.getByRole('textbox', {name: /confirm your password/i})
  userEvent.type(email, "myemail@mail.com")
  userEvent.type(username, "username")
  expect(name).toBeInTheDocument()
  const submitButton = screen.getByRole('button', {name: /sign up/i})
  userEvent.click(submitButton)
  let alerts = screen.getAllByRole('alert')
  expect(alerts).toHaveLength(1)
  expect(screen.getByTestId('signUpNameErr')).toBeInTheDocument()
  expect(screen.getByText(/cannot be empty/i)).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /first name/i})).toHaveStyle('border: 1px solid red')
  userEvent.type(name, "MyName3")
  expect(screen.queryAllByRole('alert')).toHaveLength(0)
  expect(screen.queryByText(/cannot be empty/i)).not.toBeInTheDocument()
  expect(name).toHaveValue("MyName3")
  userEvent.type(password, "password")
  userEvent.type(passwordConfirmation, "passwordConfirmed")
  userEvent.type(surname, "Surname")
  userEvent.click(submitButton)
  alerts = screen.getAllByRole('alert')
  expect(alerts).toHaveLength(1)
  expect(screen.getByTestId('signUpNameErr')).toBeInTheDocument()
  expect(screen.getByText(/invalid name/i)).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /first name/i})).toHaveStyle('border: 1px solid red')
  userEvent.type(name, "MyName3")
  expect(screen.queryAllByRole('alert')).toHaveLength(0)
  expect(screen.queryByText(/invalid name/i)).not.toBeInTheDocument()
})

test("surname field - client-side validation", () => {
  renderSignUpComponentWithFakeContext()
  const email = screen.getByRole('textbox', {name: /email/i})
  const username = screen.getByRole('textbox', {name: /username/i})
  const surname = screen.getByRole('textbox', {name: /last name/i})
  const name = screen.getByRole('textbox', {name: /first name/i})
  const password = screen.getByRole('textbox', {name: /^password/i})
  const passwordConfirmation = screen.getByRole('textbox', {name: /confirm your password/i})
  expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument()
  expect(surname).toBeInTheDocument()
  userEvent.type(email, "myemail@mail.com")
  userEvent.type(username, "username")
  userEvent.type(name, "Name")
  const submitButton = screen.getByRole('button', {name: /sign up/i})
  userEvent.click(submitButton)
  let alerts = screen.getAllByRole('alert')
  expect(alerts).toHaveLength(1)
  expect(screen.getByTestId('signUpSurnameErr')).toBeInTheDocument()
  expect(screen.getByText(/cannot be empty/i)).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /last name/i})).toHaveStyle('border: 1px solid red')
  userEvent.type(surname, "MySurname3")
  expect(screen.queryAllByRole('alert')).toHaveLength(0)
  expect(screen.queryByText(/cannot be empty/i)).not.toBeInTheDocument()
  expect(surname).toHaveValue("MySurname3")
  userEvent.type(password, "password")
  userEvent.type(passwordConfirmation, "passwordConfirmed")
  userEvent.click(submitButton)
  alerts = screen.getAllByRole('alert')
  expect(alerts).toHaveLength(1)
  expect(screen.getByTestId('signUpSurnameErr')).toBeInTheDocument()
  expect(screen.getByText(/invalid last name/i)).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /last name/i})).toHaveStyle('border: 1px solid red')
  userEvent.type(surname, "a")
  expect(screen.queryAllByRole('alert')).toHaveLength(0)
  expect(screen.queryByText(/invalid last name/i)).not.toBeInTheDocument()
})

test("username field - client-side validation", () => {
  renderSignUpComponentWithFakeContext()
  const email = screen.getByRole('textbox', {name: /email/i})
  const username = screen.getByRole('textbox', {name: /username/i})
  expect(username).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument()
  userEvent.type(email, "myemail@mail.com")
  const submitButton = screen.getByRole('button', {name: /sign up/i})
  userEvent.click(submitButton)
  let alerts = screen.getAllByRole('alert')
  expect(alerts).toHaveLength(1)
  expect(screen.getByTestId('signUpUsernameErr')).toBeInTheDocument()
  expect(screen.getByText(/cannot be empty/i)).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /username/i})).toHaveStyle('border: 1px solid red')
  userEvent.type(username, "username")
  expect(screen.queryAllByRole('alert')).toHaveLength(0)
  expect(screen.queryByText(/cannot be empty/i)).not.toBeInTheDocument()
  expect(username).toHaveValue("username")
})

test("password fields - client-side validation", () => {
  renderSignUpComponentWithFakeContext()
  const submitButton = screen.getByRole('button', {name: /sign up/i})
  const email = screen.getByRole('textbox', {name: /email/i})
  const username = screen.getByRole('textbox', {name: /username/i})
  const surname = screen.getByRole('textbox', {name: /last name/i})
  const name = screen.getByRole('textbox', {name: /first name/i})
  const password = screen.getByRole('textbox', {name: /^password/i})
  const passwordConfirmation = screen.getByRole('textbox', {name: /confirm your password/i})
  expect(password).toBeInTheDocument()
  expect(passwordConfirmation).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/^password/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/confirm your password/i)).toBeInTheDocument()
  userEvent.type(email, "myemail@mail.com")
  userEvent.type(username, "username")
  userEvent.type(name, "Name")
  userEvent.type(surname, "Surname")
  userEvent.type(passwordConfirmation, "Confirmed")
  userEvent.click(submitButton)
  let alerts = screen.getAllByRole('alert')
  expect(alerts).toHaveLength(1)
  expect(screen.getByTestId('signUpPasswordErr')).toBeInTheDocument()
  expect(screen.getByText(/cannot be empty/i)).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /^password/i})).toHaveStyle('border: 1px solid red')
  expect(screen.getByRole('textbox', {name: /confirm your password/i})).toHaveStyle('border: 1px solid red')
  userEvent.type(password, "Password")
  expect(screen.queryAllByRole('alert')).toHaveLength(0)
  expect(screen.queryByText(/cannot be empty/i)).not.toBeInTheDocument()
  expect(password).toHaveValue("Password")
  expect(passwordConfirmation).toHaveValue("Confirmed")
  password.setSelectionRange(0, 8)
  userEvent.type(password, '{backspace}invalidpassword')
  expect(password).toHaveValue("invalidpassword")
  userEvent.click(submitButton)
  alerts = screen.getAllByRole('alert')
  expect(alerts).toHaveLength(1)
  expect(screen.getByTestId('signUpPasswordErr')).toBeInTheDocument()
  expect(screen.getByText(/Min\. 8 characters\. At least 1 uppercase letter\./i)).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /confirm your password/i})).toHaveStyle('border: 1px solid red')
  expect(screen.getByRole('textbox', {name: /^password/i})).toHaveStyle('border: 1px solid red')
  userEvent.type(password, "D")
  expect(screen.queryAllByRole('alert')).toHaveLength(0)
  expect(screen.queryByText(/Min\. 8 characters\. At least 1 uppercase letter\./i)).not.toBeInTheDocument()
  userEvent.click(submitButton)
  alerts = screen.getAllByRole('alert')
  expect(alerts).toHaveLength(1)
  expect(screen.getByTestId('signUpPasswordErr')).toBeInTheDocument()
  expect(screen.getByText(/Passwords dont't match/i)).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /^password/i})).toHaveStyle('border: 1px solid red')
  expect(screen.getByRole('textbox', {name: /confirm your password/i})).toHaveStyle('border: 1px solid red')
  userEvent.type(password, "D")
  expect(screen.queryAllByRole('alert')).toHaveLength(0)
  expect(screen.queryByText(/Passwords don't match/i)).not.toBeInTheDocument()
  userEvent.click(submitButton)
  alerts = screen.getAllByRole('alert')
  expect(alerts).toHaveLength(1)
  expect(screen.getByTestId('signUpPasswordErr')).toBeInTheDocument()
  expect(screen.getByText(/Passwords dont't match/i)).toBeInTheDocument()
  userEvent.type(passwordConfirmation, "D")
  expect(screen.queryAllByRole('alert')).toHaveLength(0)
  expect(screen.queryByText(/Passwords don't match/i)).not.toBeInTheDocument()
})

test("bio field - client-side validation", () => {
  renderSignUpComponentWithFakeContext()
  const bio = screen.getByRole('textbox', {name:/add bio/i})
  expect(bio).toBeInTheDocument()
  const validInput  = 'aaaaaaaaaaaaaaaaaaaa'
  userEvent.type(bio, validInput)
  expect(bio).toHaveValue('aaaaaaaaaaaaaaaaaaaa')
  expect(screen.getByText(/130\/150/i)).toBeInTheDocument()
  userEvent.type(bio, 'a'.repeat(130))
  expect(bio).toHaveValue("a".repeat(150))
  expect(screen.getByText(/0\/150/i)).toBeInTheDocument()
  userEvent.type(bio, 'aa')
  expect(bio.value).toHaveLength(150)
  expect(screen.getByText(/0\/150/i)).toBeInTheDocument()
  userEvent.type(bio, '{backspace}')
  expect(bio.value).toHaveLength(149)
  expect(screen.getByText(/1\/150/i)).toBeInTheDocument()
})

describe("all links work properly", () => {
  test("log in link works properly", () => {
    const history = createMemoryHistory();
    renderSignUpComponentWithNormalContext(history)
    const doYouHaveAccount = screen.getByText(/Already have an account?/)
    expect(doYouHaveAccount).toBeInTheDocument()
    const loginLink = screen.getByRole("link", {name: /Log in/i})
    expect(loginLink).toBeInTheDocument()
    expect(loginLink).toHaveAttribute("href", "/auth")
  })
  test("start page link works properly", () => {
    const history = createMemoryHistory();
    renderSignUpComponentWithNormalContext(history)
    const crossSign = screen.getByRole('link', {name: /go back to the homepage/i})
    expect(crossSign).toBeInTheDocument()
    expect(crossSign).toHaveAttribute("href", "/")
  })
})

test("email field - server-side validation", async () => {
  renderSignUpComponentWithFakeContext()
  const submitButton = screen.getByRole('button', {name: /sign up/i})
  const email = screen.getByRole('textbox', {name: /email/i})
  const username = screen.getByRole('textbox', {name: /username/i})
  const surname = screen.getByRole('textbox', {name: /last name/i})
  const name = screen.getByRole('textbox', {name: /first name/i})
  const password = screen.getByRole('textbox', {name: /^password/i})
  const passwordConfirmation = screen.getByRole('textbox', {name: /confirm your password/i})
  userEvent.type(email, 'takenemail@mail.com')
  userEvent.type(username, "username")
  userEvent.type(name, "Invalidname")
  userEvent.type(surname, "Surname")
  userEvent.type(passwordConfirmation, "Password")
  userEvent.type(password, "Password")
  userEvent.click(submitButton)
  expect(submitButton).toBeDisabled()
  let alerts = await screen.findAllByRole('alert')
  expect(submitButton).not.toBeDisabled()
  expect(alerts).toHaveLength(1)
  expect(screen.getByTestId('signUpEmailErr')).toBeInTheDocument()
  expect(screen.getByText(/already exists/i)).toBeInTheDocument()
  userEvent.type(surname, "g")
  expect(screen.queryAllByRole('alert')).toHaveLength(1)
  expect(screen.queryByText(/already exists/i)).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /email/i})).toHaveStyle('border: 1px solid red')
  email.setSelectionRange(0,19)
  userEvent.type(email, 'invalidemail@mail.com')
  userEvent.click(submitButton)
  alerts = await screen.findAllByRole('alert')
  expect(alerts).toHaveLength(1)
  expect(screen.getByTestId('signUpEmailErr')).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /email/i})).toHaveStyle('border: 1px solid red')
  expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
})

test("username field - server-side validation", async () => {
  renderSignUpComponentWithFakeContext()
  const submitButton = screen.getByRole('button', {name: /sign up/i})
  const email = screen.getByRole('textbox', {name: /email/i})
  const username = screen.getByRole('textbox', {name: /username/i})
  const surname = screen.getByRole('textbox', {name: /last name/i})
  const name = screen.getByRole('textbox', {name: /first name/i})
  const password = screen.getByRole('textbox', {name: /^password/i})
  const passwordConfirmation = screen.getByRole('textbox', {name: /confirm your password/i})
  userEvent.type(email, 'validemail@mail.com')
  userEvent.type(username, "AlreadyTaken")
  userEvent.type(name, "Invalidname")
  userEvent.type(surname, "Invalidsurname")
  userEvent.type(passwordConfirmation, "Password")
  userEvent.type(password, "Password")
  userEvent.click(submitButton)
  let alerts = await screen.findAllByRole('alert')
  expect(alerts).toHaveLength(1)
  expect(screen.getByTestId('signUpUsernameErr')).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /username/i})).toHaveStyle('border: 1px solid red')
  expect(screen.getByText(/already taken/i)).toBeInTheDocument()
  username.setSelectionRange(0,14)
  userEvent.type(username, 'InvalidUsername')
  userEvent.click(submitButton)
  alerts = await screen.findAllByRole('alert')
  expect(alerts).toHaveLength(1)
  expect(screen.getByTestId('signUpUsernameErr')).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /username/i})).toHaveStyle('border: 1px solid red')
  expect(screen.getByText(/invalid username/i)).toBeInTheDocument()
})

test("name field - server-side validation", async () => {
  renderSignUpComponentWithFakeContext()
  const submitButton = screen.getByRole('button', {name: /sign up/i})
  const email = screen.getByRole('textbox', {name: /email/i})
  const username = screen.getByRole('textbox', {name: /username/i})
  const surname = screen.getByRole('textbox', {name: /last name/i})
  const name = screen.getByRole('textbox', {name: /first name/i})
  const password = screen.getByRole('textbox', {name: /^password/i})
  const passwordConfirmation = screen.getByRole('textbox', {name: /confirm your password/i})
  userEvent.type(email, 'validemail@mail.com')
  userEvent.type(username, "username")
  userEvent.type(name, "Invalidname")
  userEvent.type(surname, "Invalidsurname")
  userEvent.type(passwordConfirmation, "Password")
  userEvent.type(password, "Password")
  userEvent.click(submitButton)
  let alerts = await screen.findAllByRole('alert')
  expect(alerts).toHaveLength(1)
  expect(screen.getByTestId('signUpNameErr')).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /first name/i})).toHaveStyle('border: 1px solid red')
  expect(screen.getByText(/invalid name/i)).toBeInTheDocument()
})

test("surname field - server-side validation", async () => {
  renderSignUpComponentWithFakeContext()
  const submitButton = screen.getByRole('button', {name: /sign up/i})
  const email = screen.getByRole('textbox', {name: /email/i})
  const username = screen.getByRole('textbox', {name: /username/i})
  const surname = screen.getByRole('textbox', {name: /last name/i})
  const name = screen.getByRole('textbox', {name: /first name/i})
  const password = screen.getByRole('textbox', {name: /^password/i})
  const passwordConfirmation = screen.getByRole('textbox', {name: /confirm your password/i})
  userEvent.type(email, 'validemail@mail.com')
  userEvent.type(username, "username")
  userEvent.type(name, "Validname")
  userEvent.type(surname, "Invalidsurname")
  userEvent.type(passwordConfirmation, "Password")
  userEvent.type(password, "Password")
  userEvent.click(submitButton)
  let alerts = await screen.findAllByRole('alert')
  expect(alerts).toHaveLength(1)
  expect(screen.getByTestId('signUpSurnameErr')).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /last name/i})).toHaveStyle('border: 1px solid red')
  expect(screen.getByText(/invalid surname/i)).toBeInTheDocument()
})

test("password field - server-side validation", async () => {
  renderSignUpComponentWithFakeContext()
  const submitButton = screen.getByRole('button', {name: /sign up/i})
  const email = screen.getByRole('textbox', {name: /email/i})
  const username = screen.getByRole('textbox', {name: /username/i})
  const surname = screen.getByRole('textbox', {name: /last name/i})
  const name = screen.getByRole('textbox', {name: /first name/i})
  const password = screen.getByRole('textbox', {name: /^password/i})
  const passwordConfirmation = screen.getByRole('textbox', {name: /confirm your password/i})
  const bio = screen.getByPlaceholderText(/You can tell a little about yourself if you want/i)
  userEvent.type(email, 'validemail@mail.com')
  userEvent.type(username, "username")
  userEvent.type(name, "Validname")
  userEvent.type(surname, "Validsurname")
  userEvent.type(passwordConfirmation, "InvalidPassword")
  userEvent.type(password, "InvalidPassword")
  userEvent.type(bio, "Invalidbio")
  userEvent.click(submitButton)
  let alerts = await screen.findAllByRole('alert')
  expect(alerts).toHaveLength(1)
  expect(screen.getByTestId('signUpPasswordErr')).toBeInTheDocument()
  expect(screen.getByText(/Min. 8 characters. At least 1 uppercase letter./i)).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /^password/i})).toHaveStyle('border: 1px solid red')
  expect(screen.getByRole('textbox', {name: /confirm your password/i})).toHaveStyle('border: 1px solid red')
})

test("bio field - server-side validation", async () => {
  renderSignUpComponentWithFakeContext()
  const submitButton = screen.getByRole('button', {name: /sign up/i})
  const email = screen.getByRole('textbox', {name: /email/i})
  const username = screen.getByRole('textbox', {name: /username/i})
  const surname = screen.getByRole('textbox', {name: /last name/i})
  const name = screen.getByRole('textbox', {name: /first name/i})
  const password = screen.getByRole('textbox', {name: /^password/i})
  const passwordConfirmation = screen.getByRole('textbox', {name: /confirm your password/i})
  const bio = screen.getByPlaceholderText(/You can tell a little about yourself if you want/i)
  userEvent.type(email, 'validemail@mail.com')
  userEvent.type(username, "username")
  userEvent.type(name, "Validname")
  userEvent.type(surname, "Validsurname")
  userEvent.type(passwordConfirmation, "ValidPassword")
  userEvent.type(password, "ValidPassword")
  userEvent.type(bio, "Invalidbio")
  userEvent.click(submitButton)
  let alerts = await screen.findAllByRole('alert')
  expect(alerts).toHaveLength(1)
  expect(screen.getByTestId('signUpBioErr')).toBeInTheDocument()
  expect(screen.getByText(/invalid bio/i)).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /add bio/i})).toHaveStyle('border: 1px solid red')
  userEvent.type(bio, "D")
  alerts = screen.queryAllByRole('alert')
  expect(alerts).toHaveLength(0)
  expect(screen.queryByText(/invalid bio/i)).not.toBeInTheDocument()
})

test("no response on the server side", async () => {
  const history = createMemoryHistory()
  renderSignUpComponentWithNormalContext(history)
  const submitButton = screen.getByRole('button', {name: /sign up/i})
  const email = screen.getByRole('textbox', {name: /email/i})
  const username = screen.getByRole('textbox', {name: /username/i})
  const surname = screen.getByRole('textbox', {name: /last name/i})
  const name = screen.getByRole('textbox', {name: /first name/i})
  const password = screen.getByRole('textbox', {name: /^password/i})
  const passwordConfirmation = screen.getByRole('textbox', {name: /confirm your password/i})
  const bio = screen.getByPlaceholderText(/You can tell a little about yourself if you want/i)
  userEvent.type(email, 'servererror@mail.com')
  userEvent.type(username, "username")
  userEvent.type(name, "Validname")
  userEvent.type(surname, "Validsurname")
  userEvent.type(passwordConfirmation, "ValidPassword")
  userEvent.type(password, "ValidPassword")
  userEvent.type(bio, "Validbio")
  userEvent.click(submitButton)
  await waitFor(() => expect(screen.queryByRole('button', {name: /sign up/i})).not.toBeInTheDocument())
  await waitFor(() => expect(screen.queryByRole('textbox', {name: /email/i})).not.toBeInTheDocument())
  await waitFor(() => expect(screen.queryByRole('textbox', {name: /username/i})).not.toBeInTheDocument())
  await waitFor(() => expect(screen.queryByRole('textbox', {name: /last name/i})).not.toBeInTheDocument())
  await waitFor(() => expect(screen.queryByRole('textbox', {name: /first name/i})).not.toBeInTheDocument())
  await waitFor(() => expect(screen.queryByRole('textbox', {name: /^password/i})).not.toBeInTheDocument())
  await waitFor(() => expect(screen.queryByRole('textbox', {name: /confirm your password/i})).not.toBeInTheDocument())
  await waitFor(() => expect(screen.queryByPlaceholderText(/You can tell a little about yourself if you want/i)).not.toBeInTheDocument())
  await waitFor(() => expect(screen.queryByRole('link', {name: /go back to the homepage/i})).not.toBeInTheDocument())
  expect(screen.getByText(/unexpected problem with the server occured/i)).toBeInTheDocument()
  // the url is changed and the error disappears
  history.push('/')
  history.push('/auth/signup')
  expect(screen.queryByText(/unexpected problem with the server occured/i)).not.toBeInTheDocument()
  expect(screen.queryByRole('button', {name: /sign up/i})).toBeInTheDocument()
  expect(screen.queryByRole('textbox', {name: /email/i})).toBeInTheDocument()
  expect(screen.queryByRole('textbox', {name: /username/i})).toBeInTheDocument()
  expect(screen.queryByRole('textbox', {name: /last name/i})).toBeInTheDocument()
  expect(screen.queryByRole('textbox', {name: /first name/i})).toBeInTheDocument()
  expect(screen.queryByRole('textbox', {name: /^password/i})).toBeInTheDocument()
  expect(screen.queryByRole('textbox', {name: /confirm your password/i})).toBeInTheDocument()
  expect(screen.queryByPlaceholderText(/You can tell a little about yourself if you want/i)).toBeInTheDocument()
  expect(screen.queryByRole('link', {name: /go back to the homepage/i})).toBeInTheDocument()
})

test("unexpected response on the server side - in this case 404", async () => {
  const history = createMemoryHistory()
  renderSignUpComponentWithNormalContext(history)
  const submitButton = screen.getByRole('button', {name: /sign up/i})
  const email = screen.getByRole('textbox', {name: /email/i})
  const username = screen.getByRole('textbox', {name: /username/i})
  const surname = screen.getByRole('textbox', {name: /last name/i})
  const name = screen.getByRole('textbox', {name: /first name/i})
  const password = screen.getByRole('textbox', {name: /^password/i})
  const passwordConfirmation = screen.getByRole('textbox', {name: /confirm your password/i})
  const bio = screen.getByPlaceholderText(/You can tell a little about yourself if you want/i)
  userEvent.type(email, 'fourohfour@mail.com')
  userEvent.type(username, "username")
  userEvent.type(name, "Validname")
  userEvent.type(surname, "Validsurname")
  userEvent.type(passwordConfirmation, "ValidPassword")
  userEvent.type(password, "ValidPassword")
  userEvent.type(bio, "Validbio")
  userEvent.click(submitButton)
  await waitFor(() => expect(screen.queryByRole('button', {name: /sign up/i})).not.toBeInTheDocument())
  await waitFor(() => expect(screen.queryByRole('textbox', {name: /email/i})).not.toBeInTheDocument())
  await waitFor(() => expect(screen.queryByRole('textbox', {name: /username/i})).not.toBeInTheDocument())
  await waitFor(() => expect(screen.queryByRole('textbox', {name: /last name/i})).not.toBeInTheDocument())
  await waitFor(() => expect(screen.queryByRole('textbox', {name: /first name/i})).not.toBeInTheDocument())
  await waitFor(() => expect(screen.queryByRole('textbox', {name: /^password/i})).not.toBeInTheDocument())
  await waitFor(() => expect(screen.queryByRole('textbox', {name: /confirm your password/i})).not.toBeInTheDocument())
  await waitFor(() => expect(screen.queryByPlaceholderText(/You can tell a little about yourself if you want/i)).not.toBeInTheDocument())
  await waitFor(() => expect(screen.queryByRole('link', {name: /go back to the homepage/i})).not.toBeInTheDocument())
  expect(screen.getByText(/unexpected problem with the server occured/i)).toBeInTheDocument()
  // the url is changed and the error disappears
  history.push('/')
  history.push('/auth/signup')
  expect(screen.queryByText(/unexpected problem with the server occured/i)).not.toBeInTheDocument()
  expect(screen.queryByRole('button', {name: /sign up/i})).toBeInTheDocument()
  expect(screen.queryByRole('textbox', {name: /email/i})).toBeInTheDocument()
  expect(screen.queryByRole('textbox', {name: /username/i})).toBeInTheDocument()
  expect(screen.queryByRole('textbox', {name: /last name/i})).toBeInTheDocument()
  expect(screen.queryByRole('textbox', {name: /first name/i})).toBeInTheDocument()
  expect(screen.queryByRole('textbox', {name: /^password/i})).toBeInTheDocument()
  expect(screen.queryByRole('textbox', {name: /confirm your password/i})).toBeInTheDocument()
  expect(screen.queryByPlaceholderText(/You can tell a little about yourself if you want/i)).toBeInTheDocument()
  expect(screen.queryByRole('link', {name: /go back to the homepage/i})).toBeInTheDocument()
})

test("201 response - account created", async () => {
  const history = createMemoryHistory()
  renderSignUpComponentWithNormalContext(history)
  const submitButton = screen.getByRole('button', {name: /sign up/i})
  const email = screen.getByRole('textbox', {name: /email/i})
  const username = screen.getByRole('textbox', {name: /username/i})
  const surname = screen.getByRole('textbox', {name: /last name/i})
  const name = screen.getByRole('textbox', {name: /first name/i})
  const password = screen.getByRole('textbox', {name: /^password/i})
  const passwordConfirmation = screen.getByRole('textbox', {name: /confirm your password/i})
  const bio = screen.getByLabelText(/add bio/i)
  userEvent.type(email, 'validmail@mail.com')
  userEvent.type(username, "username")
  userEvent.type(name, "Validname")
  userEvent.type(surname, "Validsurname")
  userEvent.type(passwordConfirmation, "ValidPassword")
  userEvent.type(password, "ValidPassword")
  userEvent.type(bio, "Validbio")
  userEvent.click(submitButton)
  await waitFor(() => expect(history.location.pathname).toBe('/auth/signup/success'))
})

// test("password fields' values disappear when the user changes location", async () => {
//   // it happens automatically because sign up page is another react component, but I want to make sure
//   // it happens at all times
//   const history = createMemoryHistory()
//   renderSignUpComponentWithNormalContext(history)
//   const password = screen.getByRole('textbox', {name: /^password/i})
//   const passwordConfirmation = screen.getByRole('textbox', {name: /confirm your password/i})
//   const crossSign = screen.getByRole("link", {name: /to the homepage/i})
//   userEvent.type(passwordConfirmation, "ValidPassword")
//   userEvent.type(password, "ValidPassword")
//   userEvent.click(crossSign)
//   const signUp = await screen.findByText(/^sign up$/i)
//   userEvent.click(signUp)
//   expect(screen.getByRole('textbox', {name: /^password/i})).toHaveValue('')
//   expect(screen.getByRole('textbox', {name: /confirm your password/i})).toHaveValue('')
// })


test("sign up form is rendered correctly", () => {
  const history = createMemoryHistory()
  history.push('/auth/signup')
  const page = renderer
    .create(    
      <Router history={history}>
      <AuthProvider>
        <App/>
      </AuthProvider>
      </Router>)
    .toJSON();
  expect(page).toMatchSnapshot();
})

test("sign up success is rendered correctly", () => {
  const history = createMemoryHistory()
  history.push('/auth/signup/success')
  const page = renderer
    .create(    
      <Router history={history}>
      <AuthProvider>
        <App/>
      </AuthProvider>
      </Router>)
    .toJSON();
  expect(page).toMatchSnapshot();
})
