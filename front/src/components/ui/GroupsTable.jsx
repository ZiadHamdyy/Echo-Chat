import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "./table";
import usericon from "../../picture/user (2).png";
import { Button } from "./button";
import { Input } from "./input";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../context/ChatContext.jsx";
import { GroupContext } from "../../../src/context/GroupContext.jsx";
import { AuthContext } from "../../../src/context/AuthContext.jsx";
import { InputGroupFile } from "./GroupFile.jsx";
import { Toaster, toast } from "sonner";
import { OrbitProgress } from "react-loading-indicators";
// import { AuthContext } from "../../context/AuthContext.jsx";

export function GroupsTable() {
  const { allUsers /* , createChat  */ } = useContext(ChatContext);
  const { createGroup, createNewLoading, createNewError } =
    useContext(GroupContext);

  const [filteredMembers, setFilterdMembers] = useState([]);
  const [input, setInput] = useState("");
  const [inputGroup, setInputGroup] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (createNewError?.error) {
      toast(createNewError.message);
    }
  }, [createNewError]);

  useEffect(() => {
    if (input.trim() === "") {
      setFilterdMembers(allUsers);
    } else {
      const filtered = allUsers.filter((member) =>
        member.name.toLowerCase().startsWith(input.toLowerCase())
      );
      setFilterdMembers(filtered);
    }
  }, [input, allUsers]);

  function handleGroupOnChange(member) {
    console.log(member);
    const found = selectedUsers.some((user) => user._id === member._id);
    if (found) {
      setSelectedUsers((prev) =>
        prev.filter((userId) => userId._id !== member._id)
      );
    } else {
      setSelectedUsers((prev) => [
        ...prev,
        {
          _id: member._id,
          name: member.name,
          profileImage: member.profileImage,
        },
      ]);
    }
  }

  const handleCreateChat = async () => {
    createGroup(inputGroup, selectedUsers);
  };
  console.log(filteredMembers);
  return (
    <>
      {createNewLoading && (
        <div className="bg-black bg-opacity-50 absolute inset-0 flex items-center justify-center z-50">
          <OrbitProgress variant="dotted" color="#4d91ff" size="medium" text="Creating" textColor="" />
        </div>
      )}
      <Toaster />
      <div className="m-auto w-4/6 h-5/6 bg-gray-300 rounded-md p-6 flex flex-col ">
        <div className="flex justify-start items-center">
          <div className="">
            <Button
              className="rounded-full text-primary-foreground mx-4"
              variant="secondary"
              onClick={handleCreateChat}
            >
              Create Group
            </Button>
            <Input
              placeholder="Enter group name"
              value={inputGroup}
              onChange={(e) => setInputGroup(e.target.value)}
              className="max-w-fit px-4 m-4"
            />
          </div>
          <div className="mx-4">
            <InputGroupFile /* onFileSelect={handleFileSelect} */ />
          </div>
        </div>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <Member
                key={member._id}
                member={member}
                onClick={() => handleGroupOnChange(member)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function Member({ member, onClick }) {
  const [selected, setSelected] = useState(false);
  const { getUserInfo, user } = useContext(AuthContext);
  useEffect(() => {
    if (user && user._id) {
      getUserInfo(user._id);
    }
  }, [user?._id, getUserInfo]);
  return (
    <TableRow
      onClick={() => {
        onClick();
        setSelected(!selected);
      }}
      className={selected ? "bg-slate-200 hover:bg-slate-100" : ""}
    >
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
      <TableCell className="font-semibold"></TableCell>
    </TableRow>
  );
}
