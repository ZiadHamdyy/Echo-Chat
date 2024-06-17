const userDB = require("../mongoDB/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const validator = require("validator")
const { all } = require("../routes/user")
const cloudinary = require('../cloudinary/cloudinary.js')
const createToken = (_id) => {
    jwtkey = process.env.ACCESS_WEB_TOKEN
    return jwt.sign({_id}, jwtkey, { expiresIn: "30d" })
}

const userRegister = async (req, res) => {
    try{
        const {name, email, password, profileImage } = req.body;

        console.log(req.body);
        let uploadedImage = ""
        if (profileImage){
                uploadedImage = await cloudinary.uploader.upload(profileImage, {
                upload_preset: "chatapp",
                allowed_formats: ["jpg", "png", "jpeg", "svg", "ico", "jfif", "webp"],
            });
        }
            
        let user = await userDB.findOne({email})

        if (!name || !email || !password)
            return res.status(400).json("All field are required")
        if(user)
            return res.status(400).json("User with the given email is already exist")

        if (!validator.isEmail(email))
            return res.status(400).json("Email not valid")

        if (!validator.isStrongPassword(password))
            return res.status(400).json("Password not Strong")

        user = new userDB({ name, email, password, profileImage: uploadedImage.url || "" });

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
        await user.save()

        const token = createToken(user._id)
        return res.status(200).json({_id: user._id, name, email, profileImage: uploadedImage.url, token})

    }catch(error){
        console.log(error)
        return res.status(500).json(error)
    }
}

const userSignIn = async (req, res) =>{
    const {email, password} = req.body;
    try{
        let user = await userDB.findOne({email})

        if (!email || !password)
            return res.status(400).json("All field are required")


        if(!user)
            return res.status(400).json("User with the given email is not exist")

        const isValidPassword = await bcrypt.compare(password, user.password)
        if(!isValidPassword)
            return res.status(400).json("Password is not correct")

        const token = createToken(user._id)
        res.status(200).json({_id: user._id, name: user.name, email, token})
    }catch(error){
        console.log(error)
        res.status(500).json(error)
    }
}
const findUserById = async (req, res) => {
    const userId = req.params.userId
    try{
        user = await userDB.findById(userId)
        res.status(200).json(user)
    }catch(error){
        console.log(error)
        res.status(500).json(error)
    }

}
const findAllUsers = async (req, res) => {
    try{
        users = await userDB.find()
        res.status(200).json(users)
    }catch(error){
        console.log(error)
        res.status(500).json(error)
    }
}
const UpdateUser = async (req, res) => {
    const userId = req.params.userId
    const {name, email, profileImage} = req.body
    const user = req.user
    if (user._id !== userId)
        return res.status(400).json("You are not authorized to update this user")
    try{
        const user = await userDB.findById(userId)
        if(!user)
            return res.status(400).json("User not found")
        if(name)
            user.name = name
        if(email)
            user.email = email
        if(profileImage)
            user.profileImage = profileImage
        await user.save()
        res.status(200).json(user)
    }catch(error){
        console.log(error)
        res.status(500).json(error)
    }
}

const updatePassword = async (req, res) => {
    const userId = req.params.userId
    const {oldPassword, newPassword } = req.body;
    console.log(req.body);
    const u = req.user
    if (u._id !== userId)
        return res.status(400).json("You are not authorized to update this user password")
    try {
      if (!userId || !oldPassword || !newPassword) {
        return res.status(400).json("All fields are required");
      }

      const user = await userDB.findById(userId);
      if (!user) {
        return res.status(404).json("User not found");
      }
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json("Old password is incorrect");
      }
  
      if (!validator.isStrongPassword(newPassword)) {
        return res.status(400).json("Password is not strong enough");
      }
  
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
  
      const token = createToken(user._id);
      return res.status(200).json({
        message: "Password updated successfully",
        token
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };

const deleteUser = async (req, res) => {
    const userId = req.params.userId
    const user = req.user
    if (user._id !== userId)
        return res.status(400).json("You are not authorized to delete this user")
    try{
        const user = await userDB.findById(userId)
        console.log(user);
        if(!user)
            return res.status(400).json("User not found")
        const response = await userDB.deleteOne({ _id: userId });
        res.status(200).json(response)
    }catch(error){
        console.log(error)
        res.status(500).json(error)
    }
}

module.exports = { userRegister, userSignIn, findUserById, findAllUsers, UpdateUser, updatePassword, deleteUser }