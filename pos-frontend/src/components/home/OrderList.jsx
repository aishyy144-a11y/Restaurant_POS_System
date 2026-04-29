import React from "react";
import { useSelector } from "react-redux";
import { FaCheckDouble, FaLongArrowAltRight } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { getAvatarName } from "../../utils/index";

const OrderList = ({ order }) => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  
  const textColor = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  const textSecondary = isDark ? "text-[#ababab]" : "text-gray-600";

  return (
    <div className="flex items-center gap-3 md:gap-6 mb-3">
      <button className="bg-[#f6b100] p-3 md:p-4 text-lg md:text-xl font-bold rounded-lg min-w-[50px] md:min-w-[64px]">
        {getAvatarName(order.customerDetails.name)}
      </button>
      <div className="flex items-center w-[100%] gap-2 md:gap-4">
        <div className="flex-1 flex flex-col items-start gap-0 md:gap-1">
          <h1 className={`${textColor} text-base md:text-lg font-semibold tracking-wide truncate max-w-[80px] md:max-w-none`}>
            {order.customerDetails.name}
          </h1>
          <p className={`${textSecondary} text-xs md:text-sm whitespace-nowrap`}>{order.items.length} Items</p>
        </div>

        <div className="flex-1 text-center">
          <h1 className="inline-block text-[#f6b100] text-xs md:text-sm font-semibold border border-[#f6b100] rounded-lg px-2 md:px-3 py-1 md:py-1.5 whitespace-nowrap">
            Table <FaLongArrowAltRight className={`${textSecondary} ml-1 md:ml-2 inline`} /> {order.table?.tableNo || "N/A"}
          </h1>
        </div>

        <div className="flex-1 flex flex-col items-end gap-1 md:gap-2 text-right">
          {order.orderStatus === "Ready" ? (
            <p className={`text-green-600 ${isDark ? "bg-[#2e4a40]" : "bg-white"} px-2 py-1 rounded-lg text-xs md:text-sm flex items-center`}>
              <FaCheckDouble className="mr-1 md:mr-2" /> {order.orderStatus}
            </p>
          ) : (
            <p className={`text-yellow-600 ${isDark ? "bg-[#4a452e]" : "bg-white"} px-2 py-1 rounded-lg text-xs md:text-sm flex items-center`}>
              <FaCircle className="mr-1 md:mr-2" /> {order.orderStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
