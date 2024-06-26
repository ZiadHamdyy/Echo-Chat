import { AuthContext } from "../../../src/context/AuthContext";
import { ChatContext } from "../../../src/context/ChatContext";
import { RecipientUser } from "../../../src/list/RecipientUser";
import { useContext, useEffect } from "react";
import { toast } from "sonner";
import { SkeletonDemo } from "../ui/Chatskeleton";
import usericon from "../../picture/user (2).png";
// import moment from "moment";

function GetChat({ chat, user }) {
  // const { messages } = useContext(ChatContext);
  const { recipientUser } = RecipientUser(chat, user);

  // const lastMsg = messages[messages.length - 1]
  return (
    <>
      <div className="rounded-full	h-12 w-14  ml-2 bg-gray-200">
        <img className={recipientUser?.profileImage ? "rounded-full h-12 w-14 object-cover":"w-12"} src={recipientUser?.profileImage || usericon} alt="" />
      </div>
      <div className="flex flex-col items-start w-full">
        <div className="mx-4 text-xl">{recipientUser?.name}</div>
        {/* <div className="w-full  flex ">
        <div className=" w-5/6 h-6 mx-4">{lastMsg?.text}</div>
        <div className="bg-red-600 w-2/6 flex justify-center">{moment(lastMsg?.createdAt).calendar().split("at")[1]}</div>
        </div> */}
      </div>
    </>
  );
}

export function GetChats() {
  const { userChats, userChatsLoading, userChatsError, setCurrentChat, currentChat } =
    useContext(ChatContext);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (userChatsError?.error) {
      toast(userChatsError.message);
    }
  }, [userChatsError]);


  return (
    <>
      {userChatsLoading ? (
        <div className="py-3 shadow-md">
          <SkeletonDemo />
        </div>
      ) : (
        userChats?.map((chat) => (
          <div
            key={chat._id}
            onClick={() => setCurrentChat(chat)}
            className={`w-6/6 h-20 flex items-center shadow-md hover:bg-gray-200 ${currentChat?._id === chat._id ? 'bg-gray-200' : ''}`}
            >
            <GetChat chat={chat} user={user} />
            </div>
        ))
      )}
    </>
  );
}
