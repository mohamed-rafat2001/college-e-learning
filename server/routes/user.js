const express = require('express')
const router = express.Router()
const User = require('../models/user')
const auth = require('../middelwares/auth')
const bcryptjs = require('bcryptjs')
const nodemailer = require('nodemailer')
const multer = require('multer')
//singUp
router.post('/singUp', async (req, res) => {
    try {
        const user = new User(req.body)
        const token = user.creatToken()
        await user.save()
        return res.send({ user, token })
    }
    catch (e) {
        res.send(e.message)
    }
})
// upload user image
const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
            return cb(new Error('please upload your photo'), null)
        }
        cb(null, true)
    }
})
router.post('/profileImg', auth.user, upload.single('avatar'), async (req, res) => {
    try {
        req.user.image = req.file.buffer
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.send(e.message)
    }
})
//login
router.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const user = await User.findOne({ email })
        if (!user) return res.send('email or password is wrong')
        const pass = await bcryptjs.compare(req.body.password, user.password)
        if (!pass) return res.send('email or password is wrong')
        const token = user.creatToken()
        res.send({ user, token })
    } catch (e) {
        res.send(e.message)
    }
})
//user profile
router.get('/profile', auth.user, async (req, res) => {
    try {
        res.send(req.user)

    } catch (e) {
        res.send(e.message)
    }
})
//update user profile
router.patch('/profile', auth.user, async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        updates.forEach(el => req.user[el] = req.body[el]);
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.send(e.message)
    }
})
// delete acount
router.delete('/profile', auth.user, async (req, res) => {
    try {
        const user = await User.deleteOne(req.user)
        res.send(user)
    }
    catch (e) {
        res.send(e.message)
    }
})
//forgot password
router.post('/forgotPassword', async (req, res) => {
    try {
        const email = req.body.email
        const user = await User.findOne({ email })
        const token = user.passwordToken()
        user.passwordResetToken = token
        if (user) {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.MAIL_ID, // generated ethereal user
                    pass: process.env.MP
                    , // generated ethereal password
                },
            });

            // send mail with defined transport object

            let info = await transporter.sendMail({
                from: '"mohamed 👻" <college@gmail.com>', // sender address
                to: user.email, // list of receivers
                subject: "forgot password", // Subject line
                text: `hey ${user.firstName + user.lastName}`, // plain text body
                html: `follow this url to reset password \n <a href='http://localhost:5000/resetPassword/${token} '>click here</a>`, // html body
            });
        }
        else {
            res.send('no user founded')
        }
        await user.save()
        res.send('please check your email')


    } catch (e) {
        res.send(e.message)
    }
})
//reset password
router.patch('/resetPassword/:token', async (req, res) => {
    try {
        const passwordResetToken2 = req.params.token
        const user = await User.findOne({ passwordResetToken: passwordResetToken2 })
        if (!user) return res.send('you not user')
        user.password = req.body.password
        user.passwordResetToken = ""
        const token = user.creatToken()
        await user.save()
        res.send({ user, token })
    }
    catch (e) {
        res.send(e.message)
    }

})
module.exports = router