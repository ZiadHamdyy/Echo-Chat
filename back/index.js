const express = require('express')
const mongoose = require("mongoose")
const app = express()
const cors = require("cors")
const server = require("http")
const userRouter = require("./routes/user")
const chatRouter = require("./routes/chat")
const Server = server.createServer(app)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors())
require("dotenv").config()
app.use("/api/users/", userRouter)
app.use("/api/chats/", chatRouter)


const port = 5000 || process.env.PORT
const URI = process.env.DB_URI

app.get('/', (req, res) => res.send('Hello World!'))
Server.listen(port, () => console.log(`Example app listening on port ${port}!`))

mongoose.connect(URI)
.then(() => console.log("DB is Connected"))
.catch((err) => console.log("DB Connection Failed: ",err))