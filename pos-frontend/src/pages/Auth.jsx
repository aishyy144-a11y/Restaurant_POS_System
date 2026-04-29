import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import restaurant from "../assets/images/restaurant-img.jpg"
import logo from "../assets/images/logo.png"
import lightLogo from "../assets/images/Light-logo.png"
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";

const Auth = () => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  const logoSrc = isDark ? logo : lightLogo;
  const location = useLocation();
  const navigate = useNavigate();
  const selectedRole = location.state?.role;

  useEffect(() => {
    document.title = "POS | Auth"
  }, [])

  const [isRegister, setIsRegister] = useState(false);

  // Theme-aware classes
  const rightBg = isDark ? "bg-[#1a1a1a]" : "bg-white";
  const textColor = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  const textSecondary = isDark ? "text-[#ababab]" : "text-gray-600";
  const headingColor = isDark ? "text-yellow-400" : "text-yellow-500";
  const linkColor = isDark ? "text-yellow-400" : "text-yellow-500";
  const labelColor = isDark ? "text-[#ababab]" : "text-gray-600";

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-cover">
        {/* BG Image */}
        <img className="w-full h-full object-cover" src={restaurant} alt="Restaurant Image" />

        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-80"></div>

        {/* Quote at bottom */}
        <blockquote className="absolute bottom-10 px-8 mb-10 text-2xl italic text-white">
          "Serve customers the best food with prompt and friendly service in a
          welcoming atmosphere, and they'll keep coming back."
          <br />
          <span className="block mt-4 text-yellow-400">- Founder of Aishelicious</span>
        </blockquote>
      </div>

      {/* Right Section */}
      <div className={`w-full lg:w-1/2 h-full ${rightBg} p-6 md:p-10 flex flex-col justify-center overflow-y-auto`}>
        <div className="flex flex-col items-center gap-2 mt-4">
          <img
            src={logoSrc}
            alt="Aishelicious Logo"
            className={`h-12 w-12 md:h-14 md:w-14 border-2 rounded-full p-1 ${isDark ? "border-gray-600" : "border-gray-300 bg-white"}`}
          />
          <h1 className={`text-lg ${isDark ? 'font-semibold' : 'font-bold'} ${textColor} tracking-wide`}>Aishelicious</h1>
        </div>

        {selectedRole ? (
             <div className="mt-6 md:mt-10 mb-6 md:mb-10 text-center">
               <h2 className={`text-3xl md:text-4xl font-semibold ${headingColor} mb-2 capitalize`}>
                 Hello {selectedRole}
               </h2>
               <p className={`${labelColor}`}>Please enter your credentials</p>
             </div>
        ) : (
            <h2 className={`text-3xl md:text-4xl text-center mt-6 md:mt-10 font-semibold ${headingColor} mb-6 md:mb-10`}>
              {isRegister ? "Employee Registration" : "Employee Login"}
            </h2>
        )}

        {/* Components */}  
        <div className="w-full max-w-md mx-auto">
          {isRegister ? <Register setIsRegister={setIsRegister} /> : <Login selectedRole={selectedRole} />}
        </div>


        {!selectedRole && (
            <div className="flex justify-center mt-6">
              <p className={`text-sm ${textSecondary}`}>
                {isRegister ? "Already have an account?" : "Don't have an account?"}
                <a onClick={() => setIsRegister(!isRegister)} className={`${linkColor} font-semibold hover:underline cursor-pointer ml-1`}>
                  {isRegister ? "Log in" : "Sign up"}
                </a>
              </p>
            </div>
        )}

        <div className="mt-6 flex justify-center pb-8">
          <button 
            onClick={() => navigate(-1)} 
            className={`${isDark ? "bg-[#1f1f1f] text-white hover:bg-[#333]" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} px-4 py-2 rounded-lg transition-colors font-medium text-sm`}
          >
            Back to Role Selection
          </button>
        </div>


      </div>
    </div>
  );
};

export default Auth;
