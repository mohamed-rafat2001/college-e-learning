const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const validator = require('validator')
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        unique: false
    },
    idNumber: {
        type: Number,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        uniqueCaseInsensitive: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('please enter valid email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isStrongPassword(value, { minlength: 8, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 })) {
                throw new Error('please enter strong password')
            }
        }
    },
    image: {
        type: Buffer,
        required: false
    },
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user']
    },
    block: {
        type: Boolean,
        default: false
    },
    passwordResetToken: {
        type: String
    },
}, { timestamps: true })
userSchema.methods.creatToken = function () {
    const token = jwt.sign({ id: this._id.toString() }, process.env.USER_KEY_TOKEN)
    return token
}
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcryptjs.hash(this.password, 8)
        next()
    }
})
userSchema.methods.toJSON = function () {
    const user = this.toObject()
    delete user.password
    return user
}
const User = mongoose.model('User', userSchema)
module.exports = User