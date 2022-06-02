const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('./models/user')
require('dotenv').config()

const app = express()
const urlencodeParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json(), urlencodeParser);

const PORT = process.env.PORT || 5000;

mongoose.connect(
    process.env.DB,
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    }
)
.then(() => {
    console.log("DB connect is successful")
    app.listen(PORT, () => console.log("server was running"))
})
.catch((err) => console.log("Error connected: " + err))

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]?.split(' ')[1]

    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) {
                return res.json({
                    isLoggedIn: false,
                    isError: true,
                    message: "Failed to Authenticate: " + err
                })
            }
            req.user = {
                id: decoded.id,
                email: decoded.email
            }
            next()
        })
    } else {
        res.json({isLoggedIn: false, isError: true, message: "Invalid token"})
    }
}

app.post("/api/registration", (req, res, next) => {
    const user = req.body

    User.findOne({name: user.name})
    .then(name => {
        if(name) {
            res.json({isError: true, message: "This name has took"})
        } else {
            User.findOne({email: user.email})
            .then(email => {
                if(email) {
                    res.json({isError: true, message: "This email has took"})
                } else {
                    bcrypt.hash(user.password, 10).then(encodePassword => {
                        user.password = encodePassword
                        User.create(req.body)
                        .then(() => {
                            res.json({isError: false})
                        })
                        .catch(next)
                    })
                }
            })
        }
    })
})

app.put("/api/login", (req, res, next) => {
    const userForLogin = req.body

    User.findOne({email: userForLogin.email})
    .then(user => {
        if(!user) {
            return res.json({isError: true, message: "Invalid email or password"})
        }
        bcrypt.compare(userForLogin.password, user.password)
        .then(result => {
            if(result) {
                if(user.status === "blocked") {
                    return res.json({isError: true, message: "User is blocked"})
                }

                const payload = {
                    id: user._id,
                    email: user.email
                }

                User.findByIdAndUpdate(user._id, {dateLogin: new Date()})
                .then(() => {
                    jwt.sign(
                        payload,
                        process.env.JWT_SECRET,
                        {expiresIn: 86400},
                        (err, token) => {
                            if(err) {
                                return res.json({isError: true, message: err})
                            }
                            return res.json({
                                isError: false,
                                token: "Bearer " + token
                            })
                        }
                    )
                })
            } else {
                return res.json({isError: true, message: "Invalid email or password"})
            }
        })
    })
})

app.get("/api/users", verifyJWT, (req, res, next) => {
    User.find(
        {}, 
        "_id name email dateRegistration dateLogin status"
    ).then((data) => res.json(data))
    .catch(next)
})

app.get("/api/isUserAuth", verifyJWT, (req, res) => {
    User.findById(req.user.id)
    .then(user => {
        if(user) {
            res.json({
                isLoggedIn: !(user.status === "blocked"),
                email: req.user.email
            })
        } else {
            res.json({isLoggedIn: false})
        }
    })
})

app.delete("/api/user/:_id", verifyJWT, (req, res, next) => {
    User.findByIdAndDelete(req.params._id)
        .then((data) => res.json(data))
        .catch(next)
})

app.put("/api/user/:_id/block", verifyJWT, (req, res, next) => {
    console.log(req.params._id)
    User.findByIdAndUpdate(req.params._id, {status: "blocked"})
        .then((data) => res.json(data))
        .catch(next)
})

app.put("/api/user/:_id/unblock", verifyJWT, (req, res, next) => {
    User.findByIdAndUpdate(req.params._id, {status: "active"})
        .then((data) => res.json(data))
        .catch(next)
})

