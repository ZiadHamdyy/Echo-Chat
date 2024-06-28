const { log } = require("console")
const messageDB = require("../mongoDB/message")
const groupDB = require("../mongoDB/group");
const userDB = require("../mongoDB/user")
const chatDB = require("../mongoDB/chat");

const createmessage = async (req, res) => {
    const {text, senderName, chatId} = req.body
    const user = req.user
    try{
        const message = new messageDB({text, senderId: user._id, senderName, chatId})
        const response = await message.save()
        await groupDB.findByIdAndUpdate(chatId, { updatedAt: new Date() })
        await chatDB.findByIdAndUpdate(chatId, { updatedAt: new Date() });
        res.status(200).json(response)
        console.log(response);
    }catch(error){
        console.log(error)
        res.status(500).json(error)
    }
}

const getMessages = async (req, res) => {
    const {chatId} = req.params
    try{
        const messages = await messageDB.find({chatId})
        res.status(200).json(messages)
    }catch(error){
        console.log(error)
        res.status(500).json(error)
    }
}
const deleteallMessages = async (req, res) => {
    const {chatId} = req.params
    try{
        const messages = await messageDB.deleteMany({chatId})
        res.status(200).json(messages)
    }catch(error){
        console.log(error)
        res.status(500).json(error)
    }
}
const deleteMessage = async (req, res) => {
    const { messageId } = req.params;
    try {
        const result = await messageDB.deleteOne({ _id: messageId });
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
const editMessage = async (req, res) => {
    const { messageId } = req.params;
    const { text } = req.body;

    try {
        const result = await messageDB.updateOne({ _id: messageId }, { text: text });
        res.status(200).json(result);
    }catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = { createmessage, getMessages, deleteallMessages, deleteMessage, editMessage}