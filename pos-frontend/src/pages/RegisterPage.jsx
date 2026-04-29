import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import restaurant from "../assets/images/restaurant-img.jpg";
import logo from "../assets/images/logo.png";
import lightLogo from "../assets/images/Light-logo.png";
import Register from "../components/auth/Register";
import { IoArrowBackOutline } from "react-icons/io5";

const RegisterPage = () => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  const logoSrc = isDark ? logo : lightLogo;
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "POS | Create Account";
  }, []);

  // Theme-aware classes
  const rightBg = isDark ? "bg-[#1a1a1a]" : "bg-white";
  const textColor = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  const headingColor = isDark ? "text-yellow-400" : "text-yellow-500";

  return (
    <div className={`flex min-h-screen w-full overflow-y-auto items-center justify-center ${rightBg} p-2 md:p-4 pb-24 md:pb-4`}>
      {/* Main Card */}
      <div className={`w-full max-w-4xl ${isDark ? "bg-[#1f1f1f]" : "bg-white"} shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px] md:h-[550px]`}>
        
        {/* Left Side - Info & Branding */}
        <div className={`w-full md:w-5/12 p-6 md:p-8 flex flex-col justify-between relative ${isDark ? "bg-[#262626]" : "bg-blue-50"}`}>
          
          {/* Back Button */}
          <button
              onClick={() => navigate("/dashboard")}
              className="self-start bg-[#025cca] p-2 text-xl font-bold rounded-full text-white hover:bg-[#024aa8] transition mb-4 md:mb-6"
              title="Back to Dashboard"
          >
              <IoArrowBackOutline />
          </button>

          <div className="flex flex-col items-start gap-3 md:gap-4 mt-2">
            <div className="flex items-center gap-3">
              <img
                src={logoSrc}
                alt="Aishelicious Logo"
                className={`h-10 w-10 md:h-14 md:w-14 border-2 rounded-full p-1 ${isDark ? "border-gray-600" : "border-gray-300 bg-white"}`}
              />
              <h1 className={`text-lg md:text-xl ${isDark ? "font-semibold" : "font-bold"} ${textColor} tracking-wide`}>
                Aishelicious
              </h1>
            </div>
            
            <div className="mt-4 md:mt-6">
              <h2 className={`text-2xl md:text-3xl font-bold ${headingColor} mb-2 leading-tight`}>
                Create New Account
              </h2>
              <p className={`text-sm md:text-base ${isDark ? "text-[#ababab]" : "text-gray-600"}`}>
                Enter employee details to register a new user.
              </p>
            </div>
          </div>

          <div className={`mt-6 md:mt-auto text-[10px] md:text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            &copy; {new Date().getFullYear()} Aishelicious POS
          </div>
        </div>

        {/* Right Side - Form */}
        <div className={`w-full md:w-7/12 p-4 md:p-6 flex flex-col justify-center ${isDark ? "bg-[#1a1a1a]" : "bg-white"}`}>
          <Register 
              buttonText="Create new account" 
              onSuccess={() => navigate("/dashboard")} 
              successMessage="New account is created"
          />
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
