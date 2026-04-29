import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/shared/BackButton";
import BottomNav from "../components/shared/BottomNav";
import { MdFamilyRestroom, MdPeople } from "react-icons/md";

const HallSelection = () => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "POS | Hall Selection";
  }, []);

  const handleSelect = (hall) => {
    navigate("/tables", { state: { hall } });
  };

  const bgColor = isDark ? "bg-[#1f1f1f]" : "bg-white";
  const textColor = isDark ? "text-white" : "text-gray-800";
  const cardBg = isDark ? "bg-[#262626]" : "bg-gray-100";
  const hoverClass = "hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg";

  return (
    <section className={`${bgColor} h-[calc(100vh-6rem)] overflow-hidden flex flex-col items-center pt-20 p-4 relative`}>
       <div className="absolute top-10 left-10">
          <BackButton />
       </div>
       <h1 className={`${textColor} text-3xl font-bold mb-12`}>Choose Hall</h1>
       <div className="flex flex-col md:flex-row gap-8">
          {/* Family Hall */}
          <div 
             onClick={() => handleSelect("Family Hall")}
             className={`${cardBg} ${hoverClass} p-10 rounded-2xl flex flex-col items-center justify-center gap-4 w-64 h-64 border-b-4 border-pink-500`}
          >
             <MdFamilyRestroom size={60} className="text-pink-500" />
             <h2 className={`${textColor} text-2xl font-bold`}>Family Hall</h2>
          </div>

          {/* Gents Hall */}
          <div 
             onClick={() => handleSelect("Gents Hall")}
             className={`${cardBg} ${hoverClass} p-10 rounded-2xl flex flex-col items-center justify-center gap-4 w-64 h-64 border-b-4 border-blue-500`}
          >
             <MdPeople size={60} className="text-blue-500" />
             <h2 className={`${textColor} text-2xl font-bold`}>Gents Hall</h2>
          </div>
       </div>
       <BottomNav />
    </section>
  );
};

export default HallSelection;
