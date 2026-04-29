import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaUserShield, FaUserTie, FaConciergeBell, FaUtensils, FaTimes, FaFire } from "react-icons/fa";
import logo from "../assets/images/logo.png";
import lightLogo from "../assets/images/Light-logo.png";
import restaurant from "../assets/images/restaurant-img.jpg";

const RoleSelection = () => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoSrc = isDark ? logo : lightLogo;

  useEffect(() => {
    // Prevent back navigation to authenticated pages after logout
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Theme-aware classes
  const rightBg = isDark ? "bg-[#1a1a1a]" : "bg-[#f5f5f5]";
  const cardBg = isDark ? "bg-[#262626]" : "bg-white";
  const textColor = isDark ? "text-white" : "text-gray-800";
  const hoverClass = "hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg";

  const handleRoleSelect = (role) => {
    if (role === "admin") {
      navigate("/admin-login");
    } else if (role === "kitchen") {
      navigate("/kitchen-login");
    } else {
      // Navigate to Auth (Login) page with selected role
      navigate("/auth", { state: { role } });
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      {/* Left Section (Image) */}
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

      {/* Right Section (Options) */}
      <div className={`w-full lg:w-1/2 h-full ${rightBg} flex flex-col items-center justify-center p-4 overflow-y-auto`}>
        <div className="w-full max-w-xl">
          <div className="text-center mb-6 mt-4">
            <img src={logoSrc} alt="Logo" className="w-16 mx-auto mb-2" />
            <h1 className={`${textColor} text-xl md:text-2xl font-['cursive'] font-bold mb-1`}>Welcome to Aishelicious POS System</h1>
            <p className={`${isDark ? "text-gray-400" : "text-gray-600"} text-sm`}>Select your role to continue</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 md:gap-4 pb-8">
            {/* Admin Option */}
            <div 
              onClick={() => handleRoleSelect("admin")}
              className={`${cardBg} ${hoverClass} w-[calc(50%-0.5rem)] md:w-[calc(33.33%-1rem)] p-4 rounded-xl flex flex-col items-center justify-center gap-2 border-b-4 border-blue-600`}
            >
              <div className="bg-blue-100 p-2 rounded-full text-blue-600 text-xl md:text-2xl">
                <FaUserShield />
              </div>
              <h2 className={`${textColor} text-sm md:text-base font-bold text-center`}>Admin</h2>
              <p className="text-gray-500 text-center text-[10px] hidden md:block">Access dashboard & settings</p>
            </div>

            {/* Manager Option */}
            <div 
              onClick={() => handleRoleSelect("manager")}
              className={`${cardBg} ${hoverClass} w-[calc(50%-0.5rem)] md:w-[calc(33.33%-1rem)] p-4 rounded-xl flex flex-col items-center justify-center gap-2 border-b-4 border-purple-600`}
            >
              <div className="bg-purple-100 p-2 rounded-full text-purple-600 text-xl md:text-2xl">
                <FaUserShield />
              </div>
              <h2 className={`${textColor} text-sm md:text-base font-bold text-center`}>Manager</h2>
              <p className="text-gray-500 text-center text-[10px] hidden md:block">Access limited dashboard</p>
            </div>

            {/* Cashier Option */}
            <div 
              onClick={() => handleRoleSelect("cashier")}
              className={`${cardBg} ${hoverClass} w-[calc(50%-0.5rem)] md:w-[calc(33.33%-1rem)] p-4 rounded-xl flex flex-col items-center justify-center gap-2 border-b-4 border-yellow-600`}
            >
              <div className="bg-yellow-100 p-2 rounded-full text-yellow-600 text-xl md:text-2xl">
                <FaUserTie />
              </div>
              <h2 className={`${textColor} text-sm md:text-base font-bold text-center`}>Cashier</h2>
              <p className="text-gray-500 text-center text-[10px] hidden md:block">Manage payments & bills</p>
            </div>

            {/* Waiter Option */}
            <div 
              onClick={() => handleRoleSelect("waiter")}
              className={`${cardBg} ${hoverClass} w-[calc(50%-0.5rem)] md:w-[calc(33.33%-1rem)] p-4 rounded-xl flex flex-col items-center justify-center gap-2 border-b-4 border-green-600`}
            >
              <div className="bg-green-100 p-2 rounded-full text-green-600 text-xl md:text-2xl">
                <FaConciergeBell />
              </div>
              <h2 className={`${textColor} text-sm md:text-base font-bold text-center`}>Waiter</h2>
              <p className="text-gray-500 text-center text-[10px] hidden md:block">Take orders & serve</p>
            </div>

            {/* Kitchen Option */}
            <div 
              onClick={() => handleRoleSelect("kitchen")}
              className={`${cardBg} ${hoverClass} w-[calc(50%-0.5rem)] md:w-[calc(33.33%-1rem)] p-4 rounded-xl flex flex-col items-center justify-center gap-2 border-b-4 border-red-600`}
            >
              <div className="bg-red-100 p-2 rounded-full text-red-600 text-xl md:text-2xl">
                <FaUtensils />
              </div>
              <h2 className={`${textColor} text-sm md:text-base font-bold text-center`}>Kitchen</h2>
              <p className="text-gray-500 text-center text-[10px] hidden md:block">Manage food preparation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
