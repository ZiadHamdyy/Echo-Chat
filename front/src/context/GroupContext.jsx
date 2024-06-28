import { createContext, useCallback, useEffect, useState } from "react";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
  url,
} from "../utils/services";
import { useNavigate } from "react-router-dom";
import { useSocket } from "./SocketContext";

export const GroupContext = createContext();

export const GroupContextProvider = ({ children, user }) => {
  const [userGroups, setUserGroups] = useState([]);
  const [userGroupsError, setUserGroupsError] = useState(null);
  const [userGroupsLoading, setUserGroupsLoading] = useState(false);

  const [currentGroup, setCurrentGroup] = useState(null);

  const [groupmessages, setGroupMessages] = useState(null);
  const [groupmessagesLoading, setGroupMessagesLoading] = useState(false);
  const [groupmessagesError, setGroupMessagesError] = useState(null);
  const [createNewLoading, setCreateNewGroupLoading] = useState(null);
  const [createNewError, setCreateNewGroupError] = useState(null);
  const [createNewMessage, setCreateNewGroupMessage] = useState(null);
  const [newMessageError, setNewGroupMessageError] = useState(null);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [currentMember, setCurrentMember] = useState([]);
  const [membersError, setMembersError] = useState([]);
  const [membersLoading, setMembersLoading] = useState([]);
  const [editGroupMessageError, setEditGroupMessageError] = useState(null);
  const [deleteGroupMessageError, setDeleteGroupMessageError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [TypingGroup, setTypingGroup] = useState(false);
  const [IsTypingGroup, setIsTypingGroup] = useState(false);
  const navigate = useNavigate();
  const switchToHome = () => navigate("/");
  const socket = useSocket();

/*   useEffect(() => {
    if (socket && currentGroup?._id) {
      socket.emit("join", currentGroup._id);
    }
  }, [socket, currentGroup]);

  useEffect(() => {
    socket?.on("getMessage", (message) => {
      setGroupMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      socket?.off("getMessage");
    };
  }, [socket]); */

  useEffect(() => {
    socket?.on('getMessage group', (message) => {
        // if (!currentGroup || message.chatId !== currentGroup._id) return;//add notification
        console.log("message",message);
        setGroupMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
        socket?.off('getMessage group');
    };
}, [currentGroup, socket, user]);
  
useEffect(() => {
    socket?.on('typing', () => {setIsTypingGroup(true)});
    socket?.on("stop typing", () => {setIsTypingGroup(false)});
}, [socket]);

  useEffect(() => {
    const getUserGroups = async () => {
      if (user?._id) {
        setUserGroupsLoading(true);
        setUserGroupsError(null);
        const response = await getRequest(
          `${url}/groups/getusergroups/${user?._id}`
        );
        setUserGroupsLoading(false);
        if (response.error) {
          return setUserGroupsError(response);
        }
        setUserGroups(response);
      }
    };
    getUserGroups();
  }, [user]);

  const createGroup = useCallback(
    async (name, members) => {
      setCreateNewGroupLoading(true);
      setCreateNewGroupError(null);
      const response = await postRequest(
        `${url}/groups/creategroup/${user?._id}`,
        JSON.stringify({ name, profileImage, members })
      );
      setCreateNewGroupLoading(false);
      if (response.error) {
        return setCreateNewGroupError(response);
      }
      setCreateNewGroupError(null);
      setUserGroups((prev) => [...prev, response]);
      switchToHome();
    },
    [user?._id, profileImage, socket]
  );

  useEffect(() => {
    const getGroupMessages = async () => {
      setGroupMessagesLoading(true);
      setGroupMessagesError(null);
      const response = await getRequest(`${url}/messages/${currentGroup?._id}`);
      setGroupMessagesLoading(false);
      if (response.error) {
        return setGroupMessagesError(response);
      }
      setGroupMessages(response);
      socket?.emit('join group', currentGroup?._id);
    };
    getGroupMessages();
  }, [currentGroup]);

  const newgroupMessage = useCallback(
      async (text, senderName, chatId, setTextMessage) => {
          if (!text) {
        return console.log("Message cannot be empty");
      }
      const response = await postRequest(
        `${url}/groups/createmessage`,
        JSON.stringify({ text, senderName, chatId })
      );
      if (response.error) {
        return setNewGroupMessageError(response);
      }
      setCreateNewGroupMessage(response);
      setGroupMessages((prev) => [...prev, response]);
      setTextMessage("");
      socket.emit("sendMessage group", response);
    }, [currentGroup, socket, user]);
  useEffect(() => {
    const getGroupMembers = async () => {
      if (currentGroup?._id) {
        setMembersLoading(true);
        setMembersError(null);
        const response = await getRequest(
          `${url}/groups/getgroupmembers/${currentGroup?._id}`
        );
        setMembersLoading(false);
        if (response.error) {
          return setMembersError(response);
        }
        setAdmin(response.admin);
        setMembers(response.members);
      }
    };
    getGroupMembers();
  }, [currentGroup]);

  useEffect(() => {
    const fetchAvailableMembers = async () => {
      try {
        const response = await getRequest(`${url}/users/`);
        if (response.error) {
          console.log(response);
          return;
        }

        const filteredMembers = response.filter((member) => {
          let isMemberInGroup = members.some(
            (groupMember) => groupMember._id === member._id
          );
          return !isMemberInGroup;
        });

        setAvailableMembers(filteredMembers);
      } catch (error) {
        console.error("Error fetching available members:", error);
      }
    };

    fetchAvailableMembers();
  }, [members]);

  const deleteGroupMessage = useCallback(async (messageId) => {
    if (messageId) {
      const response = await deleteRequest(
        `${url}/messages/deletemessage/${messageId}`
      );
      if (response.error) {
        setDeleteGroupMessageError(response);
        console.log("Error deleting message");
      } else {
        setGroupMessages((prev) =>
          prev.filter((message) => message._id !== messageId)
        );
      }
    }
  }, []);
  const editGroupMessage = useCallback(async (messageId, newText) => {
    if (messageId && newText) {
      const response = await putRequest(
        `${url}/messages/editmessage/${messageId}`,
        JSON.stringify({ text: newText })
      );
      if (response.error) {
        setEditGroupMessageError(response);
        console.log("Error editing message");
      } else {
        setGroupMessages((prev) =>
          prev.map((message) =>
            message._id === messageId ? { ...message, text: newText } : message
          )
        );
      }
    }
  }, []);

  const addMember = useCallback(
    async (memberId, name, profileImage) => {
      const response = await postRequest(
        `${url}/groups/addmember/${currentGroup?._id}`,
        JSON.stringify({ memberId, name, profileImage })
      );
      if (response.error) {
        return setMembersError(response);
      }
      setMembers(response.members);
    //   socket.emit("join", currentGroup._id);
    },
    [currentGroup?._id]
  );

  const RemoveMember = useCallback(
    async (memberId) => {
      const response = await deleteRequest(
        `${url}/groups/removemember/${currentGroup?._id}`,
        JSON.stringify({ memberId })
      );
      if (response.error) {
        return setMembersError(response);
      }
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member._id !== memberId)
      );
    },
    [currentGroup?._id]
  );

  const leaveMember = useCallback(
    async (memberId) => {
      const response = await deleteRequest(
        `${url}/groups/leavemember/${currentGroup?._id}`,
        JSON.stringify({ memberId })
      );
      if (response.error) {
        return setMembersError(response);
      }
      setCurrentGroup(null);
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member._id !== memberId)
      );
    },
    [currentGroup?._id]
  );

  const deleteGroup = useCallback(async () => {
    const response = await deleteRequest(
      `${url}/groups/deletegroup/${currentGroup?._id}`
    );
    if (response.error) {
      return console.log(response);
    }
    setCurrentGroup(null);
    setGroupMessages([]);
    setUserGroups((prev) =>
      prev.filter((group) => group._id !== currentGroup?._id)
    );
  }, [currentGroup, setUserGroups]);

  const deleteAllGroupMessages = useCallback(async () => {
    const response = await deleteRequest(
      `${url}/groups/deleteallgroupmessages/${currentGroup?._id}`
    );
    if (response.error) {
      return console.log(response);
    }
    setGroupMessages([]);
    console.log(response.message);
  }, [currentGroup]);

  const handleFileChange = useCallback((e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const imageResult = reader.result;
      setProfileImage(imageResult);
    };
  }, []);

  return (
    <GroupContext.Provider
      value={{
        createNewError,
        createNewLoading,
        handleFileChange,
        profileImage,
        availableMembers,
        deleteAllGroupMessages,
        deleteGroup,
        admin,
        leaveMember,
        RemoveMember,
        addMember,
        deleteGroupMessage,
        editGroupMessage,
        currentMember,
        setCurrentMember,
        members,
        newgroupMessage,
        groupmessages,
        setGroupMessages,
        groupmessagesLoading,
        groupmessagesError,
        createGroup,
        userGroups,
        userGroupsError,
        userGroupsLoading,
        currentGroup,
        setCurrentGroup,
        TypingGroup, setTypingGroup, IsTypingGroup, setIsTypingGroup,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
