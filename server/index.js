const express = require('express')
const cors = require('cors')
const app = express()
const env = require('dotenv').config()
const port = process.env.PORT
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
require('./db/mongoose')
app.use(express.json())
app.use(cors())
const userRouter = require('./routes/user.js')
const adminRouter = require('./routes/admin')
const postsRouter = require('./routes/posts')
const youtubeRouter = require('./routes/youtube')
const commentRouter = require('./routes/comment')
const replayRouter = require('./routes/replay')
app.use(userRouter)
app.use(adminRouter)
app.use(postsRouter)
app.use(youtubeRouter)
app.use(commentRouter)
app.use(replayRouter)

app.all('*', (req, res, next) => {
    res.status(500).send({ status: "fail", message: "this route not defined" })
})
app.use((error, req, res, next) => {
    if (process.env.MODE == "DEV") {
        return res.status(error.code || 500).send({ status: "error", message: error.message, code: error.code, stack: error.stack })
    }
    res.status(error.code || 500).send({ status: "error", message: error.message, code: error.code, })

})
app.listen(port, () => console.log(`server running ${port}`))