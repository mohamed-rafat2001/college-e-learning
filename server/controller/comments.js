const Posts = require('../models/posts')
const Comment = require('../models/comment')
const errorHandler = require('../middelwares/errorHandler')

const addComment = errorHandler(
    async (req, res, next) => {
        const postId = req.params.id //post id
        const userId = req.user._id // user id
        const addComment = new Comment({ ...req.body, postId, userId })
        const post = await Posts.findByIdAndUpdate(postId, { $push: { comments: addComment._id } })
        if (!addComment && !post) {
            const error = appError.Error('not add comment', 'fail', 404)
            return next(error)
        }
        await addComment.save()
        res.status(200).json({ status: 'success', data: addComment })
    }
)
const singleComment = errorHandler(
    async (req, res, next) => {

        const commentId = req.params.id
        const comment = await Comment.findById(commentId)
        await comment.populate('replies')
        await comment.populate('userId')
        if (!comment) {
            const error = appError.Error('comment not found', 'fail', 404)
            return next(error)
        }
        res.status(200).json({ status: 'success', data: comment })

    }
)
const updateComment = errorHandler(
    async (req, res, next) => {

        const _id = req.params.id //comment id 
        const comment = await Comment.findByIdAndUpdate({ _id, userId: req.user._id }, req.body, { new: true, runValidators: true })
        if (!comment) {
            const error = appError.Error('comment not found', 'fail', 404)
            return next(error)
        }
        res.status(200).json({ status: 'success', data: comment })

    }
)
const deleteComment = errorHandler(
    async (req, res, next) => {

        const _id = req.params.id // id for comment
        const comment = await Comment.findOne({ _id, userId: req.user._id }).deleteOne()
        if (!comment) {
            const error = appError.Error('comment not found', 'fail', 404)
            return next(error)
        }
        res.status(200).json({ status: 'success', data: comment })

    }
)
const likeOnComm = errorHandler(
    async (req, res, next) => {

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
            return res.status(200).json({ status: 'success', data: like })

        }
        const like = await Comment.findByIdAndUpdate(_id,
            {
                $pull: { like: req.user._id, disLike: req.user._id },
                likeNum: comment.like.length - 1,
                disLikeNum: comment.disLike.length
            }
            , { new: true, runValidators: true })

        res.status(200).json({ status: 'success', data: like })
    }
)
const disLikeComm = errorHandler(
    async (req, res, next) => {

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

            return res.status(200).json({ status: 'success', data: disLike })

        }

        const disLike = await Comment.findByIdAndUpdate(_id,
            {
                $pull: { like: req.user._id, disLike: req.user._id },
                likeNum: comment.like.length,
                disLikeNum: comment.disLike.length - 1
            }
            , { new: true, runValidators: true })

        res.status(200).json({ status: 'success', data: disLike })
    }
)
module.exports = {
    addComment,
    singleComment,
    updateComment,
    deleteComment,
    likeOnComm,
    disLikeComm
}