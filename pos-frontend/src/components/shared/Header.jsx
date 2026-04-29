import React from "react";
import { FaSearch, FaUserCircle, FaBell, FaSun, FaMoon } from "react-icons/fa";
import logo from "../../assets/images/logo.png";
import lightLogo from "../../assets/images/Light-logo.png";
import { IoLogOut } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../https";
import { removeUser } from "../../redux/slices/userSlice";
import { toggleTheme } from "../../redux/slices/themeSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const userData = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      sessionStorage.removeItem("token");
      dispatch(removeUser());
      navigate("/", { replace: true });
    },
    onError: () => {
      sessionStorage.removeItem("token");
      dispatch(removeUser());
      navigate("/", { replace: true });
    },
  });

  const handleLogout = () => logoutMutation.mutate();
  const handleThemeToggle = () => dispatch(toggleTheme());

  // Theme-aware classes
  const isDark = theme === "dark";
  const logoSrc = isDark ? logo : lightLogo;
  const headerBg = isDark ? "bg-[#1a1a1a]" : "bg-sky-100";
  const buttonBg = isDark ? "bg-[#1f1f1f]" : "bg-white";
  const buttonHover = isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-sky-200";
  const textColor = isDark ? "text-white" : "text-blue-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
  const searchBg = isDark ? "bg-[#1f1f1f]" : "bg-white";
  const searchIcon = isDark ? "text-gray-300" : "text-gray-500";
  const searchInput = isDark ? "text-gray-200 placeholder-gray-500" : "text-blue-900 placeholder-gray-400";
  const userBg = isDark ? "bg-[#1f1f1f]" : "bg-white";

  return (
    <header className={`w-full sticky top-0 z-50 flex justify-between items-center py-4 px-6 ${headerBg} shadow-md`}>
      
      {/* LOGO */}
      <div
        onClick={() => navigate("/home")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <img
          src={logoSrc}
          className={`h-9 w-9 object-contain ${isDark ? "" : "rounded"}`}
          alt="logo"
        />
        <h1 className={`text-xl ${isDark ? 'font-semibold' : 'font-bold'} ${textColor} tracking-wide`}>
          Aishelicious
        </h1>
      </div>

      {/* SEARCH BAR (REMOVED) */}
      {/* 
      <div className={`hidden md:flex items-center gap-3 ${searchBg} rounded-full px-5 py-2 w-[350px] lg:w-[500px]`}>
        <FaSearch className={searchIcon} />
        <input
          type="text"
          placeholder="Search"
          className={`w-full bg-transparent outline-none ${searchInput}`}
        />
      </div> 
      */}

      {/* USER SECTION */}
      <div className="flex items-center gap-4">
        
        <button
          onClick={handleThemeToggle}
          className={`${buttonBg} rounded-full p-3 ${buttonHover} transition`}
          title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
          {isDark ? (
            <FaSun className={`${textColor} text-2xl`} />
          ) : (
            <FaMoon className={`${textColor} text-2xl`} />
          )}
        </button>

        {["admin", "sub admin", "cashier", "manager"].includes(userData.role?.toLowerCase().trim()) && (
            <button
              onClick={() => navigate("/dashboard")}
              className={`${buttonBg} rounded-full p-3 ${buttonHover} transition`}
            >
              <MdDashboard className={`${textColor} text-2xl`} />
            </button>
        )}

        {/* NOTIFICATION (REMOVED) */}
        {/* 
        <button className={`${buttonBg} rounded-full p-3 ${buttonHover} transition`}>
          <FaBell className={`${textColor} text-2xl`} />
        </button> 
        */}

        {/* USER ICON + INFO + LOGOUT */}
        <div className={`flex items-center gap-3 ${userBg} px-3 py-2 rounded-full`}>
          <FaUserCircle className={`${textColor} text-4xl`} />

          <div className="hidden sm:flex flex-col">
            <h1 className={`text-sm ${textColor} font-semibold`}>
              {userData.role === "admin" ? "Ayesha kareem" : userData.name || "TEST USER"}
            </h1>
            <p className={`text-xs ${textSecondary}`}>{userData.role || "Role"}</p>
          </div>

          <IoLogOut
            onClick={handleLogout}
            className={`${textColor} cursor-pointer hover:text-red-400 transition`}
            size={28}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
