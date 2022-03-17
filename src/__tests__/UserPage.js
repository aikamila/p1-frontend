import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { Router } from 'react-router-dom'
import {createMemoryHistory} from 'history'
import AuthContext from '../context/AuthContext'
import HomePage from '../pages/HomePage'
import { server } from '../mocks/server'
import { rest } from 'msw'
import UserInfo from '../components/UserInfo'
import Bio from '../components/Bio'

const renderUserPage = (location, userId) => {
    const history = createMemoryHistory()
    history.push(location)
    const authTokens = {
        access: "valid-access",
        refresh: "valid-refresh"
    }
    return render(
    <Router history={history}>
        <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
            userId: userId, updateToken: null}}>
                <HomePage />
        </AuthContext.Provider>
    </Router>)
}

const renderUserInfo = (location, userId) => {
    const history = createMemoryHistory()
    history.push(location)
    return render(
    <Router history={history}>
        <AuthContext.Provider value={{
            userId: userId}}>
                <UserInfo  
                id ={7}
                username={"user7"}
                name={"Userseven"}
                surname={"Sevenseven"}
                bio={"Hi everyone"}
                email={"user7@mail.com"}
                />
        </AuthContext.Provider>
    </Router>)
}

const renderBio = (userId, bio) => {
    return render(
        <AuthContext.Provider value={{
            userId: userId}}>
                <Bio
                id = {13}
                bio = {bio}
                >
                </Bio>
            </AuthContext.Provider>
    )
}

test("given user doesn't exist", async () => {
    renderUserPage('/home/account/3', 7)
    expect(screen.getByRole("img", {name: /loading data about the user/i})).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole("img", {name: /loading data about the user/i})).not.toBeInTheDocument())
    expect(screen.getByText(/this user doesn't exist/i)).toBeInTheDocument()
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.queryByRole("img", {name: /loading posts/i})).not.toBeInTheDocument()
}) 

test("server errors occurs while fetching info about the user", async () => {
    server.use(
        rest.get('https://arcane-spire-03245.herokuapp.com/api/user/1/', (req, res, ctx) => {
            return res.once(
                ctx.status(401)
                )
        })
    )
    renderUserPage('/home/account/1', 2)
    expect(screen.getByRole("img", {name: /loading data about the user/i})).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole("img", {name: /loading data about the user/i})).not.toBeInTheDocument())
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    expect(await screen.findByRole("alert")).toBeInTheDocument()
    expect(screen.queryByRole("img", {name: /loading posts/i})).not.toBeInTheDocument()
    expect(screen.queryByText(/t able to load the posts/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/this user doesn't have any posts yet/)).not.toBeInTheDocument()
})

test("user data is already loaded and posts of the user are being loaded", async () => {
    renderUserPage('/home/account/1', 1)
    expect(screen.getByRole("img", {name: /loading data about the user/i})).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole("img", {name: /loading data about the user/i})).not.toBeInTheDocument())
    expect(screen.getByText(/user1/i)).toBeInTheDocument()
    expect(screen.getByText(/User/)).toBeInTheDocument()
    expect(screen.getByText(/First/)).toBeInTheDocument()
    expect(screen.queryByRole("img", {name: /loading posts/i})).toBeInTheDocument()
    expect(await screen.findByText(/comments/i)).toBeInTheDocument()
})

test("error while fetching posts", async () => {
    server.use(
        rest.get('https://arcane-spire-03245.herokuapp.com/api/services/posts/', (req, res, ctx) => {
            return res.once(
                ctx.status(500)
                )
        })
    )
    renderUserPage('/home/account/1', 1)
    await waitFor(() => expect(screen.queryByRole("img", {name: /loading data about the user/i})).not.toBeInTheDocument())
    expect(screen.queryByRole("img", {name: /loading posts/i})).toBeInTheDocument()
    expect(await screen.findByRole("alert")).toBeInTheDocument()
    expect(screen.getByText(/t able to load the posts/i)).toBeInTheDocument()
    expect(screen.queryByRole("img", {name: /loading posts/i})).not.toBeInTheDocument()
})

test("posts fetched successfully", async () => {
    renderUserPage('/home/account/1', 1)
    await waitFor(() => expect(screen.queryByRole("img", {name: /loading data about the user/i})).not.toBeInTheDocument())
    expect(screen.queryByRole("img", {name: /loading posts/i})).toBeInTheDocument()
    expect(await screen.findByText(/s anyone interested in helping me with a django app/i)).toBeInTheDocument()
    expect(screen.queryByText(/Is anyone creating a Java app? I'm willing to help out/i)).not.toBeInTheDocument()
    expect(screen.getByRole("region", {name: /latest posts of user1/i}))
    expect(screen.getByRole("region", {name: /information about user1/i}))
    expect(screen.queryByRole("img", {name: /loading posts/i})).not.toBeInTheDocument()
})

test("no posts - in case of a user viewing their own site", async () => {
    renderUserPage('/home/account/2', 2)
    await waitFor(() => expect(screen.queryByRole("img", {name: /loading data about the user/i})).not.toBeInTheDocument())
    expect(screen.queryByRole("img", {name: /loading posts/i})).toBeInTheDocument()
    expect(await screen.findByText(/You don't have any posts yet/i)).toBeInTheDocument()
    expect(screen.queryByRole("img", {name: /loading posts/i})).not.toBeInTheDocument()
})

test("no posts - in case of a user viewing somebody else's site", async () => {
    renderUserPage('/home/account/2', 7)
    await waitFor(() => expect(screen.queryByRole("img", {name: /loading data about the user/i})).not.toBeInTheDocument())
    expect(screen.queryByRole("img", {name: /loading posts/i})).toBeInTheDocument()
    expect(await screen.findByText(/this user doesn't have any posts yet/i)).toBeInTheDocument()
    expect(screen.queryByRole("img", {name: /loading posts/i})).not.toBeInTheDocument()
})

test("user info - 1 - user visiting visiting their own site", () => {
    renderUserInfo('/home/account/7', 7)
    expect(screen.getByText(/user7/)).toBeInTheDocument()
    expect(screen.getByText(/Userseven/)).toBeInTheDocument()
    expect(screen.getByText(/Sevenseven/)).toBeInTheDocument()
    expect(screen.getByText(/Hi everyone/)).toBeInTheDocument()
    expect(screen.queryByRole("link", /contact via email/i)).not.toBeInTheDocument()  
})

test("user info - 2 - user visiting someone else's site", () => {
    renderUserInfo('/home/account/7', 6)
    expect(screen.getByText(/user7/)).toBeInTheDocument()
    expect(screen.getByText(/Userseven/)).toBeInTheDocument()
    expect(screen.getByText(/Sevenseven/)).toBeInTheDocument()
    expect(screen.getByText(/Hi everyone/)).toBeInTheDocument()
    expect(screen.queryByRole("link", /contact via email/i)).toBeInTheDocument()
    expect(screen.queryByRole("link", /contact via email/i)).toHaveAttribute("href", `mailto:user7@mail.com?subject=${encodeURIComponent("Inquiry")}`)
})

test("bio - exists", () => {
    renderBio(13, "What's up")
    expect(screen.getByText("What's up")).toBeInTheDocument()
})

test("bio - doesn't exist + user seeing someone else's bio", () => {
    renderBio(13, "")
    expect(screen.getByText(/you haven't shared anything about yourself yet/i)).toBeInTheDocument()
})

test("bio - doesnt't exist + user seeing their own bio", () => {
    renderBio(12, "")
    expect(screen.getByText(/this user hasn't shared anything about them yet/i)).toBeInTheDocument()
})