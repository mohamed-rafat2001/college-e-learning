const cloudinary = require('cloudinary').v2
const env = require('dotenv').config()
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
    secure: process.env.secure
});
module.exports = cloudinary