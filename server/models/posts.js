const mongoose = require('mongoose')
const postsSchema = new mongoose.Schema({
    text: {
        type: String,
        required: false,
    },
    fileUp: [{
        type: Buffer,
        required: false
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
    }
    ],
    likesNumber: {
        type: Number,
        default: 0
    },
    unLikes: [{
        type: mongoose.Schema.Types.ObjectId,
    }
    ],
    unLikesNumber: {
        type: Number,
        default: 0
    }

})
postsSchema.methods.toJSON = function () {
    const posts = this.toObject()
    return posts
}
const Posts = mongoose.model('Posts', postsSchema)
module.exports = Posts