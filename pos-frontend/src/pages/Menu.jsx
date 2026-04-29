import React, { useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import { MdRestaurantMenu } from "react-icons/md";
import MenuContainer from "../components/menu/MenuContainer";
import CustomerInfo from "../components/menu/CustomerInfo";
import CartInfo from "../components/menu/CartInfo";
import Bill from "../components/menu/Bill";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const Menu = () => {
  const theme = useSelector((state) => state.theme.theme);
  const location = useLocation();
  const hideCart = location.state?.hideCart;
  const isDark = theme === "dark";

  useEffect(() => {
    document.title = "POS | Menu";
  }, []);

  const customerData = useSelector((state) => state.customer);

  // Theme-aware classes
  const bgColor = isDark ? "bg-[#1f1f1f]" : "bg-white";
  const textColor = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  const textSecondary = isDark ? "text-[#ababab]" : "text-gray-600";
  const rightBg = isDark ? "bg-[#1a1a1a]" : "bg-white";
  const borderColor = isDark ? "border-[#2a2a2a]" : "border-gray-200";

  return (
    <section className={`${bgColor} min-h-screen flex gap-3`}>
      {/* Left Div */}
      <div className={`${hideCart ? "w-full" : "flex-[3]"} pb-24`}>
        <div className="flex items-center justify-between px-10 py-4">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className={`${textColor} text-2xl font-bold tracking-wider`}>
              Menu
            </h1>
          </div>
          {!hideCart && (
            <div className="flex items-center justify-around gap-4">
              <div className="flex items-center gap-3 cursor-pointer">
                <MdRestaurantMenu className={`${textColor} text-4xl`} />
                <div className="flex flex-col items-start">
                  <h1 className={`text-md ${textColor} font-semibold tracking-wide`}>
                    {customerData.customerName || "Customer Name"}
                  </h1>
                  <p className={`text-xs ${textSecondary} font-medium`}>
                    Table : {customerData.table?.tableNo || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <MenuContainer />
      </div>

      {/* Right Div */}
      {!hideCart && (
        <div className={`flex-[1] ${rightBg} mt-4 mr-3 rounded-lg pt-2 flex flex-col pb-24`}>
          <CustomerInfo />
          <hr className={`${borderColor} border-t-2`} />

          <CartInfo />
          <hr className={`${borderColor} border-t-2`} />

          <Bill />
        </div>
      )}

      <BottomNav />
    </section>
  );
};

export default Menu;
