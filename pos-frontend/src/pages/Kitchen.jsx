import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import BottomNav from "../components/shared/BottomNav";
import OrderCard from "../components/orders/OrderCard";
import BackButton from "../components/shared/BackButton";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../https/index";
import { useSnackbar } from "notistack";

const Kitchen = () => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  const { enqueueSnackbar } = useSnackbar();
  const prevOrderCountRef = useRef(0);

  useEffect(() => {
    document.title = "POS | Kitchen";
  }, []);

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    refetchInterval: 5000, // Auto refresh for kitchen
    placeholderData: keepPreviousData,
  });

  const orders = resData?.data?.data
    ? [...resData.data.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    : [];

  // Filter for orders that are "In Progress"
  const inProgressOrders = orders.filter(
    (o) => o.orderStatus?.toLowerCase() === "in progress"
  );

  // Monitor for new orders to show notification (Removed: Logic moved to BottomNav for global support)
  useEffect(() => {
    prevOrderCountRef.current = inProgressOrders.length;
  }, [inProgressOrders.length]);

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  // Kitchen view shows "In Progress" and "Ready"
  const kitchenOrders = orders.filter(
    (o) => o.orderStatus?.toLowerCase() === "in progress" || o.orderStatus?.toLowerCase() === "ready"
  );

  // Theme-aware classes
  const bgColor = isDark ? "bg-[#1f1f1f]" : "bg-white";
  const textColor = isDark ? "text-[#f5f5f5]" : "text-blue-900";

  return (
    <section className={`${bgColor} min-h-screen flex flex-col pb-24 md:pb-20`}>
      <div className="flex items-center justify-between px-4 md:px-10 py-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className={`${textColor} text-xl md:text-2xl font-bold tracking-wider`}>
            Kitchen Display
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {kitchenOrders.length > 0 ? (
            kitchenOrders.map((order) => (
              <OrderCard key={order._id} order={order} isKitchen={true} />
            ))
          ) : (
            <p className={`${textColor} col-span-2 text-center mt-10`}>
              No pending orders
            </p>
          )}
        </div>
      </div>

      <BottomNav />
    </section>
  );
};

export default Kitchen;
