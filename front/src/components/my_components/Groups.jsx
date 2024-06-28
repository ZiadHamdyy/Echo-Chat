import { useContext } from "react";
import { SkeletonDemo } from "../ui/Chatskeleton";
import usericon from "../../picture/user (2).png";
import { GroupContext } from "../../../src/context/GroupContext.jsx";
// import moment from "moment";

function Getgroup({group}) {
  // const { messages } = useContext(ChatContext);
  const { userGroups } = useContext(GroupContext)

  // const lastMsg = messages[messages.length - 1]
  return (
    <>
      <div className="rounded-full	h-12 w-14  ml-2 bg-gray-200">
        <img className={group?.profileImage ? "rounded-full h-12 w-14 object-cover":"w-12"} src={ group?.profileImage || usericon} alt="" />
      </div>
      <div className="flex flex-col items-start w-full">
        <div className="mx-4 text-xl">{group?.name}</div>
        {/* <div className="w-full  flex ">
        <div className=" w-5/6 h-6 mx-4">{lastMsg?.text}</div>
        <div className="bg-red-600 w-2/6 flex justify-center">{moment(lastMsg?.createdAt).calendar().split("at")[1]}</div>
        </div> */}
      </div>
    </>
  );
}
export function GetGroups() {
    const { userGroups, userGroupsLoading,currentGroup, setCurrentGroup } = useContext(GroupContext)

  return (
    <>
      {userGroupsLoading ? (
        <div className="py-3 shadow-md">
          <SkeletonDemo />
        </div>
      ) : (
        userGroups?.map((group) => (
          <div
            key={group._id}
            onClick={() => setCurrentGroup(group)}
            className={`w-6/6 h-20 flex items-center shadow-md hover:bg-gray-200 ${currentGroup?._id === group._id ? 'bg-gray-200' : ''}`}
          >
            <Getgroup group={group}/>
          </div>
        ))
      )}
    </>
  );
}
