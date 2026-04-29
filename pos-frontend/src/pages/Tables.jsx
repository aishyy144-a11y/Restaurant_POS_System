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
    <section className={`${bgColor} min-h-screen flex flex-col pb-20`}>
      
      {/* Top Header */}
      <div className="flex items-center justify-between px-10 py-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className={`${textColor} text-2xl font-bold tracking-wider`}>
            Tables {selectedHall && <span className="text-lg font-normal opacity-80">- {selectedHall}</span>}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setStatus("all")}
            className={`${inactiveText} text-lg ${
              status === "all" && activeBg
            } rounded-lg px-5 py-2 font-semibold`}
          >
            All
          </button>

          <button
            onClick={() => setStatus("booked")}
            className={`${inactiveText} text-lg ${
              status === "booked" && activeBg
            } rounded-lg px-5 py-2 font-semibold`}
          >
            Booked
          </button>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="flex-1 overflow-y-auto px-10 pb-10">
        <div
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            gap-3
          "
        >
          {filteredTables.map((table) => (
            <div key={table._id} className="scale-[0.92] transform origin-top">
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
