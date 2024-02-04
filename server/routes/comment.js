const express = require('express')
const router = express.Router()
const auth = require('../middelwares/auth')
const {
    addComment,
    singleComment,
    updateComment,
    deleteComment,
    likeOnComm,
    disLikeComm
} = require('../controller/comments')
// add comment
router.post('/addComment/:id', auth.user, addComment)
// single comment 
router.get('/comment/:id', auth.user, singleComment)
//update comment
router.patch('/comment/update/:id', auth.user, updateComment)
//delete comment
router.delete('/comment/:id', auth.user, deleteComment)
// like comment
router.patch('/comment/like/:id', auth.user, likeOnComm)
// dislike for post
router.patch('/comment/disLike/:id', auth.user, disLikeComm)
module.exports = router