const mongoose = require('mongoose')
const postsSchema = new mongoose.Schema({
    text: {
        type: String,
        required: false,
    },
    fileUp: [{
        public_id: String, secure_url: String
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments"
    }],
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