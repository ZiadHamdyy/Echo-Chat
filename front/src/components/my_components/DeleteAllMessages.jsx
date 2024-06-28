import { ChatContext } from "../../../src/context/ChatContext";
import falseicon from "../../picture/cross (1).png";
import { useContext } from "react";
import { Button } from "../ui/button.jsx";

export function DeleteAllMessages({ onClose }) {
  const {deleteAllMessages} = useContext(ChatContext)
  const handleClickDeleteAll = () => {
    onClose()
    deleteAllMessages()
  }
  return (
    <div className="w-[600px] h-40 bg-gray-200 rounded-lg flex flex-col justify-between">
        <div className="bg-gray-300 h-16 w-full rounded-t-lg flex items-center shadow-md">
            <div className="w-9 ml-4 hover:bg-gray-200 hover:cursor-pointer rounded-full" onClick={onClose}>
                <img src={falseicon} alt="" className="p-1"/>
            </div>
            <span className="ml-6 text-gray-900 text-lg font-medium">Are you sure you want to delete all messages?</span>
        </div>
        <div className="flex justify-end">
        <Button className="rounded-full text-primary-foreground w-20 h-10 m-4 flex"
                variant="secondary"
                onClick={handleClickDeleteAll}
                >
            Delete
        </Button>
        </div>
    </div>
  );
}
