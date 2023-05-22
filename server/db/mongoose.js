const mongoose = require('mongoose');
const dbConnected = () => {
    try {
        mongoose.connect(process.env.DB_URL)
        console.log('connected!')
    }
    catch (e) {
        console.log(e.message)
    }
}
module.exports = dbConnected