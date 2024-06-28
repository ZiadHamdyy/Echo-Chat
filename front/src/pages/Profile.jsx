import React, { useContext, useEffect, useState } from "react";
import { InputProfileFile } from "../components/ui/ProfileFile.jsx";
import { InputWithLabel } from "../components/ui/InputWithLabel.jsx";
import { Button } from "../components/ui/button.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { Toaster, toast } from "sonner"
import { DeleteProfile } from "../components/my_components/DeleteProfile.jsx";

export default function Profile() {
  const { user, getUserInfo, UpdateUser, profileImage, UpdatePassword, updateDataError, deleteUser } =
    useContext(AuthContext);
  const [showChangePass, setShowChangePass] = useState(false);
  const [showDeleteProfile, setShowDeleteProfile] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  console.log(oldPassword);
  console.log(newPassword);
  useEffect(() => {
    if (user && user._id) {
      getUserInfo(user._id);
    }
  }, [user, user?._id, getUserInfo]);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  useEffect(() => {
    setOldPassword("");
    setNewPassword("");
  }, [user]);

  useEffect(() => {
    if (updateDataError?.error) {
      toast(updateDataError.message);
    }
  }, [updateDataError]);
  return (
    <>
    <Toaster/>
      <div className="bg-gray-200 w-full flex flex-col flex-wrap justify-center items-center px-8 pb-8">
        {!showChangePass && (
          <div className="h-48 w-full mt-10">
            <InputProfileFile /* onFileSelect={handleFileSelect} */ />
          </div>
        )}
        {!showChangePass && (
          <div className="w-full h-2/6 flex flex-col flex-wrap justify-evenly items-center">
            <InputWithLabel
              textname={user.name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputWithLabel
              textname={user.email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}
        {showChangePass && (
          <InputWithLabel textname="Old Password" className="mt-10" onChange={(e) => setOldPassword(e.target.value)}/>
        )}
        {showChangePass && (
          <InputWithLabel textname="New Password" className="mt-10 mb-10" onChange={(e) => setNewPassword(e.target.value)}/>
        )}
        <div className="flex flex-col w-4/12">
          {!showChangePass && (
            <Button
              className=""
              onClick={() => {
                UpdateUser(name, email, profileImage);
              }}
            >
              Confirm Changes
            </Button>
          )}
          {showChangePass && (
            <Button
              className="mt-10"
              onClick={() => {
                UpdatePassword(oldPassword, newPassword);
              }}
            >
              Confirm Changes
            </Button>
          )}
          {showChangePass && (
            <Button className="mt-10" onClick={() => setShowChangePass(false)}>
              Change Profile
            </Button>
          )}
          {!showChangePass && (
            <div className="flex justify-evenly">
              {
                <Button
                  className="mt-10"
                  onClick={() => setShowChangePass(true)}
                >
                  Change Password
                </Button>
              }
              <Button className="mt-10" onClick={() => {setShowDeleteProfile(true)}}>Delete Profile</Button>
            </div>
          )}
        </div>
      </div>
      {showDeleteProfile && (
        <div className="absolute z-50 pointer-events-auto inset-0 bg-black bg-opacity-50 flex justify-center items-center animation-fadeIn">
          <div className="animation-slideIn">
            <DeleteProfile onClose={() => setShowDeleteProfile(false)} />
          </div>
        </div>
      )}
    </>
  );
}
