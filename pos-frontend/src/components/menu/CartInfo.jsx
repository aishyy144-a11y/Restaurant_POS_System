import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaNotesMedical } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { removeItem } from "../../redux/slices/cartSlice";

const CartInfo = () => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  const cartData = useSelector((state) => state.cart);
  const scrolLRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if(scrolLRef.current){
      scrolLRef.current.scrollTo({
        top: scrolLRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  },[cartData]);

  const handleRemove = (itemId) => {
    dispatch(removeItem(itemId));
  }

  // Theme-aware classes
  const headingColor = isDark ? "text-[#e4e4e4]" : "text-blue-900";
  const emptyTextColor = isDark ? "text-[#ababab]" : "text-gray-600";
  const itemBg = isDark ? "bg-[#1f1f1f]" : "bg-gray-100";
  const itemText = isDark ? "text-[#ababab]" : "text-gray-600";
  const priceText = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  const iconColor = isDark ? "text-[#ababab]" : "text-gray-600";

  return (
    <div className="px-4 py-2 flex-1 flex flex-col min-h-0">
      <h1 className={`text-lg ${headingColor} font-semibold tracking-wide`}>
        Order Details
      </h1>
      <div className="mt-4 overflow-y-auto scrollbar-hide flex-1" ref={scrolLRef} >
        {cartData.length === 0 ? (
          <p className={`${emptyTextColor} text-sm flex justify-center items-center h-full`}>Your cart is empty. Start adding items!</p>
        ) : cartData.map((item) => {
          return (
            <div key={item.id} className={`${itemBg} rounded-lg px-4 py-4 mb-2`}>
              <div className="flex items-center justify-between">
                <h1 className={`${itemText} font-semibold tracling-wide text-md`}>
                  {item.name}
                </h1>
                <p className={`${itemText} font-semibold`}>x{item.quantity}</p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <RiDeleteBin2Fill
                    onClick={() => handleRemove(item.id)}
                    className={`${iconColor} cursor-pointer`}
                    size={20}
                  />
                  <FaNotesMedical
                    className={`${iconColor} cursor-pointer`}
                    size={20}
                  />
                </div>
                <p className={`${priceText} text-md font-bold`}>PKR {item.price}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CartInfo;
