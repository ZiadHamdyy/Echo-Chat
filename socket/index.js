const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connect", (socket) => {
  console.log("A user connected", socket.id);

  
  socket.on('join chat', (chatId) => {
    socket.join(chatId);
  });
  
  socket.on("sendMessage chat", (message) => {
    console.log(message);
    if(!message.text) return
    socket.to(message.chatId).emit("getMessage chat", message);
  });
  
  socket.on('join group', (groupId) => {
    socket.join(groupId);
  });
  
  socket.on("sendMessage group", (message) => {
    console.log(message);
    if(!message.text) return
    socket.to(message.chatId).emit("getMessage group", message);
  });


  socket.on("typing", (chat) => socket.in(chat).emit("typing"))
  socket.on("stop typing", (chat) => socket.in(chat).emit("stop typing"))
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

io.listen(4000);
console.log("Socket.io server running on port 4000");
