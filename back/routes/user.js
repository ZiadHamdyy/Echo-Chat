const express = require("express")
const AuthToken = require('../Middlewares/JWT.js');
const { userRegister, userSignIn, findUserById, findAllUsers, UpdateUser, deleteUser, updatePassword} = require("../controllers/user")
const router = express.Router()

router.post("/register", userRegister)
router.post("/signin", userSignIn)
router.get("/find/:userId", findUserById)
router.get("/", findAllUsers)
router.put("/updateuser/:userId", AuthToken, UpdateUser)
router.put("/updatepassword/:userId", AuthToken, updatePassword)
router.delete("/deleteuser/:userId", AuthToken, deleteUser)
module.exports = router