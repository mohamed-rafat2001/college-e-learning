const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Posts = require('../models/posts')
const Share = require('../models/sharePost')
const auth = require('../middelwares/auth')
const multer = require('multer')
// add post
const upload = multer({})
router.post('/post', auth.user, upload.array('filess', 12), async (req, res) => {
    try {
        const post = new Posts({ ...req.body, userId: req.user })
        for (let i = 0; i < req.files.length; i++) { post.fileUp[i] = req.files[i].buffer }
        await post.save()
        res.send(post)
    } catch (e) {
        res.send(e.message)
    }
})
// get single post
router.get('/post/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id //post id
        const post = await Posts.findByIdAndUpdate(_id, { $inc: { views: 1 } }, { new: true, runValidators: true })
        if (!post) return res.send('no posts founded')
        res.send(await post.populate('comments'))
    } catch (e) {
        res.send(e.message)
    }
})
//update post
router.patch('/post/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id //post id 
        const posts = await Posts.findByIdAndUpdate({ _id, userId: req.user }, req.body, { new: true, runValidators: true })
        if (!posts) return res.send('no posts founded')
        res.send(posts)
    } catch (e) {
        res.send(e.message)
    }
})
//delete post
router.delete('/post/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id // id for post
        const posts = await Posts.findOne({ userId: req.user, _id }).deleteOne()
        if (!posts) return res.send('no posts founded')
        res.send({ posts, message: 'post is deleted' })
    } catch (e) {
        res.send(e.message)
    }
})
//gett all posts
router.get('/posts', auth.user, async (req, res) => {
    try {
        const posts = await Posts.find({})
        res.send(posts)
    } catch (e) {
        res.send(e.message)
    }
})
//get all posts for single user
router.get('/userPosts', auth.user, async (req, res) => {
    try {
        const posts = await Posts.find({ userId: req.user._id })
        if (!posts) return res.send('no posts founded')
        res.send(posts)
    } catch (e) {
        res.send(e.message)
    }
})
//share post
router.post('/sharePost/:id', auth.user, async (req, res) => {
    try {
        const postId = req.params.id //post id 
        const _id = req.user._id //user id
        const shareMod = await Share.findOne({ userId: _id })
        if (!shareMod) {
            const share = new Share({ userId: _id })
            await share.save()
            const sharePO = await Share.findOneAndUpdate({ userId: _id }, { $push: { sharePost: postId } }, { new: true })
            return res.send(sharePO)
        }
        const sharePO = await Share.findOneAndUpdate({ userId: _id }, { $push: { sharePost: postId } }, { new: true })
        res.send(sharePO)
    } catch (e) {
        res.send(e.message)
    }
})
//post like
router.patch('/like/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id //post id
        const likesnum = await Posts.findById(_id)
        const numLike = likesnum.likes
        const len = numLike.length
        const numUnLike = likesnum.unLikes
        const lenUnLike = numUnLike.length
        const liked = numLike.includes(req.user._id.toString())
        if (liked == false) {
            const post = await Posts.findByIdAndUpdate(_id, {
                $push: { likes: req.user._id },
                likesNumber: len + 1,
                $pull: { unLikes: req.user._id },
                unLikesNumber: lenUnLike > 0 ? lenUnLike - 1 : lenUnLike
            }, { new: true })
            return res.send(post)
        }
        else if (liked == true) {

            const post = await Posts.findByIdAndUpdate(_id, {
                $pull: { unLikes: req.user._id },
                unLikesNumber: lenUnLike,
                $pull: { likes: req.user._id },
                likesNumber: len - 1
            }, { new: true })
            return res.send(post)
        }
        else {
            const post = await Posts.findByIdAndUpdate(_id, {
                $pull: { likes: req.user._id },
                likesNumber: len,
                $pull: { unLikes: req.user._id },
                unLikesNumber: lenUnLike,
            }, { new: true })
            res.send(post)
        }

    } catch (e) {
        res.send(e.message)
    }
})
//post unlike
router.patch('/unLike/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id //post id
        const likesnum = await Posts.findById(_id)
        const numLike = likesnum.likes
        const len = numLike.length
        const numUnLike = likesnum.unLikes
        const lenUnLike = numUnLike.length
        const unLiked = numUnLike.includes(req.user._id.toString())
        if (unLiked == false) {
            const post = await Posts.findByIdAndUpdate(_id, {
                $push: { unLikes: req.user._id },
                unLikesNumber: lenUnLike + 1,
                $pull: { likes: req.user._id },
                likesNumber: len
            }, { new: true })
            return res.send(post)
        }
        else if (unLiked == true) {

            const post = await Posts.findByIdAndUpdate(_id, {
                $pull: { likes: req.user._id },
                likesNumber: len,
                $pull: { unLikes: req.user._id },
                unLikesNumber: lenUnLike - 1
            }, { new: true })
            return res.send(post)
        }
        else {
            const post = await Posts.findByIdAndUpdate(_id, {
                $pull: { unLikes: req.user._id },
                unLikesNumber: lenUnLike,
                $pull: { likes: req.user._id },
                likesNumber: len,
            }, { new: true })
            res.send(post)
        }

    } catch (e) {
        res.send(e.message)
    }
})
module.exports = router