import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaCheckDouble, FaLongArrowAltRight } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { formatDateAndTime, getAvatarName } from "../../utils/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus, updateTable } from "../../https/index";
import { enqueueSnackbar } from "notistack";
import Invoice from "../invoice/Invoice";

const OrderCard = ({ order, isKitchen = false }) => {
  const theme = useSelector((state) => state.theme.theme);
  const user = useSelector((state) => state.user);
  const userRole = user?.role?.toLowerCase();
  const isDark = theme === "dark";
  const [showInvoice, setShowInvoice] = useState(false);
  const queryClient = useQueryClient();
  
  // Theme-aware classes
  const cardBg = isKitchen 
    ? (isDark ? "bg-[#332a2a]" : "bg-orange-50") // Kitchen Theme (Warm)
    : (isDark ? "bg-[#262626]" : "bg-sky-100");  // Default Theme (Cool)

  const textColor = isKitchen
    ? (isDark ? "text-[#f5f5f5]" : "text-orange-900")
    : (isDark ? "text-[#f5f5f5]" : "text-blue-900");

  const textSecondary = isKitchen
    ? (isDark ? "text-[#d1d1d1]" : "text-orange-800")
    : (isDark ? "text-[#ababab]" : "text-gray-600");

  const borderColor = isKitchen
    ? (isDark ? "border-gray-600" : "border-orange-200")
    : (isDark ? "border-gray-500" : "border-gray-300");

  const hoverClass = showInvoice ? "" : "hover:scale-[1.01] transition-all duration-200 cursor-pointer hover:shadow-lg";

  const { mutate } = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      enqueueSnackbar("Order status updated!", { variant: "success" });
      queryClient.invalidateQueries(["orders"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to update status", { variant: "error" });
    }
  });

  const tableMutation = useMutation({
    mutationFn: updateTable,
    onSuccess: () => {
      queryClient.invalidateQueries(["tables"]);
    }
  });

  const handleMarkAsReady = (e) => {
    e.stopPropagation();
    mutate({ orderId: order._id, orderStatus: "Ready" });
  };

  const handleMarkAsServed = (e) => {
    e.stopPropagation();
    mutate({ orderId: order._id, orderStatus: "Served" });
  };

  const handleMarkAsCompleted = (e) => {
    e.stopPropagation();
    mutate({ orderId: order._id, orderStatus: "Completed" });
    // When order is completed, update table status to Available
    if (order.table && order.table._id) {
      tableMutation.mutate({ tableId: order.table._id, status: "Available" });
    }
    setShowInvoice(true);
  };
  
  console.log(order);
  return (
    <div 
      className={`w-full ${cardBg} p-3 md:p-4 rounded-lg mb-4 ${hoverClass} relative`}
    >
      
      <div className="flex items-center gap-3 md:gap-5">
        <button className="bg-[#f6b100] p-2 md:p-3 text-lg md:text-xl font-bold rounded-lg min-w-[48px] md:min-w-[56px]">
          {getAvatarName(order.customerDetails.name)}
        </button>
        <div className="flex items-start md:items-center justify-between w-[100%] gap-2">
          <div className="flex flex-col items-start gap-0.5 md:gap-1 min-w-0">
            <h1 className={`${textColor} text-base md:text-lg font-semibold tracking-wide truncate w-full`}>
              {order.customerDetails.name}
            </h1>
            <p className={`${textSecondary} text-[10px] md:text-sm truncate w-full`}>#{Math.floor(new Date(order.createdAt).getTime())} / Dine in</p>
            <p className={`${textSecondary} text-xs md:text-sm whitespace-nowrap`}>Table <FaLongArrowAltRight className={`${textSecondary} mx-1 md:ml-2 inline`} /> {order.table?.tableNo || "N/A"}</p>
          </div>
          <div className="flex flex-col items-end gap-1 md:gap-2 shrink-0">
            {order.orderStatus === "Ready" ? (
              <>
                <p className={`text-green-600 ${isDark ? "bg-[#2e4a40]" : "bg-white"} px-2 py-0.5 md:py-1 rounded-lg text-xs md:text-sm whitespace-nowrap flex items-center`}>
                  <FaCheckDouble className="mr-1 md:mr-2" /> {order.orderStatus}
                </p>
                <p className={`${textSecondary} text-[10px] md:text-sm text-right`}>
                  <FaCircle className="text-green-600 inline mr-1" /> Ready to serve
                </p>
              </>
            ) : order.orderStatus === "Completed" ? (
              <>
                <p className={`text-blue-600 ${isDark ? "bg-[#2e3b4a]" : "bg-white"} px-2 py-0.5 md:py-1 rounded-lg text-xs md:text-sm whitespace-nowrap flex items-center`}>
                  <FaCheckDouble className="mr-1 md:mr-2" /> {order.orderStatus}
                </p>
                <p className={`${textSecondary} text-[10px] md:text-sm text-right`}>
                  <FaCircle className="text-blue-600 inline mr-1" /> Order has been completed
                </p>
              </>
            ) : (
              <>
                <p className={`text-yellow-600 ${isDark ? "bg-[#4a452e]" : "bg-white"} px-2 py-0.5 md:py-1 rounded-lg text-xs md:text-sm whitespace-nowrap flex items-center`}>
                  <FaCircle className="mr-1 md:mr-2" /> {order.orderStatus}
                </p>
                <p className={`${textSecondary} text-[10px] md:text-sm text-right`}>
                  <FaCircle className="text-yellow-600 inline mr-1" /> Preparing your order
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={`flex justify-between items-start mt-4 ${textSecondary} gap-2`}>
        <p className="mt-1 text-[10px] md:text-sm">{formatDateAndTime(order.createdAt)}</p>
        <div className="flex flex-col items-end gap-1 min-w-0">
          {order.items?.map((item, idx) => (
            <p key={idx} className="text-[10px] md:text-sm text-right truncate w-full">
              {item.name} <span className="font-bold whitespace-nowrap">x{item.quantity}</span>
            </p>
          ))}
        </div>
      </div>
      <hr className={`w-full mt-4 border-t-1 ${borderColor}`} />
      <div className="flex items-center justify-between mt-4">
        <h1 className={`${textColor} text-base md:text-lg font-semibold`}>Total</h1>
        <p className={`${textColor} text-base md:text-lg font-semibold whitespace-nowrap`}>PKR {order.bills.totalWithTax.toFixed(2)}</p>
      </div>

      {isKitchen && order.orderStatus === "In Progress" && userRole !== 'admin' && userRole !== 'manager' && (
        <button 
          onClick={handleMarkAsReady}
          className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition-colors z-20 relative"
        >
          Mark as Ready
        </button>
      )}

      {isKitchen && order.orderStatus === "Ready" && userRole !== 'admin' && userRole !== 'manager' && (
        <button 
          onClick={handleMarkAsServed}
          className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium transition-colors z-20 relative"
        >
          Mark as Served
        </button>
      )}

      {order.orderStatus === "Served" && (user?.role?.toLowerCase() === "cashier" || user?.role?.toLowerCase() === "manager") && (
        <button 
          onClick={handleMarkAsCompleted}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors z-20 relative"
        >
          Mark as Completed & Print Receipt
        </button>
      )}

      {showInvoice && (
        <div onClick={(e) => e.stopPropagation()} className="relative z-50">
          <Invoice 
            orderInfo={order} 
            setShowInvoice={setShowInvoice} 
            autoPrint={false} 
            onClose={() => setShowInvoice(false)} 
          />
        </div>
      )}
    </div>
  );
};

export default OrderCard;
