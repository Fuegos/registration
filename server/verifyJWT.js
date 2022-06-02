const jwt = require('jsonwebtoken')

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

module.exports = verifyJWT