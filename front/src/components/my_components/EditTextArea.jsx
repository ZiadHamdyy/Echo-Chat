import React, { useContext, useEffect, useState } from "react";
import Picker from "emoji-picker-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import sadIcon from "../../picture/sad-face.png";
import happyIcon from "../../picture/happy.png";
import { ChatContext } from "../../../src/context/ChatContext";
import { GroupContext } from "../../../src/context/GroupContext";
export function EditTextArea( { onClose } ) {
  const [imageSrc, setImageSrc] = useState(sadIcon);
  const [showPicker, setShowPicker] = useState(false);
  const {editMessage, currentMessage, currentChat } = useContext(ChatContext)
  const { setGroupMessages, currentGroup, editGroupMessage } = useContext(GroupContext)
  const [message, setMessage] = useState(currentMessage?.text || "");
  useEffect(() => {
      setMessage(currentMessage?.text);
  }, [currentMessage]);

  const onEmojiClick = (emojiObject) => {
    setMessage((msg) => msg + emojiObject.emoji);
  };

  const handleSendOnCKlick = () => {
    onClose();
    if(currentChat)
      editMessage(currentMessage?._id, message)
    if(currentGroup)
      editGroupMessage(currentMessage?._id, message)
    setShowPicker(true)
  }
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendOnCKlick();
    }
  };
  return (
    <div className="bg-gray-200 w-full h-20 flex justify-center items-center rounded-b-lg shadow-md">
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
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        type="text"
      />
      <Button
        className="rounded-full text-primary-foreground mx-8"
        variant="secondary"
        onClick={handleSendOnCKlick}
      >
        Edit
      </Button>
    </div>
  );
}
