import React from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarName, getBgColor } from "../../utils";
import { useDispatch } from "react-redux";
import { updateTable } from "../../redux/slices/customerSlice";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import tableImg from "../../assets/images/table.jpg";

const TableCard = ({ 
  id, 
  name, 
  status, 
  initials, 
  seats, 
  hall,
  disableMenuClick = false   // NEW PROP
}) => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customer = useSelector((state) => state.customer);

  const handleClick = () => {
    // block when not coming from Create Order flow
    if (!customer?.customerName) {
      alert("Please create an order first!");
      navigate("/home");
      return;
    }
    if (disableMenuClick) return;
    if (status === "Booked") return;
    const table = { tableId: id, tableNo: name };
    dispatch(updateTable({ table }));
    navigate(`/menu`);
  };

  // Theme-aware classes
  const cardHover = isDark ? "hover:scale-105" : "hover:scale-105"; // Modified hover for image bg
  const textColor = isDark ? "text-[#f5f5f5]" : "text-blue-900"; // Keep text color logic, maybe adjust for image visibility?
  // For better visibility on image, we might want to force specific text colors or add a strong overlay.
  // Assuming the user wants the image to be visible, I'll add a semi-transparent overlay.
  
  const overlayBg = isDark ? "bg-black/70" : "bg-white/10"; 
  const textSecondary = isDark ? "text-[#ababab]" : "text-gray-900";
  const avatarBg = isDark ? "#1f1f1f" : (initials ? "#f6b100" : "#e0f2fe");

  return (
    <div
      onClick={handleClick}
      className={`
        w-full
        max-w-[300px]
        md:w-[300px] 
        ${cardHover} 
        transition-transform duration-300
        rounded-lg 
        cursor-pointer
        relative
        overflow-hidden
        bg-cover bg-center bg-no-repeat
        shadow-lg
        mx-auto
      `}
      style={{ backgroundImage: `url(${tableImg})` }}
    >
      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayBg} z-0`}></div>

      {/* Content */}
      <div className="relative z-10 p-4">
        {/* Top Row */}
        <div className="flex items-center justify-between px-1">
          <h1 className={`text-black bg-white px-2 py-1 rounded text-xl font-semibold inline-block`}>
            Table 
            <FaLongArrowAltRight className={`text-black ml-2 inline`} /> 
            {name}
          </h1>

          <p
            className={`
              px-2 py-1 rounded-lg
              ${
                status === "Booked"
                  ? isDark ? "text-green-600 bg-[#2e4a40]" : "text-yellow-600 bg-white"
                  : isDark ? "bg-[#664a04] text-white" : "text-yellow-600 bg-white"
              }
            `}
          >
            {status}
          </p>
        </div>

        {/* Avatar */}
        <div className="flex items-center justify-center mt-5 mb-8">
          <h1
            className={`${isDark ? "text-white" : "text-blue-900"} rounded-full p-5 text-xl shadow-md`}
            style={{
              backgroundColor: initials 
                ? (isDark ? getBgColor() : "#f6b100") 
                : avatarBg,
            }}
          >
            {getAvatarName(initials) || "NA"}
          </h1>
        </div>

        {/* Seats */}
        <p className={`${textSecondary} text-xs font-semibold`}>
          Seats: <span className={textColor}>{seats}</span>
        </p>
      </div>
    </div>
  );
};

export default TableCard;
