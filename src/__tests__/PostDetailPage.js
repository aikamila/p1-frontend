import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import userEvent from '@testing-library/user-event'
import AuthContext from '../context/AuthContext'
import HomePage from '../pages/HomePage'
import { server } from '../mocks/server'
import { rest } from 'msw'


const renderPostDetailPage = (history, userId) => {
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

const mock_api_data = {
    "user": {
        "username": "user1",
        "id": 1
    },
    "text": "Is anyone interested in helping me with a django app? I have some problems with creating an API. Filtering doesn't work for some reason. I would also love to talk to somebody experienced and would be glad if somebody could assess my work. I would love to be a better software developer",
    "time_since_posted": "3 hours ago",
    "comments": [
        {
            "id": 5,
            "user": {
                "username": "user8",
                "id": 8
            },
            "text": "Why not! There are many reasons why this bug might happen",
            "time_since_posted": "30 minutes ago",
            "replies": [
                {
                    "id": 6,
                    "user": {
                        "username": "user9",
                        "id": 9
                    },
                    "text": "For instance?",
                    "time_since_posted": "10 minutes ago"
                },
                {
                "id": 20,
                "user": {
                    "username": "user7",
                    "id": 7
                },
                "text": "Look at the docs ;) There are so many examples there.",
                "time_since_posted": "1 minute ago"
            }]
        }
    ]}

test("post is displayed to the author in a proper way", async () => {
    const history = createMemoryHistory()
    history.push('/home/post/1')
    renderPostDetailPage(history, 1)
    expect(screen.queryByRole("img", {name: /loading/i})).toBeInTheDocument()
    expect(await screen.findByRole("link", {name: "user1"})).toBeInTheDocument()
    expect(screen.getByRole("link", {name: "user1"})).toHaveAttribute("href", "/home/account/1")
    expect(screen.getByRole("link", {name: "user2"})).toBeInTheDocument()
    expect(screen.getByRole("link", {name: "user2"})).toHaveAttribute("href", "/home/account/2")
    expect(screen.getByRole("link", {name: "user8"})).toHaveAttribute("href", "/home/account/8")
    expect(screen.getByRole("link", {name: "user8"})).toBeInTheDocument()
    expect(screen.getByRole("link", {name: "user9"})).toHaveAttribute("href", "/home/account/9")
    expect(screen.getByRole("link", {name: "user9"})).toBeInTheDocument()
    expect(screen.getByRole("link", {name: "user7"})).toHaveAttribute("href", "/home/account/7")
    expect(screen.getByRole("link", {name: "user7"})).toBeInTheDocument()
    expect(screen.getAllByRole("article")).toHaveLength(5)
    expect(screen.getByRole("region", {name: /Comments on the post: Is anyone interested in helping me with a django app\? I have some problems with creating an API. Filtering doesn't work/i}))
    expect(screen.getByRole("region", {name: /replies to the comment: Of course. I'm always willing to help/i}))
    expect(screen.getByRole("region", {name: /replies to the comment: Why not! There are many reasons why this bug might happen/i}))
    expect(screen.getByText("3 hours ago")).toBeInTheDocument()
    expect(screen.getByText("2 hours ago")).toBeInTheDocument()
    expect(screen.getByText("30 minutes ago")).toBeInTheDocument()
    expect(screen.getByText("10 minutes ago")).toBeInTheDocument()
    expect(screen.getByText("1 minute ago")).toBeInTheDocument()
    expect(screen.getByText("Is anyone interested in helping me with a django app? I have some problems with creating an API. Filtering doesn't work for some reason. I would also love to talk to somebody experienced and would be glad if somebody could assess my work. I would love to be a better software developer")).toBeInTheDocument()
    expect(screen.getByText("Of course. I'm always willing to help")).toBeInTheDocument()
    expect(screen.getByText("Why not! There are many reasons why this bug might happen")).toBeInTheDocument()
    expect(screen.getByText("For instance?")).toBeInTheDocument()
    expect(screen.getByText("Look at the docs ;) There are so many examples there.")).toBeInTheDocument()
    expect(screen.getAllByPlaceholderText(/add a reply/i)).toHaveLength(2)
    expect(screen.getByRole("textbox", {name: /add a reply to the comment: Of course. I'm always willing to help/i})).toBeInTheDocument()
    expect(screen.getByRole("textbox", {name: /add a reply to the comment: Why not! There are many reasons why this bug might happen/i})).toBeInTheDocument()
    expect(screen.getAllByPlaceholderText(/Add a comment/i)).toHaveLength(1)
    expect(screen.getByRole("textbox", {name: /add a comment to the post: Is anyone interested in helping me with a django app\? I have some problems with creating an API. Filtering doesn't work/i})).toBeInTheDocument()
    expect(screen.getByRole("button", {name: /delete this post/i})).toBeInTheDocument()
    expect(screen.getByRole("link", {name: /edit this post/i})).toBeInTheDocument()
    expect(screen.getByRole("link", {name: /edit this post/i})).toHaveAttribute("href", '/home/post/1/update')
    expect(screen.queryByRole("img", {name: /loading/i})).not.toBeInTheDocument()
    expect(screen.getAllByRole("button", {name: /submit your reply/i})).toHaveLength(2)
    expect(screen.getAllByRole("button", {name: /submit your comment/i})).toHaveLength(1)
    const buttons = screen.getAllByRole("button")
    buttons.forEach(button => {
        expect(button).not.toBeDisabled()
    });
    const links = screen.getAllByRole("link")
    links.forEach(link => {
        expect(link).toHaveStyle({pointerEvents: "auto"})
    })
})

test("post is displayed to users other than the author in a proper way", async () => {
    const history = createMemoryHistory()
    history.push('/home/post/1')
    renderPostDetailPage(history, 2)
    expect(screen.queryByRole("img", {name: /loading/i})).toBeInTheDocument()
    expect(await screen.findByRole("link", {name: "user1"})).toBeInTheDocument()
    expect(screen.getByRole("link", {name: "user1"})).toHaveAttribute("href", "/home/account/1")
    expect(screen.getByRole("link", {name: "user2"})).toBeInTheDocument()
    expect(screen.getByRole("link", {name: "user2"})).toHaveAttribute("href", "/home/account/2")
    expect(screen.getByRole("link", {name: "user8"})).toHaveAttribute("href", "/home/account/8")
    expect(screen.getByRole("link", {name: "user8"})).toBeInTheDocument()
    expect(screen.getByRole("link", {name: "user9"})).toHaveAttribute("href", "/home/account/9")
    expect(screen.getByRole("link", {name: "user9"})).toBeInTheDocument()
    expect(screen.getByRole("link", {name: "user7"})).toHaveAttribute("href", "/home/account/7")
    expect(screen.getByRole("link", {name: "user7"})).toBeInTheDocument()
    expect(screen.getByText("3 hours ago")).toBeInTheDocument()
    expect(screen.getByText("2 hours ago")).toBeInTheDocument()
    expect(screen.getByText("30 minutes ago")).toBeInTheDocument()
    expect(screen.getByText("10 minutes ago")).toBeInTheDocument()
    expect(screen.getByText("1 minute ago")).toBeInTheDocument()
    expect(screen.getByText("Is anyone interested in helping me with a django app? I have some problems with creating an API. Filtering doesn't work for some reason. I would also love to talk to somebody experienced and would be glad if somebody could assess my work. I would love to be a better software developer")).toBeInTheDocument()
    expect(screen.getByText("Of course. I'm always willing to help")).toBeInTheDocument()
    expect(screen.getByText("Why not! There are many reasons why this bug might happen")).toBeInTheDocument()
    expect(screen.getByText("For instance?")).toBeInTheDocument()
    expect(screen.getByText("Look at the docs ;) There are so many examples there.")).toBeInTheDocument()
    expect(screen.getAllByPlaceholderText(/add a reply/i)).toHaveLength(2)
    expect(screen.getAllByPlaceholderText(/Add a comment/i)).toHaveLength(1)
    expect(screen.queryByRole("button", {name: /delete this post/i})).not.toBeInTheDocument()
    expect(screen.queryByRole("link", {name: /edit this post/i})).not.toBeInTheDocument()
    expect(screen.queryByRole("img", {name: /loading/i})).not.toBeInTheDocument()
    expect(screen.getAllByRole("button", {name: /submit your reply/i})).toHaveLength(2)
    expect(screen.getAllByRole("button", {name: /submit your comment/i})).toHaveLength(1)
    const buttons = screen.getAllByRole("button")
    buttons.forEach(button => {
        expect(button).not.toBeDisabled()
    });
    const links = screen.getAllByRole("link")
    links.forEach(link => {
        expect(link).toHaveStyle("pointerEvents: auto")
    })
})

test("if the post doesn't exist, the error is handled gracefully", async () => {
    server.use(
        rest.get('https://arcane-spire-03245.herokuapp.com/api/services/posts/1/', (req, res, ctx) => {
            return res.once(
                ctx.status(404),
                ctx.json({'message': "This post doesn't exist"})
                )
        })
    )
    const history = createMemoryHistory()
    history.push('/home/post/1')
    renderPostDetailPage(history, 2)
    expect(screen.queryByRole("img", {name: /loading/i})).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText(/this post doesn't exist anymore/i)).toBeInTheDocument())
    expect(screen.queryByRole("img", {name: /loading/i})).not.toBeInTheDocument()
})

test("authorization error is handled gracefully", async () => {
    const history = createMemoryHistory()
    history.push('/home/post/1')
    const authTokens = {
        access: "invalid-access",
        refresh: "valid-refresh"
    }
    const tokenUpdate = jest.fn()
    render(
    <Router history={history}>
        <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
            userId: 2, updateToken: tokenUpdate}}>
                <HomePage />
        </AuthContext.Provider>
    </Router>)
    expect(screen.queryByRole("img", {name: /loading/i})).toBeInTheDocument()
    await waitFor(() => expect(tokenUpdate).toHaveBeenCalledTimes(1))
})

test("server error is handled gracefully", async () => {
    // situtions when the server returns status other than 200, 404 with a message and 401 (or doesn't return a response at all)
    server.use(
        rest.get('https://arcane-spire-03245.herokuapp.com/api/services/posts/1/', (req, res, ctx) => {
            return res.once(
                ctx.status(500)
                )
        })
    )
    const history = createMemoryHistory()
    history.push('/home/post/1')
    renderPostDetailPage(history, 2)
    expect(screen.queryByRole("img", {name: /loading/i})).toBeInTheDocument()
    expect(await screen.findByText(/we weren't able to load the resource. try again later/i)).toBeInTheDocument()
    expect(screen.queryByRole("img", {name: /loading/i})).not.toBeInTheDocument()
})

test("deleting a post at the detail page is handled properly", async () => {
    const history = createMemoryHistory()
    history.push('/home/post/1')
    renderPostDetailPage(history, 1)
    expect(await screen.findByRole("button", {name: /delete this post/i})).toBeInTheDocument()
    userEvent.click(screen.getByRole("button", {name: /delete this post/i}))
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText(/are you sure that you wanna delete this post/i)).toBeInTheDocument()
    expect(screen.getByRole("button", {name: /^yes$/i})).toBeInTheDocument()
    expect(screen.getByRole("button", {name: /^yes$/i})).not.toBeDisabled()
    expect(screen.getByRole("button", {name: /^no$/i})).toBeInTheDocument()
    expect(screen.getByRole("button", {name: /^no$/i})).not.toBeDisabled()
    let links = screen.getAllByRole("link")
    links.forEach(link => {
        expect(link).toHaveStyle("pointerEvents: none")
    })
    let buttons = screen.getAllByRole("button", {name: /submit your reply/i})
    buttons.forEach(button => {
        expect(button).toBeDisabled()
    })
    expect(screen.getByRole("button", {name: /submit your comment/i})).toBeDisabled()
    expect(screen.getByRole('link', {name: /edit this post/i})).toHaveStyle('pointerEvents: none')
    expect(screen.getByRole("button", {name: /delete this post/i})).toBeDisabled()
    userEvent.click(screen.getByRole("button", {name: /^yes$/i}))
    expect(screen.getByRole("img", {name: /wait a moment/i})).toBeInTheDocument()
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.queryByText(/are you sure that you wanna delete this post/i)).not.toBeInTheDocument()
    expect(screen.queryByRole("button", {name: /^yes$/i})).not.toBeInTheDocument()
    expect(screen.queryByRole("button", {name: /^no$/i})).not.toBeInTheDocument()
    links = screen.getAllByRole("link")
    links.forEach(link => {
        expect(link).toHaveStyle("pointerEvents: none")
    })
    buttons = screen.getAllByRole("button", {name: /submit your reply/i})
    buttons.forEach(button => {
        expect(button).toBeDisabled()
    })
    expect(screen.getByRole("button", {name: /submit your comment/i})).toBeDisabled()
    expect(screen.getByRole('link', {name: /edit this post/i})).toHaveStyle('pointerEvents: none')
    expect(screen.getByRole("button", {name: /delete this post/i})).toBeDisabled()
    expect(await screen.findByText(/your post was successfully deleted/i)).toBeInTheDocument()
    expect(screen.getByRole("link", {name: /go back to the homepage/i})).toBeInTheDocument()
    expect(screen.getByRole("link", {name: /go back to the homepage/i})).toHaveAttribute("href", "/home")
    expect(screen.getByRole("link", {name: /create a new post/i})).toBeInTheDocument()
    expect(screen.getByRole("link", {name: /create a new post/i})).toHaveAttribute("href", "/home/post/add")
    expect(screen.queryByTestId("before-delete-success")).not.toBeInTheDocument()
})

test("user wants to delete a post but exits a dialog window", async () => {
    const history = createMemoryHistory()
    history.push('/home/post/1')
    renderPostDetailPage(history, 1)
    expect(await screen.findByRole("button", {name: /delete this post/i})).toBeInTheDocument()
    userEvent.click(screen.getByRole("button", {name: /delete this post/i}))
    userEvent.click(screen.getByRole("button", {name: /^no$/i}))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(screen.queryByText(/are you sure that you wanna delete this post/i)).not.toBeInTheDocument()
    let links = screen.getAllByRole("link")
    links.forEach(link => {
        expect(link).toHaveStyle("pointerEvents: auto")
    })
    let buttons = screen.getAllByRole("button", {name: /submit your reply/i})
    buttons.forEach(button => {
        expect(button).not.toBeDisabled()
    })
    expect(screen.getByRole("button", {name: /submit your comment/i})).not.toBeDisabled()
    expect(screen.getByRole('link', {name: /edit this post/i})).not.toHaveStyle('pointerEvents: none')
    expect(screen.getByRole("button", {name: /delete this post/i})).not.toBeDisabled()
    // asserting that the new dialog looks exactly the same
    userEvent.click(screen.getByRole("button", {name: /delete this post/i}))
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText(/are you sure that you wanna delete this post/i)).toBeInTheDocument()
    expect(screen.getByRole("button", {name: /^yes$/i})).toBeInTheDocument()
})

test("error while deleting a post is handled gracefully", async() => {
    server.use(
        rest.delete('https://arcane-spire-03245.herokuapp.com/api/services/posts/1/', (req, res, ctx) => {
            return res.once(
                ctx.status(404)
            )
        })
    )
    const history = createMemoryHistory()
    history.push('/home/post/1')
    renderPostDetailPage(history, 1)
    expect(await screen.findByRole("button", {name: /delete this post/i})).toBeInTheDocument()
    expect(screen.getByTestId("before-delete-success")).not.toHaveStyle({backgroundColor: 'rgb(175, 174, 174)', borderColor: 'black'})
    expect(screen.getByRole("main")).not.toHaveStyle({backgroundColor: 'rgb(102, 100, 100)'})
    expect(screen.getByRole("button", {name: /delete this post/i})).not.toHaveStyle({backgroundColor: 'grey', color: 'darkgrey'})
    expect(screen.getByRole("textbox", {name: /add a comment/i})).not.toHaveStyle({backgroundColor: 'rgb(175, 174, 174)'})
    expect(screen.getAllByRole("textbox", {name: /add a reply/i})[0]).not.toHaveStyle({backgroundColor: 'rgb(175, 174, 174)'})
    expect(screen.getByRole("button", {name: /submit your comment/i})).not.toHaveStyle({backgroundColor: 'rgb(175, 174, 174)', color: 'black'})
    expect(screen.getAllByRole("button", {name: /submit your reply/i})[0]).not.toHaveStyle({backgroundColor: 'rgb(175, 174, 174)', color: 'black'})
    userEvent.click(screen.getByRole("button", {name: /delete this post/i}))
    expect(screen.getByTestId("before-delete-success")).toHaveStyle({backgroundColor: 'rgb(175, 174, 174)', borderColor: 'black'})
    expect(screen.getByRole("main")).toHaveStyle({backgroundColor: 'rgb(102, 100, 100)'})
    expect(screen.getByRole("button", {name: /delete this post/i})).toHaveStyle({backgroundColor: 'grey', color: 'darkgrey'})
    expect(screen.getByRole("textbox", {name: /add a comment/i})).toHaveStyle({backgroundColor: 'rgb(175, 174, 174)'})
    expect(screen.getAllByRole("textbox", {name: /add a reply/i})[0]).toHaveStyle({backgroundColor: 'rgb(175, 174, 174)'})
    expect(screen.getByRole("button", {name: /submit your comment/i})).toHaveStyle({backgroundColor: 'rgb(175, 174, 174)', color: 'black'})
    expect(screen.getAllByRole("button", {name: /submit your reply/i})[0]).toHaveStyle({backgroundColor: 'rgb(175, 174, 174)', color: 'black'})
    userEvent.click(screen.getByRole("button", {name: /^yes$/i}))
    expect(await screen.findByText(/an error occured/i)).toBeInTheDocument()
    expect(screen.queryByRole("img", {name: /wait a moment/i})).not.toBeInTheDocument()
    expect(screen.getByRole("button", {name: /^ok$/i})).toBeInTheDocument()
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    let links = screen.getAllByRole("link")
    console.log(links[0])
    links.forEach(link => {
        expect(link).toHaveStyle("pointerEvents: none")
    })
    let buttons = screen.getAllByRole("button", {name: /submit your reply/i})
    buttons.forEach(button => {
        expect(button).toBeDisabled()
    })
    expect(screen.getByRole("button", {name: /submit your comment/i})).toBeDisabled()
    expect(screen.getByRole('link', {name: /edit this post/i})).toHaveStyle('pointerEvents: none')
    expect(screen.getByRole("button", {name: /delete this post/i})).toBeDisabled()
    userEvent.click(screen.getByRole("button", {name: /^ok$/i}))
    expect(screen.getByTestId("before-delete-success")).not.toHaveStyle({backgroundColor: 'rgb(175, 174, 174)', borderColor: 'black'})
    expect(screen.getByRole("main")).not.toHaveStyle({backgroundColor: 'rgb(102, 100, 100)'})
    expect(screen.getByRole("button", {name: /delete this post/i})).not.toHaveStyle({backgroundColor: 'grey', color: 'darkgrey'})
    expect(screen.getByRole("textbox", {name: /add a comment/i})).not.toHaveStyle({backgroundColor: 'rgb(175, 174, 174)'})
    expect(screen.getAllByRole("textbox", {name: /add a reply/i})[0]).not.toHaveStyle({backgroundColor: 'rgb(175, 174, 174)'})
    expect(screen.getByRole("button", {name: /submit your comment/i})).not.toHaveStyle({backgroundColor: 'rgb(175, 174, 174)', color: 'black'})
    expect(screen.getAllByRole("button", {name: /submit your reply/i})[0]).not.toHaveStyle({backgroundColor: 'rgb(175, 174, 174)', color: 'black'})
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(screen.queryByTestId("before-delete-success")).toBeInTheDocument()
    links = screen.getAllByRole("link")
    links.forEach(link => {
        expect(link).toHaveStyle("pointerEvents: auto")
    })
    buttons = screen.getAllByRole("button", {name: /submit your reply/i})
    buttons.forEach(button => {
        expect(button).not.toBeDisabled()
    })
    expect(screen.getByRole("button", {name: /submit your comment/i})).not.toBeDisabled()
    expect(screen.getByRole('link', {name: /edit this post/i})).not.toHaveStyle('pointerEvents: none')
    expect(screen.getByRole("button", {name: /delete this post/i})).not.toBeDisabled()
    // asserting that the new dialog looks exactly the same
    userEvent.click(screen.getByRole("button", {name: /delete this post/i}))
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText(/are you sure that you wanna delete this post/i)).toBeInTheDocument()
    expect(screen.getByRole("button", {name: /^yes$/i})).toBeInTheDocument()
})

test("input fields work correctly", async () => {
    const history = createMemoryHistory()
    history.push('/home/post/1')
    renderPostDetailPage(history, 1)
    expect(await screen.findByPlaceholderText(/add a comment/i)).toBeInTheDocument()
    userEvent.type(screen.getByPlaceholderText(/add a comment/i), "a")
    expect(screen.getByPlaceholderText(/add a comment/i)).toHaveValue("a")
    let text = "aaaaa".repeat(1000)
    fireEvent.change(screen.getByPlaceholderText(/add a comment/i), {target: {value: text}})
    await waitFor(() => expect(screen.getByPlaceholderText(/add a comment/i)).toHaveValue(text))
    expect(screen.queryByText(/your comment can't be longer than/i)).not.toBeInTheDocument()
    userEvent.type(screen.getByPlaceholderText(/add a comment/i), "a")
    expect(screen.queryByText(/your comment can't be longer than/i)).toBeInTheDocument()
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/add a comment/i)).toHaveValue(text)
    userEvent.type(screen.getByPlaceholderText(/add a comment/i), "{backspace}")
    expect(screen.queryByText(/your comment can't be longer than/i)).not.toBeInTheDocument()
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()

    const replyInput = screen.getAllByPlaceholderText(/add a reply/i)[0]
    userEvent.type(replyInput, "a")
    expect(replyInput).toHaveValue("a")
    fireEvent.change(replyInput, {target: {value: text}})
    await waitFor(() => expect(replyInput).toHaveValue(text))
    expect(screen.queryByText(/your reply can't be longer than/i)).not.toBeInTheDocument()
    userEvent.type(replyInput, "a")
    expect(screen.queryByText(/your reply can't be longer than/i)).toBeInTheDocument()
    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(replyInput).toHaveValue(text)
    userEvent.type(replyInput, "{backspace}")
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(screen.queryByText(/your reply can't be longer than/i)).not.toBeInTheDocument()
})

test("user adds a comment successfully", async () => {
    const history = createMemoryHistory()
    history.push('/home/post/1')
    renderPostDetailPage(history, 1)
    expect(await screen.findByPlaceholderText(/add a comment/i)).toBeInTheDocument()
    const commentInput = screen.getByPlaceholderText(/add a comment/i)
    userEvent.type(commentInput, "valid comment")
    expect(screen.getByRole("button", {name: /submit your comment/i})).not.toBeDisabled()
    userEvent.click(screen.getByRole("button", {name: /submit your comment/i}))
    expect(screen.getByRole("button", {name: /submit your comment/i})).toBeDisabled()
    expect(await screen.findByText(/YOU/)).toBeInTheDocument()
    expect(screen.getByText(/YOU/)).toHaveAttribute("href", "/home/account/1")
    expect(screen.getByText("valid comment")).toBeInTheDocument()
    expect(screen.getByRole("button", {name: /submit your comment/i})).not.toBeDisabled()
    expect(screen.getByText("Is anyone interested in helping me with a django app? I have some problems with creating an API. Filtering doesn't work for some reason. I would also love to talk to somebody experienced and would be glad if somebody could assess my work. I would love to be a better software developer")).toBeInTheDocument()
    expect(screen.getByText("Of course. I'm always willing to help")).toBeInTheDocument()
    expect(screen.getByText("Why not! There are many reasons why this bug might happen")).toBeInTheDocument()
    expect(screen.getByText("For instance?")).toBeInTheDocument()
    expect(screen.getByText("Look at the docs ;) There are so many examples there.")).toBeInTheDocument()
    expect(screen.getByText(/just now/i)).toBeInTheDocument()
    expect(screen.getAllByPlaceholderText(/add a reply/i)).toHaveLength(3)
    expect(screen.getAllByRole("button", {name: /submit your reply/i})).toHaveLength(3)
    expect(screen.getByPlaceholderText(/add a comment/i)).toHaveValue("")
    // making sure that the new comment gets a proper id and, as a conseqence, the user is able to add a reply immediately
    userEvent.type(screen.getByTestId("input-comment-20000"), "New reply to a new comment")
    userEvent.click(screen.getByTestId("button-comment-20000"))
    await waitFor(() => expect(screen.getByTestId("input-comment-20000")).toHaveValue(""))
    expect(screen.getAllByText(/YOU/)).toHaveLength(2)
    expect(screen.getAllByText(/just now/i)).toHaveLength(2)
    expect(screen.getByText("New reply to a new comment")).toBeInTheDocument()
})

test("user adds an invalid comment", async () => {
    const history = createMemoryHistory()
    history.push('/home/post/1')
    renderPostDetailPage(history, 1)
    expect(await screen.findByPlaceholderText(/add a comment/i)).toBeInTheDocument()
    const commentInput = screen.getByPlaceholderText(/add a comment/i)
    userEvent.type(commentInput, "invalid comment")
    expect(screen.getByRole("button", {name: /submit your comment/i})).not.toBeDisabled()
    userEvent.click(screen.getByRole("button", {name: /submit your comment/i}))
    expect(screen.getByRole("button", {name: /submit your comment/i})).toBeDisabled()
    expect(await screen.findByRole("alert")).toBeInTheDocument()
    expect(screen.getByText(/Your comment seems to be invalid/i)).toBeInTheDocument()
    expect(screen.getByRole("button", {name: /submit your comment/i})).not.toBeDisabled()
    expect(screen.getAllByText("invalid comment")).toHaveLength(1)
    expect(screen.getByPlaceholderText(/add a comment/i)).toHaveValue("invalid comment")
    expect(screen.getByText("Is anyone interested in helping me with a django app? I have some problems with creating an API. Filtering doesn't work for some reason. I would also love to talk to somebody experienced and would be glad if somebody could assess my work. I would love to be a better software developer")).toBeInTheDocument()
    expect(screen.getByText("Of course. I'm always willing to help")).toBeInTheDocument()
    expect(screen.getByText("Why not! There are many reasons why this bug might happen")).toBeInTheDocument()
    expect(screen.getByText("For instance?")).toBeInTheDocument()
    expect(screen.getByText("Look at the docs ;) There are so many examples there.")).toBeInTheDocument()
    expect(screen.queryByText(/YOU/)).not.toBeInTheDocument()
    expect(screen.queryByText(/just now/i)).not.toBeInTheDocument()
    expect(screen.getAllByPlaceholderText(/add a reply/i)).toHaveLength(2)
    expect(screen.getAllByRole("button", {name: /submit your reply/i})).toHaveLength(2)
    userEvent.type(screen.getByPlaceholderText(/add a comment/i), "a")
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(screen.queryByText(/Your comment seems to be invalid/i)).not.toBeInTheDocument()
})

test("user adds an empty comment", async () => {
    const history = createMemoryHistory()
    history.push('/home/post/1')
    renderPostDetailPage(history, 1)
    expect(await screen.findByPlaceholderText(/add a comment/i)).toBeInTheDocument()
    expect(screen.getByRole("button", {name: /submit your comment/i})).not.toBeDisabled()
    userEvent.type(screen.getByPlaceholderText(/add a comment/i), "  ")
    userEvent.click(screen.getByRole("button", {name: /submit your comment/i}))
    expect(screen.getByRole("button", {name: /submit your comment/i})).toBeDisabled()
    expect(await screen.findByRole("alert")).toBeInTheDocument()
    expect(screen.getByText(/You can't add an empty comment/i)).toBeInTheDocument()
    expect(screen.getByRole("button", {name: /submit your comment/i})).not.toBeDisabled()
    expect(screen.getByPlaceholderText(/add a comment/i)).toHaveValue("  ")
    expect(screen.getByText("Is anyone interested in helping me with a django app? I have some problems with creating an API. Filtering doesn't work for some reason. I would also love to talk to somebody experienced and would be glad if somebody could assess my work. I would love to be a better software developer")).toBeInTheDocument()
    expect(screen.getByText("Of course. I'm always willing to help")).toBeInTheDocument()
    expect(screen.getByText("Why not! There are many reasons why this bug might happen")).toBeInTheDocument()
    expect(screen.getByText("For instance?")).toBeInTheDocument()
    expect(screen.getByText("Look at the docs ;) There are so many examples there.")).toBeInTheDocument()
    expect(screen.queryByText(/YOU/)).not.toBeInTheDocument()
    expect(screen.queryByText(/just now/i)).not.toBeInTheDocument()
    expect(screen.getAllByPlaceholderText(/add a reply/i)).toHaveLength(2)
    expect(screen.getAllByRole("button", {name: /submit your reply/i})).toHaveLength(2)
    userEvent.type(screen.getByPlaceholderText(/add a comment/i), "a")
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(screen.queryByText(/You can't add an empty comment/i)).not.toBeInTheDocument()
})
test("a server error occurs when the user adds a comment", async () => {
    const history = createMemoryHistory()
    history.push('/home/post/1')
    renderPostDetailPage(history, 1)
    expect(await screen.findByPlaceholderText(/add a comment/i)).toBeInTheDocument()
    const commentInput = screen.getByPlaceholderText(/add a comment/i)
    userEvent.type(commentInput, "some error")
    expect(screen.getByRole("button", {name: /submit your comment/i})).not.toBeDisabled()
    userEvent.click(screen.getByRole("button", {name: /submit your comment/i}))
    expect(screen.getByRole("button", {name: /submit your comment/i})).toBeDisabled()
    expect(await screen.findByRole("alert")).toBeInTheDocument()
    expect(screen.getByText(/Upps... something went wrong/i)).toBeInTheDocument()
    expect(screen.getByRole("button", {name: /submit your comment/i})).not.toBeDisabled()
    expect(screen.getAllByText("some error")).toHaveLength(1)
    expect(screen.getByPlaceholderText(/add a comment/i)).toHaveValue("some error")
    expect(screen.getByText("Is anyone interested in helping me with a django app? I have some problems with creating an API. Filtering doesn't work for some reason. I would also love to talk to somebody experienced and would be glad if somebody could assess my work. I would love to be a better software developer")).toBeInTheDocument()
    expect(screen.getByText("Of course. I'm always willing to help")).toBeInTheDocument()
    expect(screen.getByText("Why not! There are many reasons why this bug might happen")).toBeInTheDocument()
    expect(screen.getByText("For instance?")).toBeInTheDocument()
    expect(screen.getByText("Look at the docs ;) There are so many examples there.")).toBeInTheDocument()
    expect(screen.queryByText(/YOU/)).not.toBeInTheDocument()
    expect(screen.queryByText(/just now/i)).not.toBeInTheDocument()
    expect(screen.getAllByPlaceholderText(/add a reply/i)).toHaveLength(2)
    expect(screen.getAllByRole("button", {name: /submit your reply/i})).toHaveLength(2)
    userEvent.type(screen.getByPlaceholderText(/add a comment/i), "a")
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(screen.queryByText(/Upps... something went wrong/i)).not.toBeInTheDocument()
})

test("user adds a reply successfully", async () => {
    server.use(
        rest.get('https://arcane-spire-03245.herokuapp.com/api/services/posts/1/', (req, res, ctx) => {
            if (req.headers._headers.authorization === "Bearer valid-access"){
                return res.once(
                ctx.status(200),
                ctx.json(mock_api_data
                ))
            }
        })
    )
    const history = createMemoryHistory()
    history.push('/home/post/1')
    renderPostDetailPage(history, 1)
    expect(await screen.findByPlaceholderText(/add a reply/i)).toBeInTheDocument()
    const replyInput = screen.getByPlaceholderText(/add a reply/i)
    userEvent.type(replyInput, "valid reply")
    expect(screen.getByRole("button", {name: /submit your reply/i})).not.toBeDisabled()
    userEvent.click(screen.getByRole("button", {name: /submit your reply/i}))
    expect(screen.getByRole("button", {name: /submit your reply/i})).toBeDisabled()
    expect(await screen.findByText(/YOU/)).toBeInTheDocument()
    expect(screen.getByRole("link", {name: /YOU/})).toHaveAttribute('href', '/home/account/1')
    expect(screen.getByText("valid reply")).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/add a reply/i)).toHaveValue("")
    expect(screen.getByRole("button", {name: /submit your reply/i})).not.toBeDisabled()
    expect(screen.getByText("Is anyone interested in helping me with a django app? I have some problems with creating an API. Filtering doesn't work for some reason. I would also love to talk to somebody experienced and would be glad if somebody could assess my work. I would love to be a better software developer")).toBeInTheDocument()
    expect(screen.getByText("Why not! There are many reasons why this bug might happen")).toBeInTheDocument()
    expect(screen.getByText("For instance?")).toBeInTheDocument()
    expect(screen.getByText("Look at the docs ;) There are so many examples there.")).toBeInTheDocument()
    expect(screen.getByText(/just now/i)).toBeInTheDocument()
    expect(screen.getAllByPlaceholderText(/add a reply/i)).toHaveLength(1)
    expect(screen.getAllByRole("button", {name: /submit your reply/i})).toHaveLength(1)
})

test("user adds an invalid reply", async () => {
    server.use(
        rest.get('https://arcane-spire-03245.herokuapp.com/api/services/posts/1/', (req, res, ctx) => {
            if (req.headers._headers.authorization === "Bearer valid-access"){
                return res.once(
                ctx.status(200),
                ctx.json(mock_api_data
                ))
            }
        })
    )
    const history = createMemoryHistory()
    history.push('/home/post/1')
    renderPostDetailPage(history, 1)
    expect(await screen.findByPlaceholderText(/add a reply/i)).toBeInTheDocument()
    const replyInput = screen.getByPlaceholderText(/add a reply/i)
    userEvent.type(replyInput, "invalid reply")
    expect(screen.getByRole("button", {name: /submit your reply/i})).not.toBeDisabled()
    userEvent.click(screen.getByRole("button", {name: /submit your reply/i}))
    expect(screen.getByRole("button", {name: /submit your reply/i})).toBeDisabled()
    expect(await screen.findByRole("alert")).toBeInTheDocument()
    expect(screen.getByText(/your reply seems to be invalid/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/add a reply/i)).toHaveValue("invalid reply")
    expect(screen.getByText("invalid reply")).toBeInTheDocument()
    expect(screen.getByRole("button", {name: /submit your reply/i})).not.toBeDisabled()
    expect(screen.getByText("Is anyone interested in helping me with a django app? I have some problems with creating an API. Filtering doesn't work for some reason. I would also love to talk to somebody experienced and would be glad if somebody could assess my work. I would love to be a better software developer")).toBeInTheDocument()
    expect(screen.getByText("Why not! There are many reasons why this bug might happen")).toBeInTheDocument()
    expect(screen.getByText("For instance?")).toBeInTheDocument()
    expect(screen.getByText("Look at the docs ;) There are so many examples there.")).toBeInTheDocument()
    expect(screen.queryByText(/YOU/)).not.toBeInTheDocument()
    expect(screen.queryByText(/just now/i)).not.toBeInTheDocument()
    expect(screen.getAllByPlaceholderText(/add a reply/i)).toHaveLength(1)
    expect(screen.getAllByRole("button", {name: /submit your reply/i})).toHaveLength(1)
    userEvent.type(replyInput, "a")
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(screen.queryByText(/your reply seems to be invalid/i)).not.toBeInTheDocument()
})

test("user adds an empty reply", async () => {
    server.use(
        rest.get('https://arcane-spire-03245.herokuapp.com/api/services/posts/1/', (req, res, ctx) => {
            if (req.headers._headers.authorization === "Bearer valid-access"){
                return res.once(
                ctx.status(200),
                ctx.json(mock_api_data
                ))
            }
        })
    )
    const history = createMemoryHistory()
    history.push('/home/post/1')
    renderPostDetailPage(history, 1)
    expect(await screen.findByPlaceholderText(/add a reply/i)).toBeInTheDocument()
    const replyInput = screen.getByPlaceholderText(/add a reply/i)
    userEvent.type(replyInput, "     ")
    expect(screen.getByRole("button", {name: /submit your reply/i})).not.toBeDisabled()
    userEvent.click(screen.getByRole("button", {name: /submit your reply/i}))
    expect(screen.getByRole("button", {name: /submit your reply/i})).toBeDisabled()
    expect(await screen.findByRole("alert")).toBeInTheDocument()
    expect(screen.getByText(/you can't add an empty reply/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/add a reply/i)).toHaveValue("     ")
    expect(screen.getByRole("button", {name: /submit your reply/i})).not.toBeDisabled()
    expect(screen.getByText("Is anyone interested in helping me with a django app? I have some problems with creating an API. Filtering doesn't work for some reason. I would also love to talk to somebody experienced and would be glad if somebody could assess my work. I would love to be a better software developer")).toBeInTheDocument()
    expect(screen.getByText("Why not! There are many reasons why this bug might happen")).toBeInTheDocument()
    expect(screen.getByText("For instance?")).toBeInTheDocument()
    expect(screen.getByText("Look at the docs ;) There are so many examples there.")).toBeInTheDocument()
    expect(screen.queryByText(/YOU/)).not.toBeInTheDocument()
    expect(screen.queryByText(/just now/i)).not.toBeInTheDocument()
    expect(screen.getAllByPlaceholderText(/add a reply/i)).toHaveLength(1)
    expect(screen.getAllByRole("button", {name: /submit your reply/i})).toHaveLength(1)
    userEvent.type(replyInput, "a")
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(screen.queryByText(/you can't add an empty reply/i)).not.toBeInTheDocument()
})

test("a server error occurs when the user adds a reply", async () => {
    server.use(
        rest.get('https://arcane-spire-03245.herokuapp.com/api/services/posts/1/', (req, res, ctx) => {
            if (req.headers._headers.authorization === "Bearer valid-access"){
                return res.once(
                ctx.status(200),
                ctx.json(mock_api_data
                ))
            }
        })
    )
    const history = createMemoryHistory()
    history.push('/home/post/1')
    renderPostDetailPage(history, 1)
    expect(await screen.findByPlaceholderText(/add a reply/i)).toBeInTheDocument()
    const replyInput = screen.getByPlaceholderText(/add a reply/i)
    userEvent.type(replyInput, "some error")
    expect(screen.getByRole("button", {name: /submit your reply/i})).not.toBeDisabled()
    userEvent.click(screen.getByRole("button", {name: /submit your reply/i}))
    expect(screen.getByRole("button", {name: /submit your reply/i})).toBeDisabled()
    expect(await screen.findByRole("alert")).toBeInTheDocument()
    expect(screen.getByText(/Upps... something went wrong/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/add a reply/i)).toHaveValue("some error")
    expect(screen.getByText("some error")).toBeInTheDocument()
    expect(screen.getByRole("button", {name: /submit your reply/i})).not.toBeDisabled()
    expect(screen.getByText("Is anyone interested in helping me with a django app? I have some problems with creating an API. Filtering doesn't work for some reason. I would also love to talk to somebody experienced and would be glad if somebody could assess my work. I would love to be a better software developer")).toBeInTheDocument()
    expect(screen.getByText("Why not! There are many reasons why this bug might happen")).toBeInTheDocument()
    expect(screen.getByText("For instance?")).toBeInTheDocument()
    expect(screen.getByText("Look at the docs ;) There are so many examples there.")).toBeInTheDocument()
    expect(screen.queryByText(/YOU/)).not.toBeInTheDocument()
    expect(screen.queryByText(/just now/i)).not.toBeInTheDocument()
    expect(screen.getAllByPlaceholderText(/add a reply/i)).toHaveLength(1)
    expect(screen.getAllByRole("button", {name: /submit your reply/i})).toHaveLength(1)
    userEvent.type(replyInput, "a")
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(screen.queryByText(/Upps... something went wrong/i)).not.toBeInTheDocument()
})