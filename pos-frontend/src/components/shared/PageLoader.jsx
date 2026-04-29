import React from "react";
import { useSelector } from "react-redux";

const PageLoader = () => {
  const theme = useSelector((state) => state.theme?.theme || "dark");
  const isDark = theme === "dark";

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDark ? "bg-[#1f1f1f]" : "bg-white"}`}>
      <div className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 ${isDark ? "border-white" : "border-blue-500"}`}></div>
    </div>
  );
};

export default PageLoader;