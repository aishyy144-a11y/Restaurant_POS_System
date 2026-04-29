import React from "react";
import { useSelector } from "react-redux";
import { orders } from "../../constants";
import { GrUpdate } from "react-icons/gr";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders, updateOrderStatus } from "../../https/index";
import { formatDateAndTime } from "../../utils";

const RecentOrders = () => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  const queryClient = useQueryClient();
  const handleStatusChange = ({orderId, orderStatus}) => {
    console.log(orderId)
    orderStatusUpdateMutation.mutate({orderId, orderStatus});
  };

  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({orderId, orderStatus}) => updateOrderStatus({orderId, orderStatus}),
    onSuccess: (data) => {
      enqueueSnackbar("Order status updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["orders"]); // Refresh order list
    },
    onError: () => {
      enqueueSnackbar("Failed to update order status!", { variant: "error" });
    }
  })

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

  const orders = resData?.data?.data ? [...resData.data.data].sort((a, b) => {
    const dateA = new Date(a.orderDate);
    const dateB = new Date(b.orderDate);
    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;
    return dateB - dateA;
  }) : [];
  console.log(orders);

  const containerBg = isDark ? "bg-[#262626]" : "bg-sky-100";
  const textColor = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  const theadBg = isDark ? "bg-[#333]" : "bg-sky-200";
  const theadText = isDark ? "text-[#ababab]" : "text-blue-800";
  const rowHover = isDark ? "hover:bg-[#333]" : "hover:bg-sky-200";
  const borderColor = isDark ? "border-gray-600" : "border-sky-300";
  const selectBg = isDark ? "bg-[#1a1a1a]" : "bg-white";
  const selectBorder = isDark ? "border-gray-500" : "border-sky-300";
  
  return (
    <div className={`container mx-auto ${containerBg} p-2 md:p-4 rounded-lg`}>
      <h2 className={`${textColor} text-lg md:text-xl font-semibold mb-4`}>
        Recent Orders
      </h2>
      <div className="overflow-x-auto scrollbar-hide">
        <table className={`w-full text-left ${textColor} min-w-[900px]`}>
          <thead className={`${theadBg} ${theadText}`}>
            <tr>
              <th className="p-2 md:p-3 text-sm md:text-base">Order ID</th>
              <th className="p-2 md:p-3 text-sm md:text-base">Customer</th>
              <th className="p-2 md:p-3 text-sm md:text-base">Status</th>
              <th className="p-2 md:p-3 text-sm md:text-base">Date & Time</th>
              <th className="p-2 md:p-3 text-sm md:text-base">Items</th>
              <th className="p-2 md:p-3 text-sm md:text-base">Table No</th>
              <th className="p-2 md:p-3 text-sm md:text-base">Total</th>
              <th className="p-2 md:p-3 text-sm md:text-base text-center">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={index}
                className={`border-b ${borderColor} ${rowHover}`}
              >
                <td className="p-2 md:p-4 text-xs md:text-sm">#{Math.floor(new Date(order.orderDate).getTime())}</td>
                <td className="p-2 md:p-4 text-xs md:text-sm font-medium">{order.customerDetails.name}</td>
                <td className="p-2 md:p-4 text-xs md:text-sm">
                  <select
                    className={`${selectBg} ${textColor} border ${selectBorder} p-1 md:p-2 rounded-lg focus:outline-none text-[10px] md:text-xs ${
                      order.orderStatus === "Ready"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange({orderId: order._id, orderStatus: e.target.value})}
                  >
                    <option className="text-yellow-500" value="In Progress">
                      In Progress
                    </option>
                    <option className="text-green-500" value="Ready">
                      Ready
                    </option>
                    <option className="text-blue-500" value="Completed">
                      Completed
                    </option>
                  </select>
                </td>
                <td className="p-2 md:p-4 text-xs md:text-sm whitespace-nowrap">{formatDateAndTime(order.createdAt)}</td>
                <td className="p-2 md:p-4 text-xs md:text-sm">
                  {order.items.map((item, idx) => (
                    <span key={idx} className="block whitespace-nowrap">
                      {item.name} <span className="font-bold">x{item.quantity}</span>
                    </span>
                  ))}
                </td>
                <td className="p-2 md:p-4 text-xs md:text-sm text-center font-bold text-yellow-500">{order.table?.tableNo || "N/A"}</td>
                <td className="p-2 md:p-4 text-xs md:text-sm font-bold whitespace-nowrap">PKR {order.bills.totalWithTax}</td>
                <td className="p-2 md:p-4 text-xs md:text-sm text-center">
                  {order.paymentMethod}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
