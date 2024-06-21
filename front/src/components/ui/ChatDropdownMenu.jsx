import {
    Delete,
    DeleteIcon,
  } from "lucide-react"
  
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "../../components/ui/dropdown-menu"
  import menuicon from "../../picture/more.png";
import { useContext } from "react";
import { ChatContext } from "../../../src/context/ChatContext";
  export function ChatDropdownMenuDemo({onDeleteAllClick, onCloseChat}) {
    const { currentChat } = useContext(ChatContext)
    console.log(currentChat?._id)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <img className="w-10 bg-gray-200 hover:bg-gray-100 rounded-full cursor-pointer" src={menuicon} alt="" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={onCloseChat/*  */}>
              <DeleteIcon className="mr-2 h-4 w-4" />
              <span>Close Chat</span>
            </DropdownMenuItem>
            <DropdownMenuItem  onClick={onDeleteAllClick/* deleteAllMessages */}>
              <Delete className="mr-2 h-4 w-4"/>
              <span>Delete Messages</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  