const express = require("express")
const AuthToken = require('../Middlewares/JWT.js');

const { createmessage , getMessages, deleteallMessages, deleteMessage, editMessage} = require("../controllers/message")
const router = express.Router()

router.post("/createmessage", AuthToken, createmessage)
router.get("/:chatId", getMessages)
router.delete("/deleteallmessages/:chatId", deleteallMessages)
router.delete("/deletemessage/:messageId", deleteMessage)
router.put("/editmessage/:messageId", editMessage)
module.exports = router