const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./models/user')
require('dotenv').config()

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(
    process.env.DB,
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    }
)
.then(() => console.log("Connect is successful"))
.catch((err) => console.log("Error connected: " + err))


app.post("/api/user", (req, res, next) => {
    User.create(req.body)
        .then((data) => res.json(data))
        .catch(next)
})

app.put("/api/user/:_id/login", (req, res, next) => {
    User.findByIdAndUpdate(req.params._id, {dateLogin: new Date()})
        .then((data) => res.json(data))
        .catch(next)
})

app.get("/api/users", (req, res, next) => {
    User.find(
        {}, 
        "_id name email dateRegistration dateLogin status"
    ).then((data) => res.json(data))
    .catch(next)
})

app.delete("/api/user/:_id", (req, res, next) => {
    User.findByIdAndDelete(req.params._id)
        .then((data) => res.json(data))
        .catch(next)
})

app.put("/api/user/:_id/block", (req, res, next) => {
    User.findByIdAndUpdate(req.params._id, {status: "blocked"})
        .then((data) => res.json(data))
        .catch(next)
})

app.put("/api/user/:_id/unblock", (req, res, next) => {
    User.findByIdAndUpdate(req.params._id, {status: "active"})
        .then((data) => res.json(data))
        .catch(next)
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});