import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTables } from "../https";

const Tables = () => {
  const location = useLocation();
  const selectedHall = location.state?.hall;
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  const [status, setStatus] = useState("all");

  useEffect(() => {
    document.title = "POS | Tables";
  }, []);

  const { data: resData } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => await getTables(),
    placeholderData: keepPreviousData,
  });

  const tables = resData?.data.data || [];

  const filteredTables = tables.filter((t) => {
    // 1. Filter by Hall if selected
    const tableHall = t.hall || "Family Hall"; // Default to Family Hall if undefined
    if (selectedHall && tableHall !== selectedHall) return false;
    
    // 2. Filter by Status
    if (status === "booked") return t.status?.toLowerCase() === "booked";
    return true;
  });

  // Theme-aware classes
  const bgColor = isDark ? "bg-[#1f1f1f]" : "bg-white";
  const textColor = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  const inactiveText = isDark ? "text-[#ababab]" : "text-gray-500";
  const activeBg = isDark ? "bg-[#383838]" : "bg-gray-100";

  return (
    <section className={`${bgColor} min-h-screen flex flex-col pb-24 md:pb-36 lg:pb-20`}>
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-10 py-4 gap-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className={`${textColor} text-xl md:text-2xl font-bold tracking-wider`}>
            Tables {selectedHall && <span className="text-base md:text-lg font-normal opacity-80 hidden sm:inline">- {selectedHall}</span>}
          </h1>
        </div>

        <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
          <button
            onClick={() => setStatus("all")}
            className={`${inactiveText} text-sm md:text-lg flex-1 md:flex-none ${
              status === "all" && activeBg
            } rounded-lg px-3 md:px-5 py-2 font-semibold transition-colors`}
          >
            All
          </button>

          <button
            onClick={() => setStatus("booked")}
            className={`${inactiveText} text-sm md:text-lg flex-1 md:flex-none ${
              status === "booked" && activeBg
            } rounded-lg px-3 md:px-5 py-2 font-semibold transition-colors`}
          >
            Booked
          </button>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-10">
        <div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            xl:grid-cols-4 
            gap-4 md:gap-3
            justify-items-center
          "
        >
          {filteredTables.map((table) => (
            <div key={table._id} className="w-full max-w-[300px] md:scale-[0.92] md:transform md:origin-top">
<TableCard
  id={table._id}
  name={table.tableNo}
  hall={table.hall || "Family Hall"}
  status={table.status}
  initials={table.status === "Available" ? "" : table?.currentOrder?.customerDetails?.name}
  seats={table.seats}
/>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </section>
  );
};

export default Tables;
