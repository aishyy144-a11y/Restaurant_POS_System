import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import BottomNav from "../components/shared/BottomNav";
import OrderCard from "../components/orders/OrderCard";
import BackButton from "../components/shared/BackButton";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../https/index";
import { enqueueSnackbar } from "notistack"

const Orders = () => {
  const user = useSelector((state) => state.user);
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  const [status, setStatus] = useState("all");

    useEffect(() => {
      document.title = "POS | Orders"
    }, [])

  const { data: resData, isError } = useQuery({
    queryKey: ["orders", user?._id],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
    enabled: !!user?._id // Only fetch if user ID exists
  })

  if(isError) {
    enqueueSnackbar("Something went wrong!", {variant: "error"})
  }

  const orders = resData?.data?.data 
    ? [...resData.data.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  const filteredOrders =
    status === "all"
      ? orders
      : orders.filter((o) => {
          const s = o.orderStatus?.toLowerCase();
          if (status === "progress") return s === "in progress";
          if (status === "ready") return s === "ready";
          if (status === "served") return s === "served";
          if (status === "completed") return s === "completed";
          return true;
        });

  // Theme-aware classes
  const bgColor = isDark ? "bg-[#1f1f1f]" : "bg-white";
  const textColor = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  const inactiveText = isDark ? "text-[#ababab]" : "text-gray-500";
  const activeBg = isDark ? "bg-[#383838]" : "bg-gray-100";

  return (
    <section className={`${bgColor} min-h-screen flex flex-col pb-24 md:pb-20`}>
      <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-10 py-4 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <BackButton />
          <h1 className={`${textColor} text-xl md:text-2xl font-bold tracking-wider`}>
            Orders
          </h1>
        </div>
        <div className="flex items-center justify-start md:justify-around gap-2 md:gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <button onClick={() => setStatus("all")} className={`${inactiveText} text-sm md:text-lg ${status === "all" ? `${activeBg} font-bold` : 'font-semibold'} whitespace-nowrap rounded-lg px-3 md:px-5 py-1.5 md:py-2 transition-all`}>
            All
          </button>
          <button onClick={() => setStatus("progress")} className={`${inactiveText} text-sm md:text-lg ${status === "progress" ? `${activeBg} font-bold` : 'font-semibold'} whitespace-nowrap rounded-lg px-3 md:px-5 py-1.5 md:py-2 transition-all`}>
            In Progress
          </button>
          <button onClick={() => setStatus("ready")} className={`${inactiveText} text-sm md:text-lg ${status === "ready" ? `${activeBg} font-bold` : 'font-semibold'} whitespace-nowrap rounded-lg px-3 md:px-5 py-1.5 md:py-2 transition-all`}>
            Ready
          </button>
          <button onClick={() => setStatus("served")} className={`${inactiveText} text-sm md:text-lg ${status === "served" ? `${activeBg} font-bold` : 'font-semibold'} whitespace-nowrap rounded-lg px-3 md:px-5 py-1.5 md:py-2 transition-all`}>
            Served
          </button>
          <button onClick={() => setStatus("completed")} className={`${inactiveText} text-sm md:text-lg ${status === "completed" ? `${activeBg} font-bold` : 'font-semibold'} whitespace-nowrap rounded-lg px-3 md:px-5 py-1.5 md:py-2 transition-all`}>
            Completed
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))
          ) : (
            <p className="col-span-2 text-gray-500">No orders available</p>
          )}
        </div>
      </div>

      <BottomNav />
    </section>
  );
};

export default Orders;
