import React from "react";
import loginImage from "../../../assets/images/login-page-doc.png";
import pluseImage from "../../../assets/images/pluse-frame.png";
import logo from "../../../assets/images/logo/logo.png";
import Dhan from "../../../assets/images/logo/dhanvantari-logo-blue.svg"
import LoginForm from "../components/LoginForm";
import { Marquee } from "@/components/Header";
import { getAuthToken } from "../../../services/cookies";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import HospitalLoader from "../../../components/loader/HospitalLoader";
import { ROUTES } from "../../../routes/helper";

const Login = () => {
  const token = getAuthToken();
  const { userInfo, isLoading } = useSelector((state) => state.user);

  if (token && isLoading) {
    return <HospitalLoader />;
  }

  // Redirect logged-in users to their respective dashboards
  if (token && userInfo?.response) {
    const path =
      userInfo.response.role === "O" ? ROUTES.ONBOARD : ROUTES.DASHBOARD;
    return <Navigate to={path} replace />;
  }

  return (
    <div className="overflow-hidden">
      <Marquee />
      <div className="flex flex-col lg:flex-row h-screen">
        <div className="h-full w-full lg:w-[55%] px-16 py-12 relative bg-white flex flex-col justify-between">
          <div>
            <div className="w-[350px]">
              <img src={Dhan} alt="logo" />
            </div>
            <LoginForm />
          </div>

          <img
            src={pluseImage}
            alt="Plus Icon Frame"
            className="absolute bottom-0 right-0"
          />
        </div>

        {/* Right Side */}
        <div className="hidden lg:flex relative lg:w-[45%] h-full">
          <img
            src={loginImage}
            alt="Login Illustration"
            className="!w-full !h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary to-[#175E9E00] opacity-60" />

          <div className="absolute bottom-12 left-12 text-white z-10">
            <h2 className="text-3xl font-bold mb-2">India’s #1</h2>
            <p className="text-lg">AI Powered SaaS Base HIMS</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
