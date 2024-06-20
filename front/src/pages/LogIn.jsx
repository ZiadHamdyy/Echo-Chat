import { Toaster, toast } from "sonner";
import { InputWithLabel } from "../components/ui/InputWithLabel.jsx";
import { Button } from "../components/ui/button.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import appicon from "../picture/sound-waves.png";
import React, { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";

export default function LogIN(/* { switchToSignup, switchToHome } */){
  const navigate = useNavigate();
  const { updateLoginInfo, loginError, loginLoading, logInInfo, loginUser, setLoginError} = useContext(AuthContext)
  useEffect(() => {
    if (loginError?.error) {
      toast(loginError.message);
    }
  }, [loginError]);
  const switchToSignup = () => {navigate('/signup');setLoginError(null)};
    return (
      <>
            <Toaster/>
            {loginLoading && (
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
            <div className="text-gray-800 text-3xl font-bold	mt-7 mb-32">Log In</div>
            <div className="w-full h-2/6 flex flex-col flex-wrap justify-evenly">
              <Button onClick={switchToSignup}>Sign Up</Button>
              <Button>Google</Button>
            </div>
          </div>
  
          <div className="bg-gray-200 w-8/12 flex flex-col flex-wrap justify-center items-center px-8 pb-8">
              <div className="w-full h-2/6 flex flex-col flex-wrap justify-around items-center">
                  <InputWithLabel textname="email" onChange={(e) => updateLoginInfo( {...logInInfo, email: e.target.value})}/>
                  <InputWithLabel textname="password" onChange={(e) => updateLoginInfo( {...logInInfo, password: e.target.value})}/>
              </div>
  
                <Button className="w-6/12 mt-10" onClick={loginUser}>Log In</Button>
  
            </div>
      </>
    );
  }