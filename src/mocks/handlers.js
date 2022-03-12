import { rest } from 'msw'
import {API_EMAIL_ALREADY_EXISTS, API_USERNAME_ALREADY_EXISTS} from '../components/SignUp'

export const handlers = [
    rest.post('https://arcane-spire-03245.herokuapp.com/api/user/registration/', (req, res, ctx) => {
    const {email, username, name, surname, password, bio} = req.body
      if(email==='takenemail@mail.com'){    
        return res(
          ctx.status(400),
          ctx.json({
            name: ["Some other error"],
            surname: ["Some other error"],
            password: ["Some other error"],
            email: [API_EMAIL_ALREADY_EXISTS, "Some other error"],
          })
        )
      }else if(email==='invalidemail@mail.com'){
        return res(
          ctx.status(400),
          ctx.json({
            username: ["Some other error"],
            email: ["Invalid format"],
            bio: ["Some other error"]
          })
        )
      }else if(username==="AlreadyTaken"){
        return res(
          ctx.status(400),
          ctx.json({
            name: ["Some other error"],
            surname: ["Some other error"],
            username: [API_USERNAME_ALREADY_EXISTS, "Some other error"]
          })
        )
      }else if(username==="InvalidUsername"){
        return res(
          ctx.status(400),
          ctx.json({
            bio: ["Some other error"],
            username: ["Invalid format"]
          })
        )
      }else if(name==="Invalidname"){
        return res(
          ctx.status(400),
          ctx.json({
            bio: ["Some other error"],
            name: ["Invalid format"]
          })
        )
        
      }else if(surname==="Invalidsurname"){
        return res(
          ctx.status(400),
          ctx.json({
            password: ["Some other error"],
            bio: ["Some other error"],
            surname: ["Invalid format"]
          })
        )
      }else if(password==="InvalidPassword"){
        return res(
          ctx.status(400),
          ctx.json({
            bio: ["Some other error"],
            password: ["Invalid password"]
          })
        )
      }else if(bio==="Invalidbio"){
        return res(
        ctx.status(400),
        ctx.json({
          bio: ["Invalid format"]
        })
        )
      }else if(email==="servererror@mail.com"){
        // server doesn't respond at all
        return res.networkError("")
      }else if(email==="fourohfour@mail.com"){
        // server responds with 404
        return res(
          ctx.status(404)
        )
      }else{
        // if all the sent data is valid, returns a 200 response
        return res(
          ctx.status(201),
          ctx.json({
            email: email,
            username: username,
            name: name,
            surname: surname,
            bio: bio
          })
        )
      }
    }),
    rest.post('https://arcane-spire-03245.herokuapp.com/api/user/token/', (req, res, ctx) => {
      const {email} = req.body
      if(email==='invalid@mail.com'){
        return res(
          ctx.status(401),
          ctx.json({})
        )
      }else if(email==="servererror@mail.com"){
        return res.networkError("")
      }else if(email==="fourohfour@mail.com"){
        return res(
          ctx.status(404)
        )
      }else if(email==='invalidtoken@mail.com'){
        // enables testing the behavior when the refresh token is invalid
        return res(
          ctx.status(200),
          ctx.json({access: 'valid-access', refresh: 'invalid-refresh'})
        )
      }else if(email==="404token@mail.com"){
        return res(
          ctx.status(200),
          ctx.json({access: 'valid-access', refresh: '404'})
        )
      }else if(email==="servererrortoken@mail.com"){
        return res(
          ctx.status(200),
          ctx.json({access: 'valid-access', refresh: 'servererror'})
        )
      }else{
        // responding with valid tokens
        return res(
          ctx.status(200),
          ctx.json({access: 'valid-access', refresh: 'valid-refresh'})
        )
      }
    }),
    rest.post('https://arcane-spire-03245.herokuapp.com/api/user/token/refresh/', (req, res, ctx) => {
      const {refresh} = req.body
      if(refresh==='invalid-refresh'){
        return res(
          ctx.status(401)
        )
      }else if(refresh==='404'){
        return res(
          ctx.status(404)
        )
      }else if(refresh==='servererror'){
        return res.networkError("")
      }else if(refresh==="new-refresh"){
        return res(
          ctx.status(200),
          ctx.json({
            refresh: 'new-new-refresh',
            // another token for testing purposes - checking if the token is updated
            access: 'new-new-access'
          })
        )
      }else{
        return res(
          ctx.status(200),
          ctx.json({
            refresh: 'new-refresh',
            // another token for testing purposes - checking if the token is updated
            access: 'new-access'
          })
        )
      }
    }),
    rest.post('https://arcane-spire-03245.herokuapp.com/api/user/token/verification/', (req, res, ctx) => {
      const {id, token} = req.body
      if(token==="servererror"){
        return res.networkError("")
      }else if(token==="invalid"){
        return res(
          ctx.status(401)
        )
      }else if(token === "404"){
        return res(
          ctx.status(404)
        )
      }else{
        return res(
          ctx.status(200),
          ctx.json({
            access: 'valid-access',
            refresh: 'valid-refresh'
          })
        )
      }
    }),
    rest.post('https://arcane-spire-03245.herokuapp.com/api/user/token/blacklist/', (req, res, ctx) => {
      const {refresh} = req.body
      if(refresh==='servererror'){
        return res.networkError("")
      }else if(refresh==='invalid-refresh'){
        return res(
          ctx.status(400),
        )
      }else{
        return res(
          ctx.status(200)
        )
      }
    }),
    rest.get('https://arcane-spire-03245.herokuapp.com/api/services/posts/', (req, res, ctx) => {
      const userId = req.url.searchParams.get('user__id')
      if (req.headers._headers.authorization === "Bearer valid-access"){
        if (userId === null){
          return res(
            ctx.status(200),
            ctx.json([
              {
                  "id": 1,
                  "text": "Is anyone interested in helping me with a django app? I have some problems with creating an API. Filtering doesn't work for some reason. I would also love to talk to somebody experienced and would be glad if somebody could assess my work. I would love to be a better software developer",
                  "user": {
                      "username": "user1",
                      "id": 1
                  },
                  "time_since_posted": "1 day ago",
                  "engagement_rate": 7
              },
              {
                  "id": 2,
                  "text": "Is anyone creating a Java app? I'm willing to help out!",
                  "user": {
                      "username": "user2",
                      "id": 2
                  },
                  "time_since_posted": "2 days ago",
                  "engagement_rate": 3
              }
            ])
          )
        }else if (userId === "1"){
          return res(
            ctx.status(200),
            ctx.json([
              {
                  "id": 1,
                  "text": "Is anyone interested in helping me with a django app?",
                  "user": {
                      "username": "user1",
                      "id": 1
                  },
                  "time_since_posted": "1 day ago",
                  "engagement_rate": 7
              }
            ])
          )
        }else{
          return res(
            ctx.status(200),
            ctx.json([])
          )
        }
      }else{
        return res(
          ctx.status(401)
        )
      }
    }),
    rest.get('https://arcane-spire-03245.herokuapp.com/api/services/posts/1/', (req, res, ctx) => {
      if (req.headers._headers.authorization === "Bearer valid-access"){
        return res(
          ctx.status(200),
          ctx.json({
            "user": {
                "username": "user1",
                "id": 1
            },
            "text": "Is anyone interested in helping me with a django app? I have some problems with creating an API. Filtering doesn't work for some reason. I would also love to talk to somebody experienced and would be glad if somebody could assess my work. I would love to be a better software developer",
            "time_since_posted": "3 hours ago",
            "comments": [
                {
                    "id": 2,
                    "user": {
                        "username": "user2",
                        "id": 2
                    },
                    "text": "Of course. I'm always willing to help",
                    "time_since_posted": "2 hours ago",
                    "replies": []
                },
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
                      }
                    ]
                }
            ]
        })
        )
      }else{
        return res(
          ctx.status(401)
        )
      }

    }),
    rest.delete('https://arcane-spire-03245.herokuapp.com/api/services/posts/1/', (req, res, ctx) => {
      if (req.headers._headers.authorization === "Bearer valid-access"){
        return res(
          ctx.status(204)
        )
      }
    }),
    rest.post('https://arcane-spire-03245.herokuapp.com/api/services/posts/', (req, res, ctx) => {
      if (req.headers._headers.authorization === "Bearer valid-access"){
        const {text} = req.body 
        if (text === "Some invalid post some invalid post some invalid post"){
          return res(
            ctx.status(400)
          )
        }else{
          return res(
            ctx.status(201)
          )
        }
      }
    }),
    rest.put('https://arcane-spire-03245.herokuapp.com/api/services/posts/10/', (req, res, ctx) => {
      if (req.headers._headers.authorization === "Bearer valid-access"){
        const {text} = req.body
        if (text === "Some invalid post some invalid post some invalid post"){
          return res(
            ctx.status(400)
          )
        }else{
          return res(
            ctx.status(200)
          )
        }
      }
    }),
    rest.post('https://arcane-spire-03245.herokuapp.com/api/services/posts/1/comments/add/', (req, res, ctx) => {
      if (req.headers._headers.authorization === "Bearer valid-access"){
        const {text} = req.body
        if(text==="invalid comment" || text.trim()===""){
          return res(
            ctx.status(400)
          )
        }else if(text==="some error"){
          return res.networkError("")
        }else{
          return res(
            ctx.status(201),
            ctx.json({
              text: text,
              id: 20000
            })
          )
        }
      }
    }),
    rest.post('https://arcane-spire-03245.herokuapp.com/api/services/posts/comments/5/replies/add/', (req, res, ctx) => {
      if (req.headers._headers.authorization === "Bearer valid-access"){
        const {text} = req.body
        if(text==="invalid reply" || text.trim()===""){
          return res(
            ctx.status(400)
          )
        }else if(text==="some error"){
          return res(
            ctx.status(401)
          )
        }else{
          return res(
            ctx.status(201),
            ctx.json({
              text: text,
              id: 25
            })
          )
        }
      }
    }),
    rest.post('https://arcane-spire-03245.herokuapp.com/api/services/posts/comments/20000/replies/add/', (req, res, ctx) => {
      // testing the functionality of adding a reply to a newly created comment (this comment should be
      // created with id 20000)
      if (req.headers._headers.authorization === "Bearer valid-access"){
        const {text} = req.body
        if(text==="invalid reply"){
          return res(
            ctx.status(400)
          )
        }else if(text==="some error"){
          return res(
            ctx.status(401)
          )
        }else{
          return res(
            ctx.status(201),
            ctx.json({
              text: text,
              id: 20
            })
          )
        }
      }
    }),
    rest.get('https://arcane-spire-03245.herokuapp.com/api/services/posts/10/basic/', (req, res, ctx) => {
      if (req.headers._headers.authorization === "Bearer valid-access"){
        return res(
          ctx.status(200),
          ctx.json({
            "id": 10,
            "user": {
                "username": "User1",
                "id": 7
            },
            "text": "Valid post valid post valid post.",
            "time_since_posted": "1 hour ago"
        })
        )
      }
    }),
    rest.get("https://arcane-spire-03245.herokuapp.com/api/user/1/", (req, res, ctx) => {
      if (req.headers._headers.authorization === "Bearer valid-access"){
        return res(
          ctx.status(200),
          ctx.json({
            "username": "user1",
            "id": 1,
            "email": "user1@mail.com",
            "name": "User",
            "surname": "First",
            "bio": ""
          })
        )
      }
    }),
    rest.get("https://arcane-spire-03245.herokuapp.com/api/user/2/", (req, res, ctx) => {
      if (req.headers._headers.authorization === "Bearer valid-access"){
        return res(
          ctx.status(200),
          ctx.json({
            "username": "user2",
            "id": 2,
            "email": "user2@mail.com",
            "name": "User",
            "surname": "Second",
            "bio": "Hiiiiiiii!"
          })
        )
      }
    }),
    rest.get("https://arcane-spire-03245.herokuapp.com/api/user/3/", (req, res, ctx) => {
      if (req.headers._headers.authorization === "Bearer valid-access"){
        return res(
          ctx.status(404),
          ctx.json({
            message: "This user does not exist."
          })
        )
      }
    })
  ]

