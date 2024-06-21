import {
    Delete,
    Edit,
  } from "lucide-react"
  
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "../../components/ui/dropdown-menu"
  import menuicon from "../../picture/more.png";
  export function MessageDropdownMenuDemo({ onEditClick, onDeleteClick }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <img className="w-6 mr-1 bg-gray-900 hover:bg-gray-800 rounded-full cursor-pointer" src={menuicon} alt="" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-16">
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={onEditClick}>
              <Edit className="mr-2 h-4 w-4"/>
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onDeleteClick}>
              <Delete className="mr-2 h-4 w-4"/>
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  