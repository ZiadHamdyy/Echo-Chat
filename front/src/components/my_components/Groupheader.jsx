import usericon from "../../picture/user (2).png";
import { useContext } from "react";
import crown from "../../picture/crown.png";
import { ChatDropdownMenuDemo } from "../ui/ChatDropdownMenu";
import { GroupContext } from "../../../src/context/GroupContext.jsx";
import { GroupDropdownMenuDemo } from "../ui/GroupDropdownMenu";
import { AuthContext } from "../../../src/context/AuthContext.jsx";
export function GroupHeader({onClickGroupHeader, onCloseGroup, onDeleteMessages}) {
    const { currentGroup, admin } = useContext(GroupContext)
    const { user } = useContext(AuthContext)
    if (!currentGroup) {
      return (
        <div className="flex h-20 p-2 shadow-md justify-start items-center relative">
          <div className="bg-gray-200 rounded-full	h-12 w-12">
          </div>
        </div>
      )
  }
  return (
    <div className="flex h-20 p-2 shadow-md justify-start items-center relative">
      <div className="bg-gray-200 w-9/12 flex justify-start items-center h-full" onClick={onClickGroupHeader}>
          <div className="bg-gray-200 rounded-full	h-12 w-12">
            <img className={currentGroup?.profileImage ? "rounded-full h-12 w-14 object-cover":"w-12"} src={currentGroup?.profileImage|| usericon} alt="" />
          </div>
          <div className="ml-4 text-xl font-semibold">{currentGroup?.name}</div>
          { user._id === admin && <img
            alt="Avatar"
            className="rounded-full object-cover ml-2"
            src={crown}
            style={{
              aspectRatio: "40/40",
              objectFit: "cover",
            }}
            width="22"
          />}
      </div>
          <div className="absolute top-5 right-5">
              { user._id === admin && <GroupDropdownMenuDemo onCloseGroup={onCloseGroup} onDeleteMessages={onDeleteMessages}/>}
            </div>
        </div>
  );
}
