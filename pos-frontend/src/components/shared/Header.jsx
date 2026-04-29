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
    <header className={`w-full sticky top-0 z-50 flex justify-between items-center py-3 md:py-4 px-4 md:px-6 ${headerBg} shadow-md`}>
      
      {/* LOGO */}
      <div
        onClick={() => navigate("/home")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <img
          src={logoSrc}
          className={`h-7 w-7 md:h-9 md:w-9 object-contain ${isDark ? "" : "rounded"}`}
          alt="logo"
        />
        <h1 className={`text-lg md:text-xl ${isDark ? 'font-semibold' : 'font-bold'} ${textColor} tracking-wide hidden sm:block`}>
          Aishelicious
        </h1>
      </div>

      {/* USER SECTION */}
      <div className="flex items-center gap-2 md:gap-4">
        
        <button
          onClick={handleThemeToggle}
          className={`${buttonBg} rounded-full p-2 md:p-3 ${buttonHover} transition`}
          title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
          {isDark ? (
            <FaSun className={`${textColor} text-xl md:text-2xl`} />
          ) : (
            <FaMoon className={`${textColor} text-xl md:text-2xl`} />
          )}
        </button>

        {["admin", "sub admin", "cashier", "manager"].includes(userData.role?.toLowerCase().trim()) && (
            <button
              onClick={() => navigate("/dashboard")}
              className={`${buttonBg} rounded-full p-2 md:p-3 ${buttonHover} transition`}
              title="Dashboard"
            >
              <MdDashboard className={`${textColor} text-xl md:text-2xl`} />
            </button>
        )}

        <div className={`flex items-center gap-2 ${userBg} rounded-full px-2 md:px-4 py-1 md:py-2 shadow-sm`}>
          <FaUserCircle className={`${textColor} text-xl md:text-2xl`} />
          <div className="flex flex-col items-start leading-tight hidden xs:block">
            <h1 className={`text-xs md:text-sm ${textColor} font-semibold truncate max-w-[80px] md:max-w-none`}>
              {userData.name || "Guest"}
            </h1>
            <p className={`text-[10px] md:text-xs ${textSecondary} capitalize`}>
              {userData.role || "Role"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className={`${buttonBg} rounded-full p-2 md:p-3 ${buttonHover} transition text-red-500`}
          title="Logout"
        >
          <IoLogOut className="text-xl md:text-2xl" />
        </button>
      </div>
    </header>
  );
};

export default Header;
