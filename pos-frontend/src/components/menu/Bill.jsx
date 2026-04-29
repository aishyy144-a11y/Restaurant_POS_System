import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice } from "../../redux/slices/cartSlice";
import { addOrder, updateTable } from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeAllItems } from "../../redux/slices/cartSlice";
import { removeCustomer } from "../../redux/slices/customerSlice";
import Invoice from "../invoice/Invoice";

 

const Bill = () => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.user);
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const customerData = useSelector((state) => state.customer);
  const cartData = useSelector((state) => state.cart);
  const total = useSelector(getTotalPrice);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const taxRate = paymentMethod === "Online" ? 5.5 : 3.4;
  const tax = (total * taxRate) / 100;
  const totalPriceWithTax = total + tax;

  const [showInvoice, setShowInvoice] = useState(false);
  const [orderInfo, setOrderInfo] = useState();

 

  const handlePlaceOrder = async () => {
    if (!cartData || cartData.length === 0) {
      enqueueSnackbar("Cart is empty! Please add items to place an order.", {
        variant: "warning",
      });
      return;
    }

    if (total <= 0) {
      enqueueSnackbar("Total amount cannot be zero!", {
        variant: "warning",
      });
      return;
    }

    if (!paymentMethod) {
      enqueueSnackbar("Please select a payment method!", {
        variant: "warning",
      });

      return;
    }
    const orderData = {
      customerDetails: {
        name: customerData.customerName,
        phone: customerData.customerPhone,
        guests: customerData.guests,
      },
      orderStatus: "In Progress",
      bills: {
        total: total,
        tax: tax,
        totalWithTax: totalPriceWithTax,
      },
      items: cartData,
      table: customerData.table.tableId,
      paymentMethod: paymentMethod,
    };
    orderMutation.mutate(orderData);
  };

  const orderMutation = useMutation({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: (resData) => {
      const { data } = resData.data;
      console.log(data);

      setOrderInfo(data);

      // Update Table
      const tableData = {
        status: "Booked",
        orderId: data._id,
        tableId: data.table,
      };

      setTimeout(() => {
        tableUpdateMutation.mutate(tableData);
      }, 1500);

      enqueueSnackbar("Order Placed!", {
        variant: "success",
      });
      setShowInvoice(true);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const tableUpdateMutation = useMutation({
    mutationFn: (reqData) => updateTable(reqData),
    onSuccess: (resData) => {
      console.log(resData);
      dispatch(removeCustomer());
      dispatch(removeAllItems());
      // Invalidate tables query to refresh table data
      queryClient.invalidateQueries(["tables"]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Theme-aware classes
  const labelColor = isDark ? "text-[#ababab]" : "text-blue-900";
  const valueColor = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  const buttonBg = isDark ? "bg-[#1f1f1f]" : "bg-blue-900";
  const buttonText = isDark ? "text-[#ababab]" : "text-white";
  const buttonActive = isDark
    ? "bg-[#383737] border border-gray-500"
    : "bg-blue-700 ring-2 ring-blue-400 shadow-md";
  const buttonHover = isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-blue-800";

  return (
    <>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className={`text-xs ${labelColor} font-medium mt-2`}>
          Items({cartData.length})
        </p>
        <h1 className={`${valueColor} text-md font-bold`}>
          PKR {total.toFixed(2)}
        </h1>
      </div>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className={`text-xs ${labelColor} font-medium mt-2`}>Tax({taxRate}%)</p>
        <h1 className={`${valueColor} text-md font-bold`}>PKR {tax.toFixed(2)}</h1>
      </div>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className={`text-xs ${labelColor} font-medium mt-2`}>
          Total With Tax
        </p>
        <h1 className={`${valueColor} text-md font-bold`}>
          PKR {totalPriceWithTax.toFixed(2)}
        </h1>
      </div>
      <div className="flex items-center gap-3 px-5 mt-4">
        <button
          onClick={() => setPaymentMethod("Cash")}
          className={`${buttonBg} ${buttonHover} px-4 py-3 w-full rounded-lg ${buttonText} font-semibold ${
            paymentMethod === "Cash" ? buttonActive : ""
          }`}
        >
          Cash
        </button>
        <button
          onClick={() => setPaymentMethod("Online")}
          className={`${buttonBg} ${buttonHover} px-4 py-3 w-full rounded-lg ${buttonText} font-semibold ${
            paymentMethod === "Online" ? buttonActive : ""
          }`}
        >
          Online
        </button>
      </div>

      <div className="flex items-center gap-3 px-5 mt-4">
        <button
          onClick={handlePlaceOrder}
          disabled={isAdmin}
          className={`${isAdmin ? "bg-gray-400 cursor-not-allowed text-gray-700" : "bg-[#f6b100] text-[#1f1f1f]"} px-4 py-3 w-full rounded-lg font-semibold text-lg`}
        >
          Place & Send to Kitchen
        </button>
      </div>

      {showInvoice && (
        <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
      )}
    </>
  );
};

export default Bill;
