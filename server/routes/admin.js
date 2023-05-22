const express = require('express')
const router = express.Router()
const auth = require('../middelwares/auth')
const User = require('../models/user')
const Posts = require('../models/posts')
// get all admins
router.get('/allAdmins', auth.user, auth.admin, async (req, res) => {
    try {
        if (!req.admins) return res.send('not admin founded')
        res.send(req.admins)
    } catch (e) {
        res.send(e.message)
    }
})
// get all users
router.get('/allUsers', auth.user, auth.admin, async (req, res) => {
    try {
        const users = await User.find({ role: 'user' })
        if (!users) return res.send('not users founded')
        res.send(users)
    } catch (e) {
        res.send(e.message)
    }
})
//get single user
router.get('/user', auth.user, auth.admin, async (req, res) => {
    try {
        const query = req.query
        const user = await User.findOne(query)
        if (!user) return res.send('not user founded')
        res.send(user)
    } catch (e) {
        res.send(e.message)
    }
})
//delete user
router.delete('/user/:id', auth.user, auth.admin, async (req, res) => {
    try {
        const _id = req.params.id
        const user = await User.findByIdAndDelete(_id)
        if (!user) return res.send('not user founded')
        res.send({ user, message: 'user is deleted' })
    } catch (e) {
        res.send(e.message)
    }
})
//block && unBlock user
router.patch('/blockUser/:id', auth.user, auth.admin, async (req, res) => {
    try {
        const _id = req.params.id
        const findUser = await User.findById(_id)
        if (findUser.block === false) {
            const user = await User.findByIdAndUpdate(_id, { block: true }, { runValidators: true, new: true })
            return res.send({ user, message: 'user is blocked' })
        }
        else {
            const user = await User.findByIdAndUpdate(_id, { block: false }, { runValidators: true, new: true })
            res.send({ user, message: 'user is unBlocked' })
        }

    } catch (e) {
        res.send(e.message)
    }


})
// get all posts

module.exports = router