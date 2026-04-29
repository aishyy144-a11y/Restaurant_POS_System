import React from "react";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import OrderList from "./OrderList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders } from "../../https/index";

const RecentOrders = () => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  const navigate = useNavigate();
  
  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  // Theme-aware classes
  const containerBg = isDark ? "bg-[#1a1a1a]" : "bg-sky-100";
  const textColor = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  const searchBg = isDark ? "bg-[#1f1f1f]" : "bg-sky-200";
  const searchIconColor = isDark ? "text-[#f5f5f5]" : "text-blue-900";

  return (
    <div className="px-8 mt-6">
      <div className={`${containerBg} w-full mx-auto rounded-lg`}>
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className={`${textColor} text-lg font-semibold tracking-wide`}>
            Recent Orders
          </h1>
          <p onClick={() => navigate("/orders")} className="text-[#025cca] text-sm font-semibold cursor-pointer">
            View all
          </p>
        </div>

        <div className={`flex items-center gap-4 ${searchBg} rounded-[15px] px-6 py-4 mx-6`}>
          <FaSearch className={searchIconColor} />
          <input
            type="text"
            placeholder="Search recent orders"
            className={`${searchBg} outline-none ${textColor}`}
          />
        </div>

        {/* Order list */}
        <div className="mt-4 px-6 pb-6">
          {resData?.data?.data?.length > 0 ? (
            [...resData.data.data]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5)
              .map((order) => {
                return <OrderList key={order._id} order={order} />;
              })
          ) : (
            <p className="col-span-3 text-gray-500">No orders available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
