import { AuthContext } from "../../../src/context/AuthContext";
import { RecipientUser } from "../../../src/list/RecipientUser";
import usericon from "../../picture/user (2).png";
import { ChatContext } from "../../../src/context/ChatContext";
import { useContext } from "react";
import { ChatDropdownMenuDemo } from "../ui/ChatDropdownMenu";
export function ChatHeader({onDeleteAllClick, onCloseChat}) {
    const { currentChat } = useContext(ChatContext);
    const { user } = useContext(AuthContext);
    const {recipientUser } = RecipientUser(currentChat, user)

    if (!currentChat) {
      return (
        <div className="flex h-20 p-2 shadow-md justify-start items-center relative">
{/*           <div className="bg-gray-200 rounded-full h-12 w-12">
          </div> */}
        </div>
      )
  }
  return (
    <>
    <div className="flex h-20 p-2 shadow-md justify-start items-center relative bg-gray-200">
          <div className="bg-gray-200 rounded-full	h-12 w-12">
            <img className={recipientUser?.profileImage ? "rounded-full h-12 w-14 object-cover":"w-12"} src={recipientUser ? recipientUser?.profileImage || usericon : null} alt="" />
          </div>
          <div className="ml-4 text-xl font-semibold">{recipientUser?.name}</div>
          <div className="absolute top-4 right-4">
            <ChatDropdownMenuDemo onDeleteAllClick={onDeleteAllClick} onCloseChat={onCloseChat}/>
          </div>
    </div>
    </>
  );
}
