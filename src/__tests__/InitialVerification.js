import { render, screen, waitFor } from '@testing-library/react'
import App from '../App'
import { AuthProvider } from '../context/AuthContext'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import * as storageUtils from '../utils/LocalStorage'
import userEvent from '@testing-library/user-event'

jest.setTimeout(9000)

afterEach(() => {
    localStorage.removeItem("authTokens")
})

const renderInitVerificationPage = (history) => {
    return render(
        <Router history={history}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Router>
    )
}

test("all elements are present on the page", async () => {
    const history = createMemoryHistory()
    history.push("/verification/id/valid")
    renderInitVerificationPage(history)
    expect(screen.getByRole("img", {name: /loading/i})).toBeInTheDocument()
    expect(screen.getByTitle(/loading/i)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole("img", {name: /loading/i})).not.toBeInTheDocument(), {timeout: 5000})
    expect(screen.getByRole("button", {name: /verify my email/i}) ).toBeInTheDocument()
    expect(screen.getByText(/Click on the button below/i)).toBeInTheDocument()
})

test("previous user logged in + verification token invalid", async () => {
    // a situation when there is a user logged in and another one tries to verify their email
    const history = createMemoryHistory()
    history.push("/verification/id/invalid") 
    // logging in the previous user 
    storageUtils.setItemwith8MonthExpiry("authTokens", {access: "previous-access", refresh: "previous-refresh"})
    renderInitVerificationPage(history)
    await waitFor(() => expect(screen.getByRole("button", {name: /verify my email/i})).toBeInTheDocument(), {timeout: 5000})
    userEvent.click(screen.getByRole("button", {name: /verify my email/i}))
    expect(screen.getByRole("button", {name: /verify my email/i})).toBeDisabled()
    await waitFor(() => expect(history.location.pathname).toBe('/verification/unsuccessful'))
    // checking if both verification pages display errors
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByText(/The link is invalid. If you have already used it, just log into your account/i)).toBeInTheDocument()
    // if the new user got logged in, the token would be "valid-access"
    expect(localStorage.getItem("authTokens")).toContain("new-access")
    history.push("/verification/id/invalid")
    expect(screen.queryByTitle(/loading.../i)).not.toBeInTheDocument()
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByText(/The link is invalid. If you have already used it, just log into your account/i)).toBeInTheDocument()
    history.push("/verification/id/valid")
    expect(screen.queryByTitle(/loading.../i)).not.toBeInTheDocument()
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByText(/The link is invalid. If you have already used it, just log into your account/i)).toBeInTheDocument()
    history.push("/verification/unsuccessful")
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByText(/The link is invalid. If you have already used it, just log into your account/i)).toBeInTheDocument()
    // checking if the previous user is still logged in 
    expect(localStorage.getItem("authTokens")).toContain("new-access")
})

test("previous user logged in + server error while email verification", async () => {
    // a situation when there is a user logged in and another one tries to verify their email
    const history = createMemoryHistory()
    history.push("/verification/id/servererror") 
    // logging in the previous user 
    storageUtils.setItemwith8MonthExpiry("authTokens", {access: "previous-access", refresh: "previous-refresh"})
    renderInitVerificationPage(history)
    await waitFor(() => expect(screen.getByRole("button", {name: /verify my email/i})).toBeInTheDocument(), {timeout: 5000})
    userEvent.click(screen.getByRole("button", {name: /verify my email/i}))
    expect(screen.getByRole("button", {name: /verify my email/i})).toBeDisabled()
    await waitFor(() => expect(history.location.pathname).toBe('/verification/unsuccessful'))
    // checking if both verification pages display errors
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByText(/Something went wrong. Please use the link once again/i)).toBeInTheDocument()
    // if the new user got logged in, the token would be "valid-access"
    expect(localStorage.getItem("authTokens")).toContain("new-access") 
    history.push("/verification/id/servererror")
    expect(screen.queryByTitle(/loading.../i)).not.toBeInTheDocument()
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByText(/Something went wrong. Please use the link once again/i)).toBeInTheDocument()
    history.push("/verification/id/valid")
    expect(screen.queryByTitle(/loading.../i)).not.toBeInTheDocument()
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByText(/Something went wrong. Please use the link once again/i)).toBeInTheDocument()
    history.push("/verification/unsuccessful")
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByText(/Something went wrong. Please use the link once again/i)).toBeInTheDocument()
    // checking if the previous user is still logged in 
    expect(localStorage.getItem("authTokens")).toContain("new-access")
})

test("previous user not logged in + server error (invalid response status) while verifying the email", async () => {
    // a situation when there is no user logged in and somebody wants to verify their email
    const history = createMemoryHistory()
    history.push("/verification/id/404") 
    renderInitVerificationPage(history)
    await waitFor(() => expect(screen.getByRole("button", {name: /verify my email/i})).toBeInTheDocument(), {timeout: 5000})
    userEvent.click(screen.getByRole("button", {name: /verify my email/i}))
    expect(screen.getByRole("button", {name: /verify my email/i})).toBeDisabled()
    await waitFor(() => expect(history.location.pathname).toBe('/verification/unsuccessful'))
    // checking if both verification pages display errors
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByText(/Something went wrong. Please use the link once again/i)).toBeInTheDocument()
    history.push("/verification/id/404")
    expect(screen.queryByTitle(/loading.../i)).not.toBeInTheDocument()
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByText(/Something went wrong. Please use the link once again/i)).toBeInTheDocument()
    history.push("/verification/id/valid")
    expect(screen.queryByTitle(/loading.../i)).not.toBeInTheDocument()
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByText(/Something went wrong. Please use the link once again/i)).toBeInTheDocument()
    history.push("/verification/unsuccessful")
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByText(/Something went wrong. Please use the link once again/i)).toBeInTheDocument()
    // checking if no one is logged in all the time
    expect(localStorage.getItem("authTokens")).toBeNull()
    history.push("/home")
    expect(history.location.pathname).toBe("/auth")
})

test("previous user logged in + new user verifies their email successfully", async () => {
    // a situation when the previous user is logged in but somebody else verifies their email
    const history = createMemoryHistory()
    history.push("/verification/id/valid") 
    // logging in the previous user 
    storageUtils.setItemwith8MonthExpiry("authTokens", {access: "previous-access", refresh: "previous-refresh"})
    renderInitVerificationPage(history)
    // the previous user is logged in
    await waitFor(() => expect(localStorage.getItem("authTokens")).toContain("new-access"))
    const setItemWith8MonthExpiryMock = jest.spyOn(storageUtils, "setItemwith8MonthExpiry")
    await waitFor(() => expect(screen.getByRole("button", {name: /verify my email/i})).toBeInTheDocument(), {timeout: 5000})
    userEvent.click(screen.getByRole("button", {name: /verify my email/i}))
    expect(screen.getByRole("button", {name: /verify my email/i})).toBeDisabled()
    // logging out the previous user
    await waitFor(() => expect(localStorage.getItem("authTokens")).toBeNull())
    // new user got logged in, the token is now valid-access and the user has access to the home page
    expect(history.location.pathname).toBe("/home")
    expect(localStorage.getItem("authTokens")).toContain("valid-access")
    // checking if the tokens are set for the next 8 month
    expect(setItemWith8MonthExpiryMock).toHaveBeenCalledTimes(1)
    setItemWith8MonthExpiryMock.mockRestore()
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByText(/your email was successfully verified/i)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(/your email was successfully verified/i)).not.toBeInTheDocument(), {timeout:5010})  
})

test("no previous user logged in + new user verifies their email successfully", async () => {
    // a typical situation when no one is logged in and a new user verifies their email
    const history = createMemoryHistory()
    history.push("/verification/id/valid") 
    renderInitVerificationPage(history)
    expect(localStorage.getItem("authTokens")).toBeNull()
    const setItemWith8MonthExpiryMock = jest.spyOn(storageUtils, "setItemwith8MonthExpiry")
    await waitFor(() => expect(screen.getByRole("button", {name: /verify my email/i})).toBeInTheDocument(), {timeout: 5000})
    userEvent.click(screen.getByRole("button", {name: /verify my email/i}))
    // new user got logged in, the token is now valid-access and the user has the access to the home page
    await waitFor(() => expect(history.location.pathname).toBe("/home"))
    expect(localStorage.getItem("authTokens")).toContain("valid-access")
    // checking if the tokens are set for the next 8 month
    expect(setItemWith8MonthExpiryMock).toHaveBeenCalledTimes(1)
    setItemWith8MonthExpiryMock.mockRestore()
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByText(/your email was successfully verified/i)).toBeInTheDocument()
    waitFor(() => expect(screen.queryByText(/your email was successfully verified/i)).not.toBeInTheDocument(), {timeout:5010})
})