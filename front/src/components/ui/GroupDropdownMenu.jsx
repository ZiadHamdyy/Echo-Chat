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
import { GroupContext } from "../../../src/context/GroupContext";
  export function GroupDropdownMenuDemo({onDeleteMessages, onCloseGroup}) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <img className="w-10 bg-gray-200 hover:bg-gray-100 rounded-full cursor-pointer" src={menuicon} alt="" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={onCloseGroup}>
              <DeleteIcon className="mr-2 h-4 w-4" />
              <span>Close Group</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDeleteMessages}>
              <Delete className="mr-2 h-4 w-4"/>
              <span>Delete Group Messages</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  