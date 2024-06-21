import {
    TableHead,
    TableRow,
    TableHeader,
    TableCell,
    TableBody,
    Table,
  } from "./table";
  import usericon from "../../picture/user (2).png";
  import crown from "../../picture/crown.png";
  import { Input } from "./input";
  import { useContext, useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { ChatContext } from "../../context/ChatContext.jsx";
  import { GroupContext } from "../../../src/context/GroupContext.jsx";
import { AuthContext } from "../../../src/context/AuthContext";
import { Button } from "./button";
  // import { AuthContext } from "../../context/AuthContext.jsx";
  
  export function MembersTable({onRemoveClick, onLeaveClick}) {
    const { members, currentMember, setCurrentMember, currentGroup} = useContext(GroupContext)
    const navigate = useNavigate();
    const [filteredMembers, setFilterdMembers] = useState([]);
    const [input, setInput] = useState("");
    console.log("filteredMembers", filteredMembers);
    useEffect(() => {
      if (input.trim() === "") {
        setFilterdMembers(members);
      } else {
        const filtered = members.filter((member) =>
          member.name.toLowerCase().startsWith(input.toLowerCase())
        );
        setFilterdMembers(filtered);
      }
    }, [input, members]);
  
    const switchToHome = () => navigate("/");
  
    return (
      <>
        <div className="m-auto w-full h-[523px] bg-gray-200 rounded-md flex flex-col">
          <Input
            placeholder="Search for Users"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="max-w-fit px-4 m-4"
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Remove</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <Member
                  key={member._id}
                  member={member}
                  onRemoveClick={onRemoveClick}
                  onLeaveClick={onLeaveClick}
                  switchToHome={switchToHome}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  }

  function Member({ member, onRemoveClick, onLeaveClick }) {
    const {setCurrentMember, RemoveMember, admin} = useContext(GroupContext)
    const {getUserInfo, user} = useContext(AuthContext)
    console.log("member",member);

    return (
      <TableRow onClick={() => setCurrentMember(member)}>
        <TableCell>
        { member._id === admin && <img
            alt="Avatar"
            className="rounded-full object-cover ml-2"
            src={crown}
            style={{
              aspectRatio: "40/40",
              objectFit: "cover",
            }}
            width="22"
          />}
          <img
            alt="Avatar"
            className="rounded-full object-cover"
            height="40"
            src={member?.profileImage || usericon}
            style={{
              aspectRatio: "40/40",
              objectFit: "cover",
            }}
            width={"40"}
          />
        </TableCell>
        <TableCell className="font-semibold">{member?.name}</TableCell>
        <TableCell className="font-semibold">
          {user._id === admin && user._id !== member._id && <Button
            className="rounded-full text-primary-foreground mr-10"
            variant="secondary"
            onClick={onRemoveClick}
          >
            Remove
          </Button>}
          { user._id === member._id && <Button
            className="rounded-full text-primary-foreground mr-10"
            variant="secondary"
            onClick={onLeaveClick}
          >
            Leave
          </Button>}
        </TableCell>
        <TableCell className="font-semibold"></TableCell>
      </TableRow>
    );
  }
  