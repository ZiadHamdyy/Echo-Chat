import { useNavigate } from "react-router-dom";
import falseicon from "../../picture/cross (1).png";
import { MembersTable } from "../ui/MembersTable";
import { Button } from "../ui/button";

export function GroupMenu({ onClose, onRemoveClick, onLeaveClick }) {
    const navigate = useNavigate();
    const switchToAddMembers = () => navigate('/addmembers');
  return (
    <div className="bg-gray-300 h-full right-0 p-3 overflow-y-auto">
      <div className="flex justify-between items-center">
        <div
          className="w-9 hover:bg-gray-200 hover:cursor-pointer rounded-full"
          onClick={onClose}
        >
          <img src={falseicon} alt="" className="p-1" />
        </div>
        <Button
          className="rounded-full text-primary-foreground mr-10"
          variant="secondary"
          onClick={switchToAddMembers}
        >
          Add Members
        </Button>
      </div>
      <div className="mt-6">
        <MembersTable onRemoveClick={onRemoveClick} onLeaveClick={onLeaveClick}/>
      </div>
    </div>
  );
}
