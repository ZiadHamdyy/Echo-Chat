import appicon from "../picture/sound-waves.png";
import { Button } from "../components/ui/button.jsx";
import { InputFile } from "../components/ui/File.jsx";
import { InputWithLabel } from "../components/ui/InputWithLabel.jsx";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Toaster, toast } from "sonner";
import React from "react";
import { useNavigate } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";

export default function Signup(/* { switchToLogin } */) {
  const navigate = useNavigate();
  const {
    registerInfo,
    updateRegisterInfo,
    registerUser,
    registerError,
    registerLoading,
    setRegisterError,
  } = useContext(AuthContext);
  useEffect(() => {
    if (registerError?.error) {
      toast(registerError.message);
    }
  }, [registerError]);
  const switchToLogin = () => {
    navigate("/login");
    setRegisterError(null);
  };
  /*   const [imageSrc, setImageSrc] = useState('');
  const [imageBinary, setImageBinary] = useState('');

  const handleFileSelect = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setImageSrc(reader.result);
        setImageBinary(base64String);
        updateRegisterInfo({ ...registerInfo, profileImage: base64String });
      };
      reader.readAsDataURL(file);
    } else {
      setImageSrc('');
      setImageBinary('');
    }
  };*/
  return (
    <>
      <Toaster />
      {registerLoading && (
        <div className="bg-black bg-opacity-50 absolute inset-0 flex items-center justify-center z-50">
          <OrbitProgress
            variant="dotted"
            color="#4d91ff"
            size="medium"
            text="Creating"
            textColor=""
          />
        </div>
      )}
      <div className="bg-gray-300 w-4/12 flex justify-center items-center flex-col flex-wrap p-8">
        <div className="bg-inherit w-20 h-20">
          <img className="w-20" src={appicon} alt="" />
        </div>
        <div className="text-gray-800 text-3xl font-bold	mt-7 mb-32">
          Sign Up
        </div>
        <div className="w-full h-2/6 flex flex-col flex-wrap justify-evenly">
          <Button onClick={switchToLogin}>Log In</Button>
        </div>
      </div>
      <div className="bg-gray-200 w-8/12 flex flex-col flex-wrap justify-center items-center px-8 pb-8">
        <div className="w-80 h-64 flex justify-center items-center flex-col">
          {/* <div className="bg-gray-200 rounded-full	h-36 w-36">
              {imageSrc ? (
              <img className="w-34 rounded-full" src={imageSrc} alt="Selected" onChange={(e) => updateRegisterInfo( {...registerInfo, profileImage: imageBinary})}/>
            ) : (
              <img className="w-34" src={usericon} alt="Placeholder" onChange={(e) => updateRegisterInfo( {...registerInfo, profileImage: imageBinary})}/>
            )}
              </div> */}
          <div>
            <InputFile /* onFileSelect={handleFileSelect} */ />
          </div>
        </div>
        <div className="w-full h-2/6 flex flex-col flex-wrap justify-between items-center">
          <InputWithLabel
            textname="name"
            onChange={(e) =>
              updateRegisterInfo({ ...registerInfo, name: e.target.value })
            }
          />
          <InputWithLabel
            textname="email"
            onChange={(e) =>
              updateRegisterInfo({ ...registerInfo, email: e.target.value })
            }
          />
          <InputWithLabel
            textname="password"
            onChange={(e) =>
              updateRegisterInfo({ ...registerInfo, password: e.target.value })
            }
          />
        </div>
        <Button
          className="w-6/12 mt-10"
          onClick={/* switchToLogin */ registerUser}
        >
          Sign Up
        </Button>
      </div>
    </>
  );
}
