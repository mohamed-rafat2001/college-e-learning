const mongoose = require('mongoose')
const shareSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sharePost: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts'
    }]
})
const Share = mongoose.model('Share', shareSchema)
module.exports = Share