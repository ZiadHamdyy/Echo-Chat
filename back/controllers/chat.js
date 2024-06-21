const chatDB = require("../mongoDB/chat");

const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  try {
    let chat = await chatDB.findOne({ members: { $all: [firstId, secondId] } });
    if (chat) res.status(405).json(chat);
    const newchat = new chatDB({ members: [firstId, secondId] });
    const response = await newchat.save();
    return res.status(201).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const findUserChats = async (req, res) => {
  const userId = req.params.userId;
  try {
    const chats = await chatDB.find({ members: { $in: [userId] } }).sort({ updatedAt: -1 });
    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;
  try {
    const chat = await chatDB.findOne({
      members: { $all: [firstId, secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deleteChat = async (req, res) => {
  const { chatId } = req.params;
  try {
    const result = await chatDB.deleteOne({ _id: chatId });
    res.status(200).json(result);
  }catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

module.exports = { createChat, findUserChats, findChat, deleteChat };
