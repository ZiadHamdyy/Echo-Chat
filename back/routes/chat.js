const express = require("express")
const AuthToken = require('../Middlewares/JWT.js');

const { createChat, findUserChats , findChat, deleteChat} = require("../controllers/chat")
const router = express.Router()

router.post("/createchat", createChat)
router.get("/:userId", findUserChats)
router.get("/find/:firstId/:secondId", findChat)
router.delete("/deletechat/:chatId", deleteChat)
module.exports = router