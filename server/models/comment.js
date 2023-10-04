const mongoose = require('mongoose')
const postsSchema = new mongoose.Schema({
    commentBody: {
        type: String,
        required: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts'
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Replies"
    }],
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    }],
    disLike: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    }],
    likeNum: { type: Number, default: 0 },
    disLikeNum: { type: Number, default: 0 },

})
postsSchema.methods.toJSON = function () {
    const posts = this.toObject()
    return posts
}
const Comments = mongoose.model('Comments', postsSchema)
module.exports = Comments