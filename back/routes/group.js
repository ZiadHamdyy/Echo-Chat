const express = require("express")
const AuthToken = require('../Middlewares/JWT.js');

const { createGroup, findUserGroups, findGroupMembers, deleteGroup, addMember, removeMember, leaveMember, deleteallGroupMessages, createGroupMessage} = require("../controllers/group")
const router = express.Router()

router.post("/creategroup/:userId", createGroup)
router.get("/getusergroups/:userId", findUserGroups)
router.get("/getgroupmembers/:groupId", findGroupMembers)
router.delete("/deletegroup/:groupId", AuthToken, deleteGroup)
router.post("/createmessage", AuthToken, createGroupMessage)
router.delete("/deleteallgroupmessages/:chatId", AuthToken, deleteallGroupMessages)
router.post("/addmember/:groupId", addMember)
router.delete("/removemember/:groupId", AuthToken, removeMember)
router.delete("/leavemember/:groupId", AuthToken, leaveMember)

module.exports = router