import {createContext, useCallback, useEffect, useState } from "react";
import { deleteRequest, getRequest, postRequest, putRequest, url } from "../utils/services";
import { useSocket } from "./SocketContext";

export const ChatContext = createContext()
export const ChatContextProvider = ({children, user}) => {
    const [userChats, setUserChats] = useState(null)
    const [allUsers, setAllUsers] = useState(null)
    const [userChatsLoading, setUserChatsLoading] = useState(false)
    const [userChatsError, setUserChatsError] = useState(null)

    const [availableChats, setAvailableChats] = useState([])

    const [currentChat, setCurrentChat] = useState(null)

    const [messages, setMessages] = useState(null)
    const [messagesLoading, setMessagesLoading] = useState(false)
    const [messagesError, setMessagesError] = useState(null)
    const [currentMessage, setCurrentMessage] = useState(null)
    // eslint-disable-next-line
    const [createNewMessage, setCreateNewMessage] = useState(null)
    // eslint-disable-next-line
    const [newMessageError, setNewMessageError] = useState(null)
    // eslint-disable-next-line
    const [deleteMessageError, setDeleteMessageError] = useState(null);
        // eslint-disable-next-line
    const [editMessageError, setEditMessageError] = useState(null);
        // eslint-disable-next-line
    const [DeleteChatError, setDeleteChatError] = useState(null);

    const [chatClosed, setChatClosed] = useState(false);

    const [Typing, setTyping] = useState(false);
    const [IsTyping, setIsTyping] = useState(false);
    const socket = useSocket()
 
/*       useEffect(() => {
        if (socket && currentChat?._id) {
          socket.emit('joinChat', currentChat._id);
        }
      }, [socket, currentChat]); */


/*     useEffect(() => {
        const recipientId = currentChat?.members.find((member) => member !== user?._id);
        if (recipientId) {
            socket.emit("sendMessage",{...newMessage, recipientId});
        }
    }, [currentChat,socket, user]); */

    useEffect(() => {
        socket?.on('getMessage chat', (message) => {
            console.log("message",message);
            if (!currentChat || message.chatId !== currentChat._id) return;//add notification
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        return () => {
            socket?.off('getMessage chat');
        };
    }, [currentChat, socket, user]);

    useEffect(() => {
        socket?.on('typing', () => {setIsTyping(true)});
        socket?.on("stop typing", () => {setIsTyping(false)});
    }, [socket]);

    

    useEffect(() => {
        const getUserChats = async () =>{
            if(user?._id){
                setUserChatsLoading(true)
                setUserChatsError(null)
                const response = await getRequest(`${url}/chats/${user?._id}`)
                setUserChatsLoading(false)
                if(response.error){
                    return setUserChatsError(response)
                }
                setUserChats(response)
            }
        }
        getUserChats()
    },[user])
    
    useEffect(() => {
        const getAllUsers = async () =>{
                const response = await getRequest(`${url}/users/`)
                if(response.error){
                    return console.log(response)
                }
                const AllUsers = response.filter((u) => u._id !== user?._id)
                setAllUsers(AllUsers)
        }
        getAllUsers()
    },[user?._id])

    useEffect(() => {
        const getUserChats = async () =>{
                const response = await getRequest(`${url}/users/`)
                if(response.error){
                    return console.log(response)
                }
                const avalChats = response.filter((u) => {
                    let ChatCreated = false

                    if (user?._id === u._id)
                        return false
                    if(userChats){
                        ChatCreated = userChats?.some((chat) => {
                            return chat.members[0] === u._id || chat.members[1] === u._id
                        })
                    }
                    return !ChatCreated
                })
                setAvailableChats(avalChats)
        }
        getUserChats()
    },[userChats, user?._id])
    
    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(`${url}/chats/createchat`, JSON.stringify({firstId, secondId}))
        if(response.error){
            return console.log(response)
        }
        setUserChats((prev) => [...prev, response])
    },[])

    /* const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat)
    },[]) */

    useEffect(() => {
        const getMessages = async () =>{
                setMessagesLoading(true)
                setMessagesError(null)
                const response = await getRequest(`${url}/messages/${currentChat?._id}`)
                setMessagesLoading(false)
                if(response.error){
                    return setMessagesError(response)
                }
                setMessages(response)
                socket?.emit('join chat', currentChat?._id);
        }
        getMessages()
    },[currentChat])

    const newMessage = useCallback(async (text, senderName, chatId, setTextMessage) => {
        if(!text && !currentChat){
            return console.log("Message cannot be empty");
        }
        const response = await postRequest(`${url}/messages/createmessage`, JSON.stringify({text, senderName, chatId}))
        if(response.error){
            return setNewMessageError(response)
        }
        setCreateNewMessage(response)
        setMessages((prev) => [...prev, response])
        setTextMessage("")
/*         const recipientId = currentChat.members.find((member) => member !== user?._id);
        if (recipientId) { */
          socket.emit("sendMessage chat", response);
        // }
  }, [currentChat, socket, user])

    const deleteAllMessages = useCallback(async () => {
        if (currentChat?._id) {
            const response = await deleteRequest(`${url}/messages/deleteallmessages/${currentChat?._id}`);
            if (response.error) {
                console.log("Error deleting messages");
            } else {
                setMessages([]);
            }
        }
    }, [currentChat]);

    const deleteMessage = useCallback(async (messageId) => {
        if (messageId) {
            const response = await deleteRequest(`${url}/messages/deletemessage/${messageId}`);
            if (response.error) {
                setDeleteMessageError(response);
                console.log("Error deleting message");
            } else {
                setMessages((prev) => prev.filter(message => message._id !== messageId)); // Remove the deleted message from state
            }
        }
    }, []);

    const editMessage = useCallback(async (messageId, newText) => {
        if (messageId && newText) {
            const response = await putRequest(`${url}/messages/editmessage/${messageId}`, JSON.stringify({ text: newText }))
            if (response.error) {
                setEditMessageError(response)
                console.log("Error editing message")
            } else {
                setMessages((prev) => prev.map(message => message._id === messageId ? { ...message, text: newText } : message))
            }
        }
    }, [])

    const deleteChat = useCallback(async (chatId) => {
        if (chatId) {
            const response = await deleteRequest(`${url}/chats/deletechat/${chatId}`);
            if (response.error) {
                setDeleteChatError(response);
                console.log("Error deleting chat");
            } else {
                setUserChats((prev) => prev.filter(chat => chat._id !== chatId));
                setChatClosed(true)
            }
        }
    }, []);

    return (
    <ChatContext.Provider value={{IsTyping, setIsTyping, Typing, setTyping, allUsers, chatClosed, setChatClosed, deleteChat, editMessage, setCurrentMessage, currentMessage, deleteMessage, deleteAllMessages, newMessage, setCurrentChat, currentChat, userChats, userChatsLoading, userChatsError, availableChats, createChat, messages, messagesLoading, messagesError}}>
        {children}
        </ChatContext.Provider>
    )
}