import { ChatContext } from "../../context/ChatContext.jsx";
import falseicon from "../../picture/cross (1).png";
import { useContext } from "react";
import { Button } from "../ui/button.jsx";
import { GroupContext } from "../../context/GroupContext.jsx";

export function LeaveMember({ onClose }) {
  const {currentMember, RemoveMember, currentGroup, leaveMember} = useContext(GroupContext)
  const handleClickremove = () => {
    console.log("currentGroup",currentGroup._id);
    console.log("currentMember._id", currentMember._id);
    leaveMember(currentMember._id)
    onClose()
  }

  return (
    <div className="w-[600px] h-40 bg-gray-200 rounded-lg flex flex-col justify-between">
        <div className="bg-gray-300 h-16 w-full rounded-t-lg flex items-center shadow-md">
            <div className="w-9 ml-4 hover:bg-gray-200 hover:cursor-pointer rounded-full" onClick={onClose}>
                <img src={falseicon} alt="" className="p-1"/>
            </div>
            <span className="ml-6 text-gray-900 text-lg font-medium">Are you sure you want to leave?</span>
        </div>
        <div className="flex justify-end">
        <Button className="rounded-full text-primary-foreground w-20 h-10 m-4 flex"
                variant="secondary"
                onClick={handleClickremove}
                >
            Leave
        </Button>
        </div>
    </div>
  );
}
