const express = require('express')
const router = express.Router()
const auth = require('../middelwares/auth')
const multer = require('multer')
const { singUp,
    profileImg,
    login,
    profile,
    updateProfile,
    deleteAcount,
    forgotPass,
    resetPassword } =
    require('../controller/user')
//singUp
router.post('/singUp', singUp)
// upload user image
const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
            return cb(new Error('please upload your photo'), null)
        }
        cb(null, true)
    }
})
router.post('/profileImg', auth.user, upload.single('avatar'), profileImg)
//login
router.post('/login', login)
//user profile
router.get('/profile', auth.user, profile)
//update user profile
router.patch('/profile', auth.user, updateProfile)
// delete acount
router.delete('/profile', auth.user, deleteAcount)
//forgot password
router.post('/forgotPassword', forgotPass)
//reset password
router.patch('/resetPassword', resetPassword)
module.exports = router