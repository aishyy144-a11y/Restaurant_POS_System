import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { MdTableBar, MdCategory, MdPersonAdd } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import Metrics from "../components/dashboard/Metrics";
import DishTable from "../components/dashboard/DishTable";
import RecentOrders from "../components/dashboard/RecentOrders";
import Users from "../components/dashboard/Users";
import Modal from "../components/dashboard/Modal";

const buttons = [
  { label: "Add Table", icon: <MdTableBar />, action: "table" },
  { label: "Delete Table", icon: <MdTableBar />, action: "deleteTable" },
  { label: "Add Category", icon: <MdCategory />, action: "category" },
  { label: "Delete Category", icon: <MdCategory />, action: "deleteCategory" },
  { label: "Add Dishes", icon: <BiSolidDish />, action: "dishes" },
  { label: "Update Dishes", icon: <BiSolidDish />, action: "updateDish" },
  { label: "Delete Dishes", icon: <BiSolidDish />, action: "deleteDish" },
  { label: "Create Account", icon: <MdPersonAdd />, action: "createAccount" },
];

const Dashboard = () => {
  const theme = useSelector((state) => state.theme.theme);
  const user = useSelector((state) => state.user);
  const isDark = theme === "dark";
  const navigate = useNavigate();
  
  // Filter buttons based on user role
  const getFilteredButtons = () => {
    const role = user?.role?.toLowerCase();
    
    if (role === "admin" || role === "sub admin") {
      return buttons;
    }
    
    if (role === "manager") {
      return buttons.filter(btn => btn.action !== "createAccount");
    }
    
    // Cashier, Waiter, Kitchen get no action buttons
    return [];
  };

  const filteredButtons = getFilteredButtons();

  // Define tabs based on user role
  const getTabs = () => {
    const baseTabs = ["Metrics", "Dish Performance", "Orders"];
    const role = user?.role?.toLowerCase();
    if (role === "admin" || role === "sub admin") {
      baseTabs.push("Users");
    }
    return baseTabs;
  };

  const tabs = getTabs();

  useEffect(() => {
    document.title = "POS | Admin Dashboard";
  }, []);

  // Redirect Waiter away from dashboard
  useEffect(() => {
    if (user?.role?.toLowerCase() === "waiter") {
      navigate("/");
    }
  }, [user, navigate]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [activeTab, setActiveTab] = useState("Metrics");

  const handleOpenModal = (action) => {
    if (action === "table") {
      setModalType("table");
      setIsModalOpen(true);
    }
    if (action === "deleteTable") {
      setModalType("deleteTable");
      setIsModalOpen(true);
    }
    if (action === "createAccount") navigate("/register");
    if (action === "category") {
      setModalType("category");
      setIsModalOpen(true);
    }
    if (action === "deleteCategory") {
      setModalType("deleteCategory");
      setIsModalOpen(true);
    }
    if (action === "dishes") {
      setModalType("dish");
      setIsModalOpen(true);
    }
    if (action === "updateDish") {
      setModalType("updateDish");
      setIsModalOpen(true);
    }
    if (action === "deleteDish") {
      setModalType("deleteDish");
      setIsModalOpen(true);
    }
  };

  // Theme-aware classes
  const bgColor = isDark ? "bg-[#1f1f1f]" : "bg-white";
  const buttonBg = isDark ? "bg-[#1a1a1a]" : "bg-sky-200";
  const buttonHover = isDark ? "hover:bg-[#262626]" : "hover:bg-sky-300";
  const activeBg = isDark ? "bg-[#262626]" : "bg-sky-400";
  const textColor = isDark ? "text-[#f5f5f5]" : "text-blue-900";

  return (
    <div className={`${bgColor} min-h-[calc(100vh-5rem)] pb-6`}>
      <div className="container mx-auto px-4 md:px-3 pt-10 mb-6 flex flex-wrap justify-between gap-y-4 items-center">
        <button
          onClick={() => navigate("/")}
          className="bg-[#025cca] p-2 text-xl font-bold rounded-full text-white hover:bg-[#024aa8] transition flex-shrink-0"
          title="Back to Home"
        >
          <IoArrowBackOutline />
        </button>

        {filteredButtons.map((btn, index) => (
          <button
            key={index}
            onClick={() => handleOpenModal(btn.action)}
            className={`${buttonBg} ${textColor} p-3 w-28 h-24 rounded-xl flex flex-col items-center justify-center gap-1 hover:scale-105 transition-transform duration-300 shadow-md`}
          >
            <div className="text-2xl text-blue-600">{btn.icon}</div>
            <span className="font-semibold text-xs text-center leading-tight">{btn.label}</span>
          </button>
        ))}
      </div>

      <div className="container mx-auto flex flex-nowrap items-center justify-center gap-2 pb-6 px-4 md:px-3">
        {tabs.map((tab) => {
          return (
            <button
              key={tab}
              className={`
              px-4 py-2 rounded-md ${textColor} font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab
                  ? activeBg
                  : `${buttonBg} ${buttonHover}`
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {activeTab === "Metrics" && <Metrics />}
      {activeTab === "Dish Performance" && <DishTable />}
      {activeTab === "Orders" && <RecentOrders />}
      {activeTab === "Users" && <Users />}

      {isModalOpen && <Modal setIsModalOpen={setIsModalOpen} modalType={modalType} />}
    </div>
  );
};

export default Dashboard;
