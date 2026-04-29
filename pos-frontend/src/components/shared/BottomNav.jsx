import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar, MdRestaurantMenu, MdKitchen } from "react-icons/md";
import { CiCircleMore } from "react-icons/ci";
import { BiSolidDish } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { setCustomer } from "../../redux/slices/customerSlice";
import { useSnackbar } from "notistack";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../https";
import { useEffect } from "react";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useSelector((state) => state.theme.theme);
  const user = useSelector((state) => state.user);
  const isDark = theme === "dark";
  const isCashier = user?.role?.toLowerCase() === "cashier";
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const isManager = user?.role?.toLowerCase() === "manager";
  const isWaiter = user?.role?.toLowerCase() === "waiter";
  const isKitchen = user?.role?.toLowerCase() === "kitchen";
  
  // Fetch orders for badge count
  const { data: resData } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    refetchInterval: 5000, // Sync every 5 seconds
    enabled: !!user.isAuth, // Only fetch if user is logged in
  });

  const orders = resData?.data?.data || [];
  const inKitchenOrders = orders.filter(
    (o) => o.orderStatus?.toLowerCase() === "in progress" || o.orderStatus?.toLowerCase() === "ready"
  );
  const kitchenOrdersCount = inKitchenOrders.length;

  // Notification logic moved to App.jsx for global persistence
  
  // Only show create order button to Waiter
  const showCreateOrder = isWaiter;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+92");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const increment = () => guestCount < 6 && setGuestCount((prev) => prev + 1);
  const decrement = () => guestCount > 1 && setGuestCount((prev) => prev - 1);

  const isActive = (path) => location.pathname === path;

  const handleNameChange = (e) => {
    const val = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(val) && val.length <= 15) {
      setName(val);
    }
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    if (val.startsWith("+92") && val.length <= 13 && /^\+92\d*$/.test(val)) {
      setPhone(val);
    }
  };

  const handleCreateOrder = () => {
    if (!name) {
      enqueueSnackbar("Please enter customer name", { variant: "error" });
      return;
    }
    if (phone.length !== 13) {
      enqueueSnackbar("Phone number must be exactly 10 digits after +92", { variant: "error" });
      return;
    }
    dispatch(setCustomer({ name, phone, guests: guestCount }));
    navigate("/hall-selection");
  };

  // Theme-aware classes
  const navBg = isDark ? "bg-[#262626]" : "bg-sky-100";
  const activeBg = isDark ? "bg-[#343434]" : "bg-white";
  const activeText = isDark ? "text-white" : "text-blue-900";
  const inactiveText = isDark ? "text-[#ababab]" : "text-gray-500";
  const inputBg = isDark ? "bg-[#1f1f1f]" : "bg-gray-100";
  const inputText = isDark ? "text-white" : "text-blue-900";
  const labelText = isDark ? "text-[#ababab]" : "text-gray-600";

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${navBg} px-6 py-2 h-auto min-h-[60px] flex justify-between items-center shadow-2xl z-[999]`}>

      {/* HOME */}
      <button
        onClick={() => navigate("/home")}
        className={`flex flex-col items-center justify-center text-xs font-semibold px-3 py-1 rounded-xl transition ${
          isActive("/home") ? `${activeText} ${activeBg}` : inactiveText
        }`}
      >
        <FaHome size={22} />
        Home
      </button>

      {/* ORDERS */}
      {!isKitchen && (
        <button
          onClick={() => navigate("/orders")}
          className={`flex flex-col items-center justify-center text-xs font-semibold px-3 py-1 rounded-xl transition ${
            isActive("/orders") ? `${activeText} ${activeBg}` : inactiveText
          }`}
        >
          <MdOutlineReorder size={22} />
          Orders
        </button>
      )}

      {/* KITCHEN */}
      {!isWaiter && !isCashier && (
        <button
          onClick={() => navigate("/kitchen")}
          className={`flex flex-col items-center justify-center text-xs font-semibold px-3 py-1 rounded-xl transition relative ${
            isActive("/kitchen") ? `${activeText} ${activeBg}` : inactiveText
          }`}
        >
          <div className="relative">
            <MdKitchen size={22} />
            {kitchenOrdersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {kitchenOrdersCount}
              </span>
            )}
          </div>
          Kitchen
        </button>
      )}

      {/* TABLES */}
      {!isKitchen && (
        <button
          onClick={() => navigate("/hall-selection")}
          className={`flex flex-col items-center justify-center text-xs font-semibold px-3 py-1 rounded-xl transition ${
            isActive("/tables") || isActive("/hall-selection") ? `${activeText} ${activeBg}` : inactiveText
          }`}
        >
          <MdTableBar size={24} />
          Tables
        </button>
      )}

      {/* MENU */}
      {!isKitchen && (
        <button
          onClick={() => navigate("/menu", { state: { hideCart: true } })}
          className={`flex flex-col items-center justify-center text-xs font-semibold px-3 py-1 rounded-xl transition ${
            isActive("/menu") ? `${activeText} ${activeBg}` : inactiveText
          }`}
        >
          <MdRestaurantMenu size={24} />
          Menu
        </button>
      )}

      {/* FLOATING CREATE ORDER BUTTON */}
      {showCreateOrder && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-7 group flex flex-col items-center">
          <button
            disabled={isActive("/tables") || isActive("/menu")}
            onClick={openModal}
            className={`rounded-full p-4 shadow-xl transition ${
              isActive("/tables") || isActive("/menu")
                ? "bg-[#5e4a0c] opacity-40 cursor-not-allowed"
                : "bg-[#F6B100] hover:bg-[#e0a000]"
            }`}
          >
            <BiSolidDish size={36} className="text-white" />
          </button>
          {/* Custom Tooltip */}
          <span className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
            New Order
          </span>
        </div>
      )}

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Order">
        
        {/* NAME */}
        <div>
          <label className={`block ${labelText} mb-2 text-sm font-medium`}>Customer Name</label>
          <div className={`flex items-center rounded-lg p-3 px-4 ${inputBg}`}>
            <input
              value={name}
              onChange={handleNameChange}
              type="text"
              placeholder="Enter customer name"
              className={`bg-transparent flex-1 ${inputText} focus:outline-none`}
            />
          </div>
        </div>

        {/* PHONE */}
        <div>
          <label className={`block ${labelText} mb-2 mt-3 text-sm font-medium`}>Customer Phone</label>
          <div className={`flex items-center rounded-lg p-3 px-4 ${inputBg}`}>
            <input
              value={phone}
              onChange={handlePhoneChange}
              type="text"
              placeholder="+923000000000"
              className={`bg-transparent flex-1 ${inputText} focus:outline-none`}
            />
          </div>
        </div>

        {/* GUESTS */}
        <div>
          <label className={`block mb-2 mt-3 text-sm font-medium ${labelText}`}>Guest Count</label>
          <div className={`flex items-center justify-between ${inputBg} px-4 py-3 rounded-lg`}>
            <button onClick={decrement} className="text-yellow-500 text-3xl">&minus;</button>
            <span className={inputText}>{guestCount} Person</span>
            <button onClick={increment} className="text-yellow-500 text-3xl">&#43;</button>
          </div>
        </div>

        {/* CREATE ORDER BUTTON */}
        <button
          onClick={handleCreateOrder}
          className="w-full bg-[#F6B100] text-white rounded-lg py-3 mt-8 hover:bg-yellow-600 transition"
        >
          Create Order
        </button>
      </Modal>
    </div>
  );
};

export default BottomNav;
