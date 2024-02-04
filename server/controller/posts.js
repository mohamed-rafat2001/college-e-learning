const Posts = require('../models/posts')
const Share = require('../models/sharePost')
const cloudinary = require('../utils/cloudinary')
const errorHandler = require('../middelwares/errorHandler')

const addPost = errorHandler(
    async (req, res, next) => {
        const files = []
        for (const file of req.files) {
            const { public_id, secure_url } = await cloudinary.uploader.upload(file.path,
                { folder: `e-Learning/user/${req.user._id}/posts` })
            files.push({ public_id, secure_url })
        }
        const post = new Posts({ ...req.body, userId: req.user, fileUp: files })
        if (!post) {
            const error = appError.Error('not add post', 'fail', 404)
            return next(error)
        }
        await post.save()
        res.status(200).json({ status: 'success', data: post })
    }
)
const singlePost = errorHandler(
    async (req, res, next) => {
        const _id = req.params.id //post id
        const post = await Posts.findByIdAndUpdate(_id, { $inc: { views: 1 } }, { new: true, runValidators: true })
        if (!post) {
            const error = appError.Error('post not found', 'fail', 404)
            return next(error)
        }
        await post.populate('comments')
        res.status(200).json({ status: 'success', data: post })

    }
)
const updatePost = errorHandler(
    async (req, res, next) => {

        const _id = req.params.id //post id 
        const posts = await Posts.findByIdAndUpdate({ _id, userId: req.user }, req.body, { new: true, runValidators: true })
        if (!posts) {
            const error = appError.Error('post not found', 'fail', 404)
            return next(error)
        }
        res.status(200).json({ status: 'success', data: posts })

    }
)
const deletePost = errorHandler(
    async (req, res, next) => {
        const _id = req.params.id // id for post
        const posts = await Posts.findOne({ userId: req.user, _id }).deleteOne()
        if (!posts) {
            const error = appError.Error('post not found', 'fail', 404)
            return next(error)
        }
        res.status(200).json({ status: 'success', data: posts })
    }
)
const allPosts = errorHandler(
    async (req, res, next) => {
        const posts = await Posts.find({})
        if (!posts) {
            const error = appError.Error('post not found', 'fail', 404)
            return next(error)
        }
        res.status(200).json({ status: 'success', data: posts })

    }
)
const postsForUser = errorHandler(
    async (req, res, next) => {

        const posts = await Posts.find({ userId: req.user._id })
        if (!posts) {
            const error = appError.Error('post not found', 'fail', 404)
            return next(error)
        }
        res.status(200).json({ status: 'success', data: posts })

    }
)
const sharePost = errorHandler(
    async (req, res, next) => {
        const postId = req.params.id //post id 
        const _id = req.user._id //user id
        const sharePO = new Share({ userId: _id, sharePost: postId })
        if (!sharePO) {
            const error = appError.Error('not shared', 'fail', 404)
            return next(error)
        }
        await sharePO.save()
        res.status(200).json({ status: 'success', data: sharePO })
    }
)
const likeOnPost = errorHandler(
    async (req, res, next) => {
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
            return res.status(200).json({ status: 'success', data: post })

        }
        else if (liked == true) {

            const post = await Posts.findByIdAndUpdate(_id, {
                $pull: { unLikes: req.user._id },
                unLikesNumber: lenUnLike,
                $pull: { likes: req.user._id },
                likesNumber: len - 1
            }, { new: true })
            return res.status(200).json({ status: 'success', data: post })

        }
        else {
            const post = await Posts.findByIdAndUpdate(_id, {
                $pull: { likes: req.user._id },
                likesNumber: len,
                $pull: { unLikes: req.user._id },
                unLikesNumber: lenUnLike,
            }, { new: true })
            res.status(200).json({ status: 'success', data: post })

        }


    }
)
const unLikeOnPost = errorHandler(
    async (req, res, next) => {
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
            return res.status(200).json({ status: 'success', data: post })
        }
        else if (unLiked == true) {

            const post = await Posts.findByIdAndUpdate(_id, {
                $pull: { likes: req.user._id },
                likesNumber: len,
                $pull: { unLikes: req.user._id },
                unLikesNumber: lenUnLike - 1
            }, { new: true })
            return res.status(200).json({ status: 'success', data: post })
        }
        else {
            const post = await Posts.findByIdAndUpdate(_id, {
                $pull: { unLikes: req.user._id },
                unLikesNumber: lenUnLike,
                $pull: { likes: req.user._id },
                likesNumber: len,
            }, { new: true })
            res.status(200).json({ status: 'success', data: post })
        }
    }
)
module.exports = {
    addPost,
    singlePost,
    updatePost,
    deletePost,
    allPosts,
    postsForUser,
    sharePost,
    likeOnPost,
    unLikeOnPost
}