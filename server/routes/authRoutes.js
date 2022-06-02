const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../models/user')
const verifyJWT = require('../verifyJWT')

require('dotenv').config()

const router = express.Router()

router.post("/api/registration", (req, res, next) => {
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

router.put("/api/login", (req, res, next) => {
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

router.get("/api/isUserAuth", verifyJWT, (req, res) => {
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

module.exports = router