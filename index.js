const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const authRoutes = require('./server/routes/authRoutes')
const userRoutes = require('./server/routes/userRoute')

require('dotenv').config()

const app = express()

const urlencodeParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json(), urlencodeParser);

app.use(express.static(path.join(__dirname, 'client/build')));

app.use("/", authRoutes)
app.use("/", userRoutes)

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


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
  