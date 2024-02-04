const express = require('express')
const router = express.Router()
const auth = require('../middelwares/auth')
const uniqid = require('uniqid')
const fileValidation = {
    image: ['image/jpg', 'image/jpeg ', 'image/png', 'image/jfif'],
    file: ['application/pdf', 'application/wsword']
}
const fileUpload = require('../utils/multer')
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
router.post('/profileImg', auth.user, fileUpload(fileValidation.image).single('avatar'), profileImg)
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