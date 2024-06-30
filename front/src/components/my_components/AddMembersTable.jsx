import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "../ui/table";
import usericon from "../../picture/user (2).png";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../context/ChatContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import { GroupContext } from "../../../src/context/GroupContext.jsx";

export function AddMembersTable() {
  const { members, currentGroup, availableMembers } = useContext(GroupContext)
  const navigate = useNavigate();
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    console.log("Members:", availableMembers);
    console.log("Current Group Members:", currentGroup.members);
    const nonGroupMembers = availableMembers.filter(
      (member) => !currentGroup.members.some((groupMember) => groupMember._id === member._id)
    );

    console.log("nonGroupMembers", nonGroupMembers);
    if (input.trim() === "") {
      setFilteredMembers(nonGroupMembers);
    } else {
      const filtered = nonGroupMembers.filter((member) =>
        member.name.toLowerCase().startsWith(input.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [input, members, currentGroup]);

  const switchToHome = () => navigate("/");

  return (
    <>
      <div className="m-auto w-4/6 h-5/6 bg-gray-300 rounded-md p-6 flex flex-col">
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
            <TableHead>Name</TableHead>
            <TableHead>Add to group</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((member) => (
            <Member key={member._id} member={member} switchToHome={switchToHome}/>
          ))}
        </TableBody>
      </Table>
    </div>
    </>
  );
}

function Member({ member, switchToHome }) {
  const { addMember } = useContext(GroupContext);
  const {getUserInfo, user} = useContext(AuthContext)
  console.log("member",member);
  const handleAddMembers = () => {
    addMember(member._id, member.name, member.profileImage);
    switchToHome();
  };
  useEffect(() => {
    if (user && user._id) {
      getUserInfo(user._id);
    }
  }, [user?._id, getUserInfo]);
  return (
    <TableRow>
      <TableCell>
        <img
          alt="Avatar"
          className="rounded-full object-cover"
          height="40"
          src={member.profileImage || usericon}
          style={{
            aspectRatio: "40/40",
            objectFit: "cover",
          }}
          width="40"
        />
      </TableCell>
      <TableCell className="font-semibold">{member.name}</TableCell>
      <TableCell className="font-semibold">
        <Button
          className="rounded-full text-primary-foreground"
          variant="secondary"
          onClick={handleAddMembers}
        >
          Add
        </Button>
      </TableCell>
    </TableRow>
  );
}
