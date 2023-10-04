const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Comment = require('../models/comment')
const Replay = require('../models/replay')
const auth = require('../middelwares/auth')
// add comment
router.post('/addReplay/:id', auth.user, async (req, res) => {
    try {
        const commentId = req.params.id //comment id
        const userId = req.user._id // user id
        const addReplay = new Replay({ ...req.body, commentId, userId })
        await addReplay.save()
        const post = await Comment.findByIdAndUpdate(commentId, { $push: { replies: addReplay._id } })
        res.send(addReplay)
    } catch (e) {
        res.send(e.message)
    }
})
// single replay
router.get('/replay/:id', auth.user, async (req, res) => {
    try {
        const replayId = req.params.id
        const replay = await Replay.findById(replayId)
        await replay.populate('userId')
        res.send(replay)
    } catch (e) {
        res.send(e.message)
    }
})
//update post
router.patch('/replay/update/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id //replay id 
        const replay = await Replay.findByIdAndUpdate({ _id, userId: req.user._id }, req.body, { new: true, runValidators: true })
        if (!replay) return res.send({ message: 'no comment founded' })
        res.send(replay)
    } catch (e) {
        res.send(e.message)
    }
})
//delete post
router.delete('/replay/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id // id for comment
        const replay = await Replay.findOne({ _id, userId: req.user._id }).deleteOne()
        if (!replay) return res.send({ message: 'no replay founded' })
        res.send({ replay, message: 'replay is deleted' })
    } catch (e) {
        res.send(e.message)
    }
})
// like comment
router.patch('/replay/like/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id // comment id
        const replay = await Replay.findById(_id)
        const isLiked = replay.like.find(el => el == req.user._id.toString())
        if (!isLiked) {
            const like = await Replay.findByIdAndUpdate(_id,
                {
                    $push: { like: req.user._id },
                    $pull: { disLike: req.user._id }
                    , likeNum: replay.like.length + 1,
                    disLikeNum: replay.disLike.length > 0 ? replay.disLike.length - 1 : replay.disLike.length
                }
                , { new: true, runValidators: true })
            return res.send(like)
        }
        else if (isLiked) {
            const like = await Replay.findByIdAndUpdate(_id,
                {
                    $pull: { like: req.user._id, disLike: req.user._id },
                    likeNum: replay.like.length - 1,
                    disLikeNum: replay.disLike.length
                }
                , { new: true, runValidators: true })
            return res.send(like)
        }
        res.send(replay.like.length)

    }
    catch (e) {
        res.send(e.message)
    }
})
// dislike for post
router.patch('/replay/disLike/:id', auth.user, async (req, res) => {
    try {
        const _id = req.params.id // post id
        const replay = await Replay.findById(_id)
        const isDisLiked = replay.disLike.find(el => el == req.user._id.toString())
        if (!isDisLiked) {
            const disLike = await Replay.findByIdAndUpdate(_id,
                {
                    $pull: { like: req.user._id },
                    $push: { disLike: req.user._id }
                    , disLikeNum: replay.disLike.length + 1,
                    likeNum: replay.like.length > 0 ? replay.like.length - 1 : replay.like.length
                }
                , { new: true, runValidators: true })
            return res.send(disLike)
        }
        else if (isDisLiked) {
            const disLike = await Replay.findByIdAndUpdate(_id,
                {
                    $pull: { like: req.user._id, disLike: req.user._id },
                    likeNum: replay.like.length,
                    disLikeNum: replay.disLike.length - 1
                }
                , { new: true, runValidators: true })
            return res.send(disLike)
        }
        res.send(replay.disLike.length)

    }
    catch (e) {
        res.send(e.message)
    }
})
module.exports = router