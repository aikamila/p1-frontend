import { render, screen } from '@testing-library/react'
import react from 'react'
import HomeHeader from '../components/HomeHeader'
import AuthContext from '../context/AuthContext'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

const renderHomeHeader = (disabled) => {
    const history = createMemoryHistory()
    return render(
        <Router history={history}>
            <AuthContext.Provider value={{logout: jest.fn(), userId: 12}}>
                <HomeHeader disabled={disabled}>
                </HomeHeader>
            </AuthContext.Provider>
        </Router>
    )
}


test("all elements of the header are fully accessible", () => {
    renderHomeHeader();
    const logoutButton = screen.getByRole("button", {name: /log out/i})
    expect(logoutButton).toBeInTheDocument()
    expect(logoutButton).not.toBeDisabled()
    const linkAdd = screen.getByRole("link", {name: /add a post/i})
    const linkAccount = screen.getByRole("link", {name: /my account/})
    const linkHomepage = screen.getByRole("link", {name: /homepage/i})
    expect(linkAdd).toBeInTheDocument()
    expect(linkAdd).toHaveAttribute('href', '/home/post/add')
    expect(linkAdd).toHaveStyle('pointerEvents: auto')
    expect(linkAccount).toBeInTheDocument()
    expect(linkAccount).toHaveAttribute('href', '/home/account/12')
    expect(linkAccount).toHaveStyle('pointerEvents: auto')
    expect(linkHomepage).toBeInTheDocument()
    expect(linkHomepage).toHaveStyle('pointerEvents: auto')
    expect(linkHomepage).toHaveAttribute('href', '/home')
    expect(screen.getByTitle(/my account/i)).toBeInTheDocument()
    expect(screen.getByTitle(/add a post/i)).toBeInTheDocument()
    expect(screen.getByTitle(/homepage/i)).toBeInTheDocument()
    expect(screen.getByRole("img", {name:/shangify brand logo/i})).toBeInTheDocument()
})

test("all controls are disabled", () => {
    renderHomeHeader(true);
    const logoutButton = screen.getByRole("button", {name: /log out/i})
    expect(logoutButton).toBeDisabled()
    const linkAdd = screen.getByRole("link", {name: /add a post/i})
    const linkAccount = screen.getByRole("link", {name: /my account/})
    const linkHomepage = screen.getByRole("link", {name: /homepage/i})
    expect(linkAdd).toHaveStyle('pointerEvents: none')
    expect(linkAccount).toHaveStyle('pointerEvents: none')
    expect(linkHomepage).toHaveStyle('pointerEvents: none')
})
