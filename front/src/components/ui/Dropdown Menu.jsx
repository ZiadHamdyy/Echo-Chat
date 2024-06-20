import {
    LogOut,
    User,
    Users2,
  } from "lucide-react"

  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "../../components/ui/dropdown-menu"
  import menuicon from "../../picture/more.png";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
  export function DropdownMenuDemo() {
    const { user, logoutUser} = useContext(AuthContext)
    const navigate = useNavigate();
    const switchToProfile = () => navigate('/profile');
    const switchToUsers = () => navigate('/Users');
    const switchToGroups = () => navigate('/Groups');
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <img className="bg-gray-300 hover:bg-gray-200 rounded-full cursor-pointer w-10" src={menuicon} alt="" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Hi {user?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={switchToProfile}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={switchToUsers}>
              <Users2 className="mr-2 h-4 w-4" />
              <span>All Users</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={switchToGroups}>
              <Users2 className="mr-2 h-4 w-4" />
              <span>Groups</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuItem onClick={() => logoutUser() }>
            <LogOut className="mr-2 h-4 w-4"/>
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  