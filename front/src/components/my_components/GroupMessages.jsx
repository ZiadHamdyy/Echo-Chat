import { useContext, useEffect, useRef } from "react";
import usericon from "../../picture/user (2).png";
import { ChatContext } from "../../../src/context/ChatContext";
import { AuthContext } from "../../../src/context/AuthContext";
import { RecipientUser } from "../../../src/list/RecipientUser";
import moment from "moment";
import { MessageDropdownMenuDemo } from "../ui/MessageDropdownMenu";
import { GroupContext } from "../../../src/context/GroupContext";
import { ThreeDot } from "react-loading-indicators";

export function GetGroupMessages({ onEditClick, onDeleteClick }) {
    const { setCurrentMessage, currentChat } = useContext(ChatContext);
  const { groupmessages, admin, IsTypingGroup, currentGroup } = useContext(GroupContext);
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  console.log(groupmessages);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [groupmessages, IsTypingGroup]);

  return (
    <>
      {groupmessages?.map((msg) =>
        msg.senderId !== user._id ? (
          <div
            key={msg._id}
            /* onClick={() => setCurrentMessage(msg)} */
            className="bg-gray-200  mx-6 my-2 text-gray-300 flex h-auto w-5/5"
            onClick={() => {user._id === admin && setCurrentMessage(msg)}}
          >
            <div className="bg-gray-200 rounded-full h-8 w-8 mt-2">
              <img className={msg?.profileImage ? "rounded-full h-8 w-8 object-cover":"w-8"} src={ msg?.profileImage|| usericon } alt="" />
            </div>
            <div className="bg-gray-900 mb-2 ml-2 shadow-sm max-w-lg h-auto rounded-r-xl rounded-b-xl">
              <div className="flex items-center w-full h-8 justify-between" >
              <div className="px-2 py-1 text-sky-400">{msg.senderName}</div>
              {user._id === admin && <MessageDropdownMenuDemo onEditClick={ onEditClick } onDeleteClick={onDeleteClick}/>}
              </div>
              <div className="px-2 overflow-hidden overflow-ellipsis whitespace-no-wrap break-words">
                {msg?.text}
              </div>
              <div className="px-2 py-1 font-thin text-xs">{moment(msg.createdAt).calendar()}</div>
            </div>
          </div>
        ) : (
          <div
            key={msg._id}
            
            className="bg-gray-200 mx-6 my-2 text-gray-300 inline-flex justify-end h-auto w-5/5"
          >
            <div className="bg-gray-900 mb-2 mr-2 shadow-sm max-w-lg h-auto rounded-l-xl rounded-b-xl" onClick={() => setCurrentMessage(msg)}>
            <div className="flex items-center w-full h-8 justify-between">
              <div className="px-2 py-1 text-sky-400">{user.name}</div>
              {<MessageDropdownMenuDemo onEditClick={ onEditClick } onDeleteClick={onDeleteClick}/>}
              </div>
              <div className="px-2 overflow-hidden overflow-ellipsis whitespace-no-wrap break-words">
                {msg.text}
              </div>
              <div className="px-2 py-1 font-thin text-xs flex justify-end">
              {moment(msg.createdAt).calendar()}
              </div>
            </div>
            <div className="bg-gray-200 rounded-full h-8 w-8 mt-2">
              <img className={msg?.profileImage ? "rounded-full h-8 w-8 object-cover":"w-8"} src={msg?.profileImage|| usericon} alt="" />
            </div>
          </div>
        )
      )}
      {currentGroup && IsTypingGroup ? <div className="bg-gray-900 rounded-xl shadow-sm flex justify-content items-center w-20 h-14 mb-6 ml-16 p-4 pr-2	">
        <ThreeDot variant="pulsate" color="#2b7cc4" size="small" text="" textColor=""/>
      </div> :<></>}
      <div ref={messagesEndRef} />
    </>
  );
}
