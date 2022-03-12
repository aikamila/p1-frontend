import {render, screen, waitFor} from '@testing-library/react'
import App from '../App'
import { AuthProvider } from '../context/AuthContext'
import {Router} from 'react-router-dom'
import {createMemoryHistory} from 'history'
import * as storageUtils from '../utils/LocalStorage'
import userEvent from '@testing-library/user-event'
import renderer from 'react-test-renderer'

// this test doesn't seem to work with other tests - probably a problem with isolation
// jest isolates tests in different modules, but not in one module

const renderInitVerificationPage = (history) => {
    return render(
        <Router history={history}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Router>
    )
}

afterEach(() => {
    localStorage.removeItem("authTokens")
    // this must be done !!!
})

test("previous user not logged in + new user logs in successfully", async () => {
     // a typical situation when no one is logged in and a new user verifies their email
     const history = createMemoryHistory()
     history.push("/verification/id/valid") 
     renderInitVerificationPage(history)
     await waitFor(() => expect(localStorage.getItem("authTokens")).toBeNull())
     const setItemWith8MonthExpiryMock = jest.spyOn(storageUtils, "setItemwith8MonthExpiry")
     await waitFor(() => expect(screen.getByRole("button", {name: /verify my email/i})).toBeInTheDocument(), {timeout: 5000})
     userEvent.click(screen.getByRole("button", {name: /verify my email/i}))
     // new user got logged in, the token is now valid-access and the user has the access to the home page
     await waitFor(() => expect(history.location.pathname).toBe("/home"))
     await waitFor(() => expect(localStorage.getItem("authTokens")).toContain("valid-access"))
     // checking if the tokens are set for the next 8 month
     expect(setItemWith8MonthExpiryMock).toHaveBeenCalledTimes(1)
     setItemWith8MonthExpiryMock.mockRestore()
     expect(screen.getByRole("alert")).toBeInTheDocument()
     expect(screen.getByText(/your email was successfully verified/i)).toBeInTheDocument()
     waitFor(() => expect(screen.queryByText(/your email was successfully verified/i)).not.toBeInTheDocument(), {timeout:5010})
})