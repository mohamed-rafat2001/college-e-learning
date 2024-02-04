const express = require('express')
const router = express.Router()
const auth = require('../middelwares/auth')
const fileUpload = require('../utils/multer')
const {
    addPost,
    singlePost,
    updatePost,
    deletePost,
    allPosts,
    postsForUser,
    sharePost,
    likeOnPost,
    unLikeOnPost } = require('../controller/posts')
const fileValidation = {
    image: ['image/jpg', 'image/jpeg ', 'image/png', 'image/jfif'],
    file: ['application/pdf', 'application/wsword']
}
// add post
router.post('/post', auth.user, fileUpload(fileValidation.image).array('filess', 12), addPost)
// get single post
router.get('/post/:id', auth.user, singlePost)
//update post
router.patch('/post/:id', auth.user, updatePost)
//delete post
router.delete('/post/:id', auth.user, deletePost)
//gett all posts
router.get('/posts', auth.user, allPosts)
//get all posts for single user
router.get('/userPosts', auth.user, postsForUser)
//share post
router.post('/sharePost/:id', auth.user, sharePost)
//post like
router.patch('/like/:id', auth.user, likeOnPost)
//post unlike
router.patch('/unLike/:id', auth.user, unLikeOnPost)
module.exports = router