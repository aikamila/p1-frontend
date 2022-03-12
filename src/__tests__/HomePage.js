import {render, screen, waitFor} from '@testing-library/react'
import App from '../App'
import { AuthProvider } from '../context/AuthContext'
import {Router} from 'react-router-dom'
import {createMemoryHistory} from 'history'
import userEvent from '@testing-library/user-event'
import renderer from 'react-test-renderer'
import AuthContext from '../context/AuthContext'
import HomePage from '../pages/HomePage'
import {server} from '../mocks/server'
import {rest} from 'msw'
import {act} from 'react-dom/test-utils'
import ListEachPost from '../components/ListEachPost'

afterEach(() => {
    localStorage.removeItem("authTokens")
})

jest.setTimeout(7000)

const renderHomePage = (history) => {
    return render(
        <Router history={history} >
            <AuthProvider>
                <App />
            </AuthProvider>
        </Router>
    )
}

test("all header elements are accessible", () => {
    // add maybe my account etc
    const history = createMemoryHistory()
    history.push("/home")
    render(
        <AuthContext.Provider value={{authTokens: {access: 'valid-access', refresh: 'valid-refresh'}}}>
          <Router history = {history}>
            <App />
          </Router>
        </AuthContext.Provider>
      );
    expect(screen.getByRole("button", {name: /log out/i})).toBeInTheDocument()
})

test("user is able to log out - without any problems", async () => {
    const history = createMemoryHistory()
    history.push("/auth")
    renderHomePage(history)
    userEvent.type(screen.getByRole("textbox", {name: /email/i}), "valid@mail.com")
    userEvent.type(screen.getByRole("textbox", {name: /password/i}), "Password*")
    userEvent.click(screen.getByRole("button", {name: /log in/i}))
    const button = await screen.findByRole("button", {name: /log out/i})
    userEvent.click(button)
    await waitFor(() => expect(localStorage.getItem("authTokens")).toBeNull)
    await waitFor(() => expect(history.location.pathname).toBe("/"))
    expect(screen.queryByText(/you were logged out/i)).not.toBeInTheDocument()
})

test("user is able to log out - when their refresh token is invalid", async () => {
    const history = createMemoryHistory()
    history.push("/auth")
    renderHomePage(history)
    userEvent.type(screen.getByRole("textbox", {name: /email/i}), "invalidtoken@mail.com")
    userEvent.type(screen.getByRole("textbox", {name: /password/i}), "Password*")
    userEvent.click(screen.getByRole("button", {name: /log in/i}))
    const button = await screen.findByRole("button", {name: /log out/i})
    userEvent.click(button)
    await waitFor(() => expect(localStorage.getItem("authTokens")).toBeNull)
    await waitFor(() => expect(history.location.pathname).toBe("/"))
    expect(screen.queryByText(/you were logged out/i)).not.toBeInTheDocument()
})

test("user is able to log out - when there is a server error", async () => {
    const history = createMemoryHistory()
    history.push("/auth")
    renderHomePage(history)
    userEvent.type(screen.getByRole("textbox", {name: /email/i}), "servererrortoken@mail.com")
    userEvent.type(screen.getByRole("textbox", {name: /password/i}), "Password*")
    userEvent.click(screen.getByRole("button", {name: /log in/i}))
    const button = await screen.findByRole("button", {name: /log out/i})
    userEvent.click(button)
    await waitFor(() => expect(localStorage.getItem("authTokens")).toBeNull)
    await waitFor(() => expect(history.location.pathname).toBe("/"))
    expect(screen.queryByText(/you were logged out/i)).not.toBeInTheDocument()
})

test("all elements are rendered", () => {
    const history = createMemoryHistory()
    history.push("/home")
    const page = renderer
    .create(
        <AuthContext.Provider value={{authTokens: {access: 'valid-access', refresh: 'valid-refresh'}}}>
            <Router history = {history}>
                <App />
            </Router>
        </AuthContext.Provider>)
    .toJSON();
    expect(page).toMatchSnapshot();
})


test("all posts are displayed to the user", async() => {
    // posts should be displayed on the home page, after the user logs in and all data is loaded
    const history = createMemoryHistory();
    history.push("/home")
    const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
        render(
        <Router history={history}>
            <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
            userId: 1, updateToken: null}}>
                <HomePage />
            </AuthContext.Provider>
        </Router>
        )
    
    expect(screen.getByRole("img", {name: /wait a second/i})).toBeInTheDocument()
    expect(await screen.findByText(/Is anyone creating a Java app/i)).toBeInTheDocument()
    expect(screen.getByText(/anyone interested in helping me with a django app/i)).toBeInTheDocument()
    expect(screen.getByText('user1')).toBeInTheDocument()
    expect(screen.getByText('user2')).toBeInTheDocument()
    expect(screen.getByRole("link", {name:'user1'})).toHaveAttribute("href", "/home/account/1")
    expect(screen.getByRole("link", {name:'user2'})).toHaveAttribute("href", "/home/account/2")
    expect(screen.getByText('1 day ago')).toBeInTheDocument()
    expect(screen.getByText('2 days ago')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(2)   
    expect(screen.queryByRole("img", {name: /wait a second/i})).not.toBeInTheDocument()
    expect(screen.queryByText(/7 comments/i)).toBeInTheDocument()
    expect(screen.queryByText(/3 comments/i)).toBeInTheDocument()
    expect(screen.getAllByRole("link", {name: /see more/i})).toHaveLength(2)
    expect(screen.getByRole("region", {name: /recent posts/i})).toBeInTheDocument()
    expect(screen.getByRole("link", {name: /edit/i})).toBeInTheDocument()
    expect(screen.getByRole("link", {name: /edit/i})).toHaveAttribute("href", "/home/post/1/update")
})

test("server error while loading posts is handled gracefully", async() => {
    server.use(
        rest.get('https://arcane-spire-03245.herokuapp.com/api/services/posts/', (req, res, ctx) => {
          return res.once(
              ctx.status(404)
          )
        }),
      )
    const history = createMemoryHistory();
    history.push("/home")
    const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
        render(
        <Router history={history}>
            <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
            userId: 1, updateToken: null}}>
                <HomePage />
            </AuthContext.Provider>
        </Router>
        )
    expect(screen.getByRole("img", {name: /wait a second/i})).toBeInTheDocument()
    expect(await screen.findByText(/We're not able to load the resources from the server/i)).toBeInTheDocument()
    expect(screen.queryByRole("img", {name: /wait a second/i})).not.toBeInTheDocument()
})

test("authorization error while loading posts is handled gracefully", async() => {
    const history = createMemoryHistory();
    history.push("/home")
    const authTokens = {refresh: 'valid-refresh', access: 'invalid-access'}
    const tokenUpdate = jest.fn()
         render(
        <Router history={history}>
            <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
            userId: 1, updateToken: tokenUpdate}}>
                <HomePage />
            </AuthContext.Provider>
        </Router>
        )
    
    expect(screen.getByRole("img", {name: /wait a second/i})).toBeInTheDocument()
    await waitFor(() => expect(tokenUpdate.mock.calls.length).toBe(1))
    // updateToken will receive a 401 response as well and will log the user out + inform them
})

test("each post of a logged-in user is rendered properly", () => {
    // the post is rendered correctly and links redirect to valid urls
    const history = createMemoryHistory();
    render(
    <Router history={history}>
        <AuthContext.Provider value={{userId: 12}}>
            <ListEachPost 
                id={10}
                text={"a".repeat(140)}
                user={12}
                time={"4 hours ago"}
                username={"user1"}
                engagementRate={10}
            ></ListEachPost>
        </AuthContext.Provider>
    </Router>)
    expect(screen.getByRole("link", {name: /edit this post/i})).toBeInTheDocument()
    expect(screen.getByRole("link", {name: /edit/i})).toHaveAttribute("href", "/home/post/10/update")
    expect(screen.getByRole("link", {name: /see more/i})).toHaveAttribute("href", "/home/post/10")
    expect(screen.getByText("a".repeat(120) + "...")).toBeInTheDocument()
})

test("all posts of other users are rendered properly", () => {
    // users who are not authors shouldn't be able to update their posts
    const history = createMemoryHistory();
    render(
    <Router history={history}>
        <AuthContext.Provider value={{userId: 2}}>
            <ListEachPost 
                id={1}
                text={"a".repeat(110)}
                user={1}
                time={"4 hours ago"}
                username={"user1"}
                engagementRate={5}
            ></ListEachPost>
        </AuthContext.Provider>
    </Router>)
    screen.debug()
    expect(screen.getByText("a".repeat(110))).toBeInTheDocument()
    expect(screen.queryByText("a".repeat(110) + "...")).not.toBeInTheDocument()
    expect(screen.getByRole("link", {name: /see more/i})).toHaveAttribute("href", "/home/post/1")
    expect(screen.queryByRole("link", {name: /edit/i})).not.toBeInTheDocument()
    expect(screen.getByRole("link", {name: /see more about this post on another page/i})).toBeInTheDocument()
})

// test("delete button works", async () => {
//     // making sure that deleting posts at the home page is handled correctly
//     const history = createMemoryHistory();
//     history.push("/home")
//     const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
//         render(
//         <Router history={history}>
//             <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
//             userId: 1, updateToken: null}}>
//                 <HomePage />
//             </AuthContext.Provider>
//         </Router>
//         )
//     userEvent.click(await screen.findByRole("button", {name:/delete/i}))
//     await waitFor(() => expect(screen.queryByText(/anyone interested in helping me with a django app/i)).not.toBeInTheDocument())
//     expect(screen.getByRole("dialog")).toBeInTheDocument()
//     expect(screen.getByText(/Post successfully deleted!/)).toBeInTheDocument()
//     expect(screen.queryByText('user1')).not.toBeInTheDocument()
//     expect(screen.queryByText('1 day ago')).not.toBeInTheDocument()
//     expect(screen.getAllByRole('article')).toHaveLength(1)
//     expect(screen.queryByText(/number of comments: 7/i)).not.toBeInTheDocument()
//     expect(screen.queryByRole("button", {name: /delete/i})).not.toBeInTheDocument()
//     expect(screen.queryByRole("button", {name:/update/i})).not.toBeInTheDocument()
//     // making sure that posts get fetched from the API when the component is unmounted and then mounted again
//     history.push('/home/account/10')
//     history.push('/home')
//     expect(await screen.findByText(/anyone interested in helping me with a django app/i)).toBeInTheDocument()
//     waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument(), {timeout: 2000})
// })

// test("handling errors from the server while deleting a post - waiting for the dialog to disappear", async() => {
//     // making sure that any error while deleting a post is handled correctly
//     const history = createMemoryHistory();
//     history.push("/home")
//     const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
//     server.use(
//         rest.delete('https://arcane-spire-03245.herokuapp.com/api/services/posts/1/', (req, res, ctx) => {
//           return res.once(
//               ctx.status(500)
//           )
//         }),
//       )
//         render(
//         <Router history={history}>
//             <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
//             userId: 1, updateToken: null}}>
//                 <HomePage />
//             </AuthContext.Provider>
//         </Router>
//         )
//     userEvent.click(await screen.findByRole("button", {name:/delete/i}))
//     expect(await screen.findByRole("dialog")).toBeInTheDocument()
//     expect(screen.getByText("Uppps... something went wrong. Try to delete your post once again.")).toBeInTheDocument()
//     expect(screen.queryByText(/anyone interested in helping me with a django app/i)).toBeInTheDocument()
//     expect(screen.queryByText('user1')).toBeInTheDocument()
//     expect(screen.queryByText('1 day ago')).toBeInTheDocument()
//     expect(screen.getAllByRole('article')).toHaveLength(2)
//     expect(screen.queryByText(/number of comments: 7/i)).toBeInTheDocument()
//     expect(screen.queryByRole("button", {name: /delete/i})).toBeInTheDocument()
//     expect(screen.queryByRole("button", {name:/update/i})).toBeInTheDocument()
//     await waitFor(() => expect(screen.queryByText("Uppps... something went wrong. Try to delete your post once again.")).not.toBeInTheDocument(),
//     {timeout: 5000})

// })

// test("handling errors from the server while deleting a post - dialog should disappear when the user succeeds in deleting the post", async() => {
//     // making sure that any error while deleting a post is handled correctly
//     const history = createMemoryHistory();
//     history.push("/home")
//     const authTokens = {refresh: 'valid-refresh', access: 'valid-access'}
//     server.use(
//         rest.delete('https://arcane-spire-03245.herokuapp.com/api/services/posts/1/', (req, res, ctx) => {
//           return res.once(
//               ctx.status(500)
//           )
//         }),
//       )
//         render(
//         <Router history={history}>
//             <AuthContext.Provider value={{logout: null, initialVerificationSuccessful: false, authTokens: authTokens,
//             userId: 1, updateToken: null}}>
//                 <HomePage />
//             </AuthContext.Provider>
//         </Router>
//         )
//     userEvent.click(await screen.findByRole("button", {name:/delete/i}))
//     expect(await screen.findByRole("dialog")).toBeInTheDocument()
//     expect(screen.getByText("Uppps... something went wrong. Try to delete your post once again.")).toBeInTheDocument()
//     userEvent.click(screen.getByRole("button", {name:/delete/i}))
//     expect(await screen.findByText(/Post successfully deleted!/)).toBeInTheDocument()
//     expect(screen.getAllByRole("dialog")).toHaveLength(1)
//     expect(screen.queryByText(/anyone interested in helping me with a django app/i)).not.toBeInTheDocument()
//     expect(screen.queryByText('user1')).not.toBeInTheDocument()
//     expect(screen.queryByText('1 day ago')).not.toBeInTheDocument()
//     expect(screen.getAllByRole('article')).toHaveLength(1)
//     expect(screen.queryByText(/number of comments: 7/i)).not.toBeInTheDocument()
//     expect(screen.queryByRole("button", {name: /delete/i})).not.toBeInTheDocument()
//     expect(screen.queryByRole("button", {name:/update/i})).not.toBeInTheDocument()
// })

// // another test for links