const express = require('express')
const router = express.Router()
const auth = require('../middelwares/auth')
const { Admins,
    Users,
    singleUser,
    deleteUser,
    blockAndUnblock
} =
    require('../controller/admin')
// get all admins
router.get('/allAdmins', auth.user, auth.allowTo('admin'), Admins)
// get all users
router.get('/allUsers', auth.user, auth.allowTo('admin'), Users)
//get single user
router.get('/user', auth.user, auth.allowTo('admin'), singleUser)
//delete user
router.delete('/user/:id', auth.user, auth.allowTo('admin'), deleteUser)
//block && unBlock user
router.patch('/blockUser/:id', auth.user, auth.allowTo('admin'), blockAndUnblock)
// get all posts

module.exports = router