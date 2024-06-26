import moment from "moment";
import { AuthContext } from "../../../src/context/AuthContext";
import { ChatContext } from "../../../src/context/ChatContext";
import falseicon from "../../picture/cross (1).png";
import { EditTextArea } from "./EditTextArea";
import { useContext } from "react";
import { GroupContext } from "../../../src/context/GroupContext";
export function EditMessage({ onClose }) {
  const {currentMessage, currentChat} = useContext(ChatContext)
  const {currentGroup} = useContext(GroupContext)
  const { user } = useContext(AuthContext)

  console.log("currentMessage",currentMessage);

  return (
    <div className="w-[600px] h-80 bg-gray-200 rounded-lg flex flex-col justify-between">
        <div className="bg-gray-300 h-16 w-full rounded-t-lg flex items-center shadow-md">
        <div className="w-9 ml-4 hover:bg-gray-200 hover:cursor-pointer rounded-full" onClick={onClose}>
                <img src={falseicon} alt="" className="p-1"/>
            </div>
            <span className="ml-6 text-gray-900 text-lg font-medium">Edit Message</span>
        </div>
        <div className="bg-gray-200 w-full h-[54%] text-gray-300 flex justify-center items-center shadow-md"> 
            <div className="bg-gray-900 rounded-xl mb-2 ml-2 shadow-sm max-w-lg h-auto">
              <div className="flex items-center w-full h-8 justify-between">
              <div className="px-2 py-1 text-sky-400">{user.name}</div>
              </div>
              <div className="px-2 overflow-hidden overflow-ellipsis whitespace-no-wrap break-words">
                {currentMessage?.text}
              </div>
              <div className="px-2 py-1 font-thin text-xs">{moment(currentMessage?.createdAt).calendar()}</div>
            </div>
          </div>
        <div>
            <EditTextArea onClose={onClose}/>
        </div>
    </div>
  );
}
