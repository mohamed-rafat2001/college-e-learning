const User = require('../models/user')
const Posts = require('../models/posts')
const Share = require('../models/sharePost')
const bcryptjs = require('bcryptjs')
const errorHandler = require('../middelwares/errorHandler')
const appError = require('../utils/appError')
const Email = require('../utils/sendEmail')
const singUp = errorHandler(
    async (req, res, next) => {
        const user = new User(req.body)
        const token = user.creatToken()
        await user.save()
        res.status(200).send({ user, token })

    })
const profileImg = errorHandler(async (req, res, next) => {
    req.user.image = req.file.buffer
    await req.user.save()
    res.status(200).send(req.user)
})
const login = errorHandler(
    async (req, res, next) => {
        const email = req.body.email
        const user = await User.findOne({ email })
        if (!user) {
            const error = appError.Error('email or password is wrong', 'fail', 404)
            return next(error)
        }
        const pass = await bcryptjs.compare(req.body.password, user.password)
        if (!pass) {
            const error = appError.Error('email or password is wrong', 'fail', 404)
            return next(error)
        }
        const token = user.creatToken()
        res.send({ status: 'success', data: { user, token } })

    }
)
const profile = errorHandler(
    async (req, res, next) => {
        const query = req.query
        const limit = query.limit || 2
        const page = query.page || 1
        const skip = (page - 1) * limit
        const share = await Share.find({ userId: req.user._id }, { 'sharePost': true, '_id': false }).limit(limit).skip(skip).populate('sharePost')
        const posts = await Posts.find({ userId: req.user._id }).limit(limit).skip(skip)
        delete req.user.__v
        res.send({ user: req.user, posts: [...share, ...posts] })
    }
)
const updateProfile = errorHandler(
    async (req, res, next) => {
        const updates = Object.keys(req.body)
        updates.forEach(el => req.user[el] = req.body[el]);
        await req.user.save()
        res.send(req.user)
    }
)
const deleteAcount = errorHandler(
    async (req, res, next) => {
        const user = await User.deleteOne(req.user)
        if (!user) {
            const error = appError.Error('user not founded', 'fail', 404)
            return next(error)
        }
        res.send(user)
    }
)
const forgotPass = errorHandler(
    async (req, res, next) => {

        const email = req.body.email
        const user = await User.findOne({ email })
        if (user) {
            Email(user)
        }
        await user.save()
        res.send({ message: 'please check your email' })
    }
)
const resetPassword = errorHandler(
    async (req, res, next) => {
        const passwordResetToken = req.body.code
        const user = await User.findOne({ passwordResetToken })
        if (!user) {
            const error = appError.Error('invalid code', 'fail', 500)
            return next(error)
        }
        user.password = req.body.password
        user.passwordResetToken = ""
        const token = user.creatToken()
        await user.save()
        res.send({ user, token })
    }
)
module.exports = {
    singUp,
    profileImg,
    login,
    profile,
    updateProfile,
    deleteAcount,
    forgotPass,
    resetPassword,
}