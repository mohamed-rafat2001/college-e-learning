const User = require('../models/user')
const jwt = require("jsonwebtoken")
const appError = require('../utils/appError')
const user =
    async (req, res, next) => {
        const authToken = req.header('Authorization')
        if (!authToken) {
            const error = appError.Error('token is required', 'fail', 401)
            return next(error)
        }
        const token = authToken.replace('Bearer ', '')
        try {
            const verifyToken = jwt.verify(token, process.env.USER_KEY_TOKEN)
            const user = await User.findById(verifyToken.id)
            req.user = user
            next()
        }

        catch (e) {
            const error = appError.Error('invalid token', 'fail', 401)
            return next(error)
        }


    }
const allowTo = (...roles) => {
    return async (req, res, next) => {
        const admins = await User.find({ role: 'admin' })
        if (!roles.includes(req.user.role)) {
            const error = appError.Error('you not authorize', 'fail', 401)
            return next(error)
        }
        req.admins = admins
        next()

    }
}

module.exports = { user, allowTo }