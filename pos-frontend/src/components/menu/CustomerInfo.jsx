import React, { useState } from "react";
import { useSelector } from "react-redux";
import { formatDate, getAvatarName } from "../../utils";

const CustomerInfo = () => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  const [dateTime, setDateTime] = useState(new Date());
  const customerData = useSelector((state) => state.customer);

  // Theme-aware classes
  const textColor = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  const textSecondary = isDark ? "text-[#ababab]" : "text-gray-600";

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex flex-col items-start">
        <h1 className={`text-md ${textColor} font-semibold tracking-wide`}>
          {customerData.customerName || "Customer Name"}
        </h1>
        <p className={`text-xs ${textSecondary} font-medium mt-1`}>
          #{customerData.orderId || "N/A"} / Dine in
        </p>
        <p className={`text-xs ${textSecondary} font-medium mt-2`}>
          {formatDate(dateTime)}
        </p>
      </div>
      <button className="bg-[#f6b100] p-3 text-xl font-bold rounded-lg">
        {getAvatarName(customerData.customerName) || "CN"}
      </button>
    </div>
  );
};

export default CustomerInfo;
