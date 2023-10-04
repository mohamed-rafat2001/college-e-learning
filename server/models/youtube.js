const mongoose = require('mongoose')
const youtSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    youtubeId: [
        {
            _id: { type: String },
            name: { type: String }
        }
    ]
})
const Youtube = mongoose.model('Youtube', youtSchema)
module.exports = Youtube