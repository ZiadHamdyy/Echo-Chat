import { useEffect, useState } from "react"
import { getRequest, url } from "../utils/services.js"

export const RecipientUser = (chat, user) =>{
    const [recipientUser, setRecipientUser] = useState(null)
    const [recipientUserError, setRecipientUserError] = useState(null)
    const recipientId = chat?.members?.find((id) => id !== user?._id)
    /* useEffect(() => {
        setRecipientUser(null)
    }, [userChats, setRecipientUser]); */
    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) return null

            const response = await getRequest(`${url}/users/find/${recipientId}`)
            if (response?.error) {
                return setRecipientUserError(response)
            }
            setRecipientUser(response)
        }
        getUser()
    },[recipientId])

    return { recipientUser, recipientUserError }
}