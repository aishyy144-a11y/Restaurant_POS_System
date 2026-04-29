import React from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getDishStats } from "../../https/index";

const DishTable = () => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";

  const { data: resData, isLoading } = useQuery({
    queryKey: ["dishStats"],
    queryFn: getDishStats,
  });

  const dishes = resData?.data?.data || [];

  const containerBg = isDark ? "bg-[#262626]" : "bg-sky-100";
  const textColor = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  const theadBg = isDark ? "bg-[#333]" : "bg-sky-200";
  const theadText = isDark ? "text-[#ababab]" : "text-blue-800";
  const rowHover = isDark ? "hover:bg-[#333]" : "hover:bg-sky-200";
  const borderColor = isDark ? "border-gray-600" : "border-sky-300";

  return (
    <div className={`container mx-auto ${containerBg} p-4 rounded-lg mt-6`}>
      <h2 className={`${textColor} text-xl font-semibold mb-4`}>
        Dish Order Summary
      </h2>
      <div className="overflow-x-auto">
        <table className={`w-full text-left ${textColor}`}>
          <thead className={`${theadBg} ${theadText} sticky top-0`}>
            <tr>
              <th className="p-3">Category</th>
              <th className="p-3">Dish</th>
              <th className="p-3 text-right">Orders</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
               <tr><td colSpan="3" className="p-4 text-center">Loading...</td></tr>
            ) : dishes.length === 0 ? (
               <tr><td colSpan="3" className="p-4 text-center">No sales yet</td></tr>
            ) : (
                dishes.map((dish, index) => (
                <tr
                    key={index}
                    className={`border-b ${borderColor} ${rowHover}`}
                >
                    <td className="p-4 font-medium">{dish.category}</td>
                    <td className="p-4 flex items-center gap-3">
                        {dish.image && (
                            <div 
                                className="w-10 h-10 rounded-full bg-cover bg-center bg-gray-200"
                                style={{ backgroundImage: `url(${dish.image})` }}
                            ></div>
                        )}
                        <span>{dish.name}</span>
                    </td>
                    <td className="p-4 text-right font-bold">{dish.orderCount}</td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DishTable;
