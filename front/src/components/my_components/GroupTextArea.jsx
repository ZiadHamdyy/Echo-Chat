import React, { useContext, useState } from "react";
import Picker from "emoji-picker-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import sadIcon from "../../picture/sad.png";
import happyIcon from "../../picture/smile (2).png";
import { ChatContext } from "../../../src/context/ChatContext";
import { AuthContext } from "../../../src/context/AuthContext";
import { GroupContext } from "../../../src/context/GroupContext";
import { useSocket } from "../../../src/context/SocketContext.jsx";
export function GroupTextArea() {
  const [imageSrc, setImageSrc] = useState(sadIcon);
  const [showPicker, setShowPicker] = useState(false);
  const [message, setMessage] = useState("");
  const { groupmessages, newgroupMessage, currentGroup, setGroupMessages, TypingGroup, setTypingGroup, IsTypingGroup, setIsTypingGroup, } = useContext(GroupContext);
  const { user } = useContext(AuthContext)
  const socket = useSocket()
  console.log(message);

  const onEmojiClick = (emojiObject) => {
    setMessage((currentMessage) => currentMessage + emojiObject.emoji);
  };

  const handleSendOnCKlick = () => {
    if(currentGroup)
      newgroupMessage(message, user.name, currentGroup?._id, setMessage)
    setShowPicker()
  }
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendOnCKlick();
    }
  };
  const handleTypingGroup = (e) => {
    setMessage(e.target.value)
    if(message === ""){setIsTypingGroup(false)}
    if (!socket) return
    if(!TypingGroup){
      socket.emit("typing", currentGroup._id)
      setTypingGroup(true)
    }
    let lastTypingTime = (new Date()).getTime();
    let timerLength = 2000;
    setTimeout(() => {
      let typingnowtimer = (new Date()).getTime();
      let timeDiff = typingnowtimer - lastTypingTime;
      if (timeDiff >= timerLength && TypingGroup) {
        socket.emit("stop typing", currentGroup._id)
        setTypingGroup(false)
      }
    }, timerLength);
  }
  return (
    <div className="bg-gray-200 w-full h-20 flex justify-center items-center">
      <img
        src={imageSrc}
        className="w-11 mx-8"
        alt=""
        onMouseEnter={() => setImageSrc(happyIcon)}
        onMouseLeave={() => setImageSrc(sadIcon)}
        onClick={() => setShowPicker((show) => !show)}
      />
      <div className="relative">
        {showPicker && (
          <div className="absolute bottom-full left-[-80px] transform-translate-x-1/2 z-50 mb-11 bg-gray-300 border-gray-200 rounded-lg shadow-lg">
            <Picker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>
      <Input
        className="w-5/6 h-11 text-lg text-sky-950"
        placeholder="Type a message"
        value={message}
        onChange={handleTypingGroup}
        onKeyPress={handleKeyPress}
        type="text"
      />
      <Button
        className="rounded-full text-primary-foreground mx-8"
        variant="secondary"
        onClick={() => handleSendOnCKlick()}
      >
        Send
      </Button>
    </div>
  );
}
