const mongoose = require('mongoose')
const postsSchema = new mongoose.Schema({
    replayBody: {
        type: String,
        required: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments'
    },
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
const Replies = mongoose.model('Replies', postsSchema)
module.exports = Replies