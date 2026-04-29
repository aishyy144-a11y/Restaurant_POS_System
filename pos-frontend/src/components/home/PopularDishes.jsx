import React from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getDishStats } from "../../https";
import { getImageUrl } from "../../utils";

const PopularDishes = ({ isRestricted }) => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  
  // Theme-aware classes
  const cardBg = isDark ? "bg-[#1a1a1a]" : "bg-sky-100";
  const itemBg = isDark ? (isRestricted ? "bg-[#262626]" : "bg-[#1f1f1f]") : "bg-sky-200";
  const textColor = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  const textSecondary = isDark ? "text-[#ababab]" : "text-gray-600";

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["dishStats"],
    queryFn: getDishStats,
  });

  // Get top 8 dishes normally, or 9 for restricted view (Waiter/Kitchen)
  // Filter out Coke and Fizzup
  const filteredDishes = statsData?.data?.data?.filter(
    dish => !["coke", "fizzup"].includes(dish.name.toLowerCase())
  ) || [];

  const popularDishes = filteredDishes.slice(0, isRestricted ? 9 : 8);

  return (
    <div className={`${isRestricted ? 'mt-0' : 'mt-4 md:mt-6 pr-0 md:pr-6'}`}>
      <div className={`${cardBg} w-full rounded-lg ${isRestricted ? 'min-h-0 bg-transparent' : ''}`}>
        <div className={`flex justify-between items-center px-4 md:px-6 ${isRestricted ? 'py-2' : 'py-3 md:py-4'}`}>
          <h1 className={`${textColor} text-base md:text-lg font-semibold tracking-wide`}>
            Popular Dishes
          </h1>
        </div>

        <div className={`${isRestricted ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 p-2' : 'overflow-y-auto h-[400px] md:h-[600px] lg:h-[800px] scrollbar-hide'}`}>
          {isLoading ? (
             <p className={`text-center py-4 ${textSecondary} col-span-full text-sm`}>Loading...</p>
          ) : popularDishes.length === 0 ? (
             <p className={`text-center py-4 ${textSecondary} col-span-full text-sm`}>No sales yet.</p>
          ) : (
          popularDishes.map((dish, index) => {
            return (
              <div
                key={dish._id || index}
                className={`flex items-center gap-3 md:gap-4 ${itemBg} rounded-[15px] ${isRestricted ? 'px-4 md:px-6 py-4 md:py-6' : 'px-4 md:px-6 py-3 md:py-4'} ${isRestricted ? '' : 'mt-3 md:mt-4 mx-3 md:mx-6'}`}
              >
                <h1 className={`${textColor} font-bold text-lg md:text-xl mr-2 md:mr-4`}>{(index + 1) < 10 ? `0${index + 1}` : index + 1}</h1>
                <div 
                    className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-full bg-cover bg-center bg-gray-200 flex-shrink-0"
                    style={{ backgroundImage: dish.image ? `url(${getImageUrl(dish.image)})` : undefined }}
                ></div>
                <div>
                  <h1 className={`${textColor} text-sm md:text-base font-semibold tracking-wide truncate max-w-[120px] md:max-w-none`}>{dish.name}</h1>
                  <p className={`${textColor} text-xs md:text-sm font-semibold mt-0.5 md:mt-1`}>
                    <span className={textSecondary}>Orders: </span>
                    {dish.orderCount}
                  </p>
                </div>
              </div>
            );
          })
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularDishes;
