import { createContext, useCallback, useEffect, useState } from "react";
import { deleteRequest, getRequest, postRequest, putRequest, url } from "../utils/services";
import usericon from "../picture/user (2).png";
import { useNavigate } from "react-router-dom";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [registerError, setRegisterError] = useState(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
    profileImage: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [updateDataError, setUpdateDataError] = useState(null);
  const [logInInfo, setLogInInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const switchToHome = () => navigate("/");

  useEffect(() => {
    const user = localStorage.getItem("token");
    setUser(JSON.parse(user));
  }, []);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo((prev) => ({ ...prev, ...info }));
  }, []);
  const registerUser = useCallback(async () => {
    setRegisterLoading(true);
    setRegisterError(null);
    // const imgres = await postRequest(`${url}/users/img`, JSON.stringify({image: registerInfo.profileImage}));
    const response = await postRequest(
      `${url}/users/register`,
      JSON.stringify(registerInfo)
    );
    setRegisterLoading(false);
    if (response.error) {
      return setRegisterError(response);
    }
    console.log("local", response);
    localStorage.setItem("token", JSON.stringify(response));
    setUser(response);
    setRegisterError(null);
  }, [registerInfo]);

  const loginUser = useCallback(async () => {
    setLoginLoading(true);
    const response = await postRequest(
      `${url}/users/signin`,
      JSON.stringify(logInInfo)
    );
    setLoginLoading(false);

    if (response.error) {
      return setLoginError(response);
    }
    localStorage.setItem("token", JSON.stringify(response));
    setUser(response);
    setLoginError(null);
  }, [logInInfo]);

  const updateLoginInfo = useCallback((info) => {
    setLogInInfo((prev) => ({ ...prev, ...info }));
  }, []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const getUserInfo = useCallback(async (userId) => {
    try {
      const response = await getRequest(`${url}/users/find/${userId}`);
      if (!response.error) {
        setUser(response);
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  }, []);

  /* useEffect(() => {
    if (user?.profileImage) {
      setImg(`data:image/png;base64,${user.profileImage}`);
    }
  }, [user]); */

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const imageResult = reader.result;
      setProfileImage(imageResult);
      updateRegisterInfo({ profileImage: imageResult });
    };
  }, [updateRegisterInfo]);

  const UpdateUser = useCallback(async (name, email, profileImage) => {
    setUpdateDataError(null)
    try {
      const response = await putRequest(
        `${url}/users/updateuser/${user?._id}`,
        JSON.stringify({name, email, profileImage})
      );
      if(response.error){
        return setUpdateDataError(response)
      }
      setUser(response);
      switchToHome();
    } catch (error) {
      setUpdateDataError(error)
    }
    setUpdateDataError(null);
  }, [user?._id]);

  const UpdatePassword = useCallback(async (oldPassword, newPassword) => {
    try {
      const response = await putRequest(
        `${url}/users/updatepassword/${user?._id}`,
        JSON.stringify({oldPassword, newPassword})
      );
      if(response.error){
        return setUpdateDataError(response)
      }
      setUser(response);
      switchToHome();
    } catch (error) {
      setUpdateDataError(error)
    }
  }, [user?._id]);
  const deleteUser = useCallback(async () => {
    try {
      const response = await deleteRequest(`${url}/users/deleteuser/${user?._id}`);
      if (response.error) {
        return setUpdateDataError(response);
      }
      logoutUser();
      switchToHome();
    } catch (error) {
      setUpdateDataError(error);
    }
  }, [user?._id, logoutUser]);

  return (
    <AuthContext.Provider
      value={{
        getUserInfo,
        user,
        registerError,
        setRegisterError,
        registerLoading,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        loginError,
        setLoginError,
        loginLoading,
        logInInfo,
        loginUser,
        updateLoginInfo,
        logoutUser,
        handleFileChange,
        profileImage,
        UpdateUser,
        UpdatePassword,
        updateDataError,
        deleteUser  /* , getUserInfo, userInfo */,
        // img,
      }}
    >

      {children}
    </AuthContext.Provider>
  );
};
