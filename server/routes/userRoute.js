const express = require('express')

const User = require('../models/user')
const verifyJWT = require('../verifyJWT')

const router = express.Router()

router.get("/api/users", verifyJWT, (req, res, next) => {
    User.find(
        {}, 
        "_id name email dateRegistration dateLogin status"
    ).then((data) => res.json(data))
    .catch(next)
})

router.delete("/api/user/:_id", verifyJWT, (req, res, next) => {
    User.findByIdAndDelete(req.params._id)
        .then((data) => res.json(data))
        .catch(next)
})

router.put("/api/user/:_id/block", verifyJWT, (req, res, next) => {
    console.log(req.params._id)
    User.findByIdAndUpdate(req.params._id, {status: "blocked"})
        .then((data) => res.json(data))
        .catch(next)
})

router.put("/api/user/:_id/unblock", verifyJWT, (req, res, next) => {
    User.findByIdAndUpdate(req.params._id, {status: "active"})
        .then((data) => res.json(data))
        .catch(next)
})

module.exports = router