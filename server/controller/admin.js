const User = require('../models/user')
const Posts = require('../models/posts')
const errorHandler = require('../middelwares/errorHandler')
const appError = require('../utils/appError')
const Admins = errorHandler(
    async (req, res, next) => {
        if (!req.admins) {
            return next(appError.Error('not admin founded', 'fail', 404))
        }
        res.status(200).json({ status: 'success', data: req.admins })

    }
)
const Users = errorHandler(
    async (req, res, next) => {
        const users = await User.find({ role: 'user' })
        if (!users) {
            return next(appError.Error('not users founded', 'fail', 404))
        }
        res.status(200).json({ status: 'success', data: users })

    }
)
const singleUser = errorHandler(
    async (req, res, next) => {
        const query = req.query
        const user = await User.findOne(query)
        if (!user) {
            return next(appError.Error('not user founded', 'fail', 404))
        }
        res.status(200).json({ status: 'success', data: user })

    }
)
const deleteUser = errorHandler(
    async (req, res) => {
        const _id = req.params.id
        const user = await User.findByIdAndDelete(_id)
        if (!user) {
            return next(appError.Error('not user founded', 'fail', 404))
        }
        res.status(200).json({ status: 'success', data: "user deleted" })

    }
)
const blockAndUnblock = errorHandler(
    async (req, res) => {
        const _id = req.params.id
        const findUser = await User.findById(_id)
        if (findUser.block === false) {
            const user = await User.findByIdAndUpdate(_id, { block: true }, { runValidators: true, new: true })
            return res.status(200).json({ status: 'success', data: "user blocked" })
        }
        else {
            const user = await User.findByIdAndUpdate(_id, { block: false }, { runValidators: true, new: true })
            res.status(200).json({ status: 'success', data: "user unBlocked" })
        }


    }
)
module.exports = {
    Admins,
    Users,
    singleUser,
    deleteUser,
    blockAndUnblock
}