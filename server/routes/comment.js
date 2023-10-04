const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Posts = require('../models/posts')
const Comment = require('../models/comment')
const auth = require('../middelwares/auth')
// add comment
router.post('/addComment/:id', auth.user, async (req, res) => {
    try {
        const postId = req.params.id //post id
        const userId = req.user._id // user id
        const addComment = new Comment({ ...req.body, postId, userId })
        await addComment.save()
        const post = await Posts.findByIdAndUpdate(postId, { $push: { comments: addComment._id } })
        res.send(addComment)
    } catch (e) {
        res.send(e.message)
    }
})
// single comment 
router.get('/comment/:id', auth.user, async (req, res) => {
    try {
        const commentId = req.params.id
        const comment = await Comment.findById(commentId)
        await comment.populate('replies')
        await comment.populate('userId')
        res.send(comment)
    } catch (e) {
        res.send(e.message)
    }
})
//update comment
router.patch('/comment/update/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id //comment id 
        const comment = await Comment.findByIdAndUpdate({ _id, userId: req.user._id }, req.body, { new: true, runValidators: true })
        if (!comment) return res.send({ message: 'no comment founded' })
        res.send(comment)
    } catch (e) {
        res.send(e.message)
    }
})
//delete comment
router.delete('/comment/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id // id for comment
        const comment = await Comment.findOne({ _id, userId: req.user._id }).deleteOne()
        if (!comment) return res.send({ message: 'no comment founded' })
        res.send({ comment, message: 'post is deleted' })
    } catch (e) {
        res.send(e.message)
    }
})
// like comment
router.patch('/comment/like/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id // comment id
        const comment = await Comment.findById(_id)
        const isLiked = comment.like.find(el => el == req.user._id.toString())
        if (!isLiked) {
            const like = await Comment.findByIdAndUpdate(_id,
                {
                    $push: { like: req.user._id },
                    $pull: { disLike: req.user._id }
                    , likeNum: comment.like.length + 1,
                    disLikeNum: comment.disLike.length > 0 ? comment.disLike.length - 1 : comment.disLike.length
                }
                , { new: true, runValidators: true })
            return res.send(await like.populate('like'))
        }
        else if (isLiked) {
            const like = await Comment.findByIdAndUpdate(_id,
                {
                    $pull: { like: req.user._id, disLike: req.user._id },
                    likeNum: comment.like.length - 1,
                    disLikeNum: comment.disLike.length
                }
                , { new: true, runValidators: true })
            return res.send(await like.populate('like'))
        }
        res.send(comment.like.length)

    }
    catch (e) {
        res.send(e.message)
    }
})
// dislike for post
router.patch('/comment/disLike/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id // post id
        const comment = await Comment.findById(_id)
        const isDisLiked = comment.disLike.find(el => el == req.user._id.toString())
        if (!isDisLiked) {
            const disLike = await Comment.findByIdAndUpdate(_id,
                {
                    $pull: { like: req.user._id },
                    $push: { disLike: req.user._id }
                    , disLikeNum: comment.disLike.length + 1,
                    likeNum: comment.like.length > 0 ? comment.like.length - 1 : comment.like.length
                }
                , { new: true, runValidators: true })
            return res.send(await disLike.populate('disLike'))
        }
        else if (isDisLiked) {
            const disLike = await Comment.findByIdAndUpdate(_id,
                {
                    $pull: { like: req.user._id, disLike: req.user._id },
                    likeNum: comment.like.length,
                    disLikeNum: comment.disLike.length - 1
                }
                , { new: true, runValidators: true })
            return res.send(await disLike.populate('disLike'))
        }
        res.send(comment.disLike.length)

    }
    catch (e) {
        res.send(e.message)
    }
})
module.exports = router