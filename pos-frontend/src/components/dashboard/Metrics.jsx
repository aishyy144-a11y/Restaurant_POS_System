import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getDashboardStats, getCategories, getDishes, getTables, getOrders } from "../../https";

const Metrics = () => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  
  const [viewMode, setViewMode] = useState("daily"); // daily, monthly, yearly
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const containerBg = isDark ? "bg-[#1f1f1f]" : "bg-white";
  const textColor = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  const subTextColor = isDark ? "text-[#ababab]" : "text-blue-900";
  const toggleBg = isDark ? "bg-[#2d2d2d]" : "bg-gray-200";
  const activeToggleBg = isDark ? "bg-[#025cca] text-white" : "bg-white text-blue-900 shadow-sm";
  const inactiveToggleText = isDark ? "text-gray-400" : "text-gray-600";

  const queryParams = useMemo(() => {
    const params = {};
    if (viewMode === 'daily') {
        params.filter = 'custom_date';
        params.date = selectedDate;
    } else if (viewMode === 'monthly') {
        params.filter = 'custom_month';
        params.month = selectedMonth;
        params.year = selectedYear;
    } else if (viewMode === 'yearly') {
        params.filter = 'custom_year';
        params.year = selectedYear;
    }
    return params;
  }, [viewMode, selectedDate, selectedMonth, selectedYear]);

  const { data: stats, isError, isLoading } = useQuery({
    queryKey: ["dashboardStats", queryParams],
    queryFn: () => getDashboardStats(queryParams),
    refetchInterval: 30000,
    placeholderData: keepPreviousData,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: dishes } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
  });

  const { data: tables } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
  });

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    refetchInterval: 30000,
  });

  const dashboardData = stats?.data?.data;
  
  // Fallback to frontend calculation if backend stats are missing (e.g. old backend version)
  const categoriesCount = dashboardData?.categoriesCount ?? categories?.data?.data?.categories?.length ?? 0;
  const dishesCount = dashboardData?.dishesCount ?? dishes?.data?.data?.dishes?.length ?? 0;
  const tablesCount = dashboardData?.tablesCount ?? tables?.data?.data?.length ?? 0;
  
  const activeOrdersCount = dashboardData?.activeOrdersCount ?? 
    orders?.data?.data?.filter(o => o.orderStatus === "In Progress").length ?? 0;

  const metrics = dashboardData?.metrics;
  
  // Use 0s as fallback instead of static data to avoid confusion
  const defaultMetrics = {
    revenue: { value: 0, percentage: "0%", isIncrease: true },
    itemsSold: { value: 0, percentage: "0%", isIncrease: true },
    totalCustomers: { value: 0, percentage: "0%", isIncrease: true }
  };

  const currentMetrics = metrics || defaultMetrics;

  const displayMetrics = [
    { 
      title: "Revenue", 
      value: `PKR ${Number(currentMetrics.revenue?.value || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 
      percentage: currentMetrics.revenue?.percentage, 
      color: "#025cca", 
      isIncrease: currentMetrics.revenue?.isIncrease 
    },
    { 
      title: "Items Sold", 
      value: Number(currentMetrics.itemsSold?.value || 0).toLocaleString(), 
      percentage: currentMetrics.itemsSold?.percentage, 
      color: "#02ca3a", 
      isIncrease: currentMetrics.itemsSold?.isIncrease 
    },
    { 
      title: "Total Customer", 
      value: Number(currentMetrics.totalCustomers?.value || 0).toLocaleString(), 
      percentage: currentMetrics.totalCustomers?.percentage, 
      color: "#f6b100", 
      isIncrease: currentMetrics.totalCustomers?.isIncrease 
    }
  ];

  const dynamicItemsData = [
    {
      title: "Total Categories",
      value: categoriesCount,
      percentage: "0%",
      color: "#5b45b0",
      isIncrease: false,
    },
    {
      title: "Total Dishes",
      value: dishesCount,
      percentage: "0%",
      color: "#285430",
      isIncrease: true,
    },
    {
      title: "Active Orders",
      value: activeOrdersCount,
      percentage: "0%",
      color: "#735f32",
      isIncrease: true,
    },
    {
      title: "Total Tables",
      value: tablesCount,
      color: "#7f167f",
    },
  ];
  
  return (
    <div className={`container mx-auto py-2 px-6 md:px-4 ${containerBg} min-h-full`}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className={`font-semibold ${textColor} text-xl`}>
            Overall Performance
          </h2>
          <p className={`text-sm ${subTextColor}`}>
            View details about your menu items and orders.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* View Mode Toggles */}
            <div className={`flex items-center p-1 rounded-lg ${toggleBg}`}>
                <button 
                    onClick={() => setViewMode('daily')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'daily' ? activeToggleBg : inactiveToggleText}`}
                >
                    Daily
                </button>
                <button 
                    onClick={() => setViewMode('monthly')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'monthly' ? activeToggleBg : inactiveToggleText}`}
                >
                    Monthly
                </button>
                <button 
                    onClick={() => setViewMode('yearly')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'yearly' ? activeToggleBg : inactiveToggleText}`}
                >
                    Yearly
                </button>
            </div>

            {/* Dynamic Inputs based on View Mode */}
            <div className="flex items-center gap-2">
                {viewMode === 'daily' && (
                    <input 
                      type="date" 
                      value={selectedDate} 
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-3 py-1.5 rounded-md bg-[#1a1a1a] text-white border border-gray-600 outline-none text-sm calendar-white"
                    />
                )}

                {viewMode === 'monthly' && (
                    <div className="flex gap-2">
                      <select 
                        value={selectedMonth} 
                        onChange={e => setSelectedMonth(e.target.value)} 
                        className="px-3 py-1.5 rounded-md bg-[#1a1a1a] text-white outline-none cursor-pointer text-sm border border-gray-600"
                      >
                          {Array.from({length: 12}, (_, i) => (
                              <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'short' })}</option>
                          ))}
                      </select>
                      <select 
                        value={selectedYear} 
                        onChange={e => setSelectedYear(e.target.value)} 
                        className="px-3 py-1.5 rounded-md bg-[#1a1a1a] text-white outline-none cursor-pointer text-sm border border-gray-600"
                      >
                          {Array.from({length: 5}, (_, i) => (
                              <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
                          ))}
                      </select>
                    </div>
                )}

                {viewMode === 'yearly' && (
                    <select 
                        value={selectedYear} 
                        onChange={e => setSelectedYear(e.target.value)} 
                        className="px-3 py-1.5 rounded-md bg-[#1a1a1a] text-white outline-none cursor-pointer text-sm border border-gray-600"
                    >
                          {Array.from({length: 5}, (_, i) => (
                              <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
                          ))}
                    </select>
                )}
            </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">

        {displayMetrics.map((metric, index) => {
          return (
            <div
              key={index}
              className="shadow-sm rounded-lg p-4"
              style={{ backgroundColor: metric.color }}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-xs text-[#f5f5f5]">
                  {metric.title}
                </p>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                  >
                    <path
                      d={metric.isIncrease ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                    />
                  </svg>
                  <p
                    className="font-medium text-xs"
                    style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                  >
                    {metric.percentage}
                  </p>
                </div>
              </div>
              <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col justify-between mt-12">
        <div>
          <h2 className={`font-semibold ${textColor} text-xl`}>
            Item Details
          </h2>
          <p className={`text-sm ${subTextColor}`}>
            Overview of your menu items and their performance.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">

            {
                dynamicItemsData.map((item, index) => {
                    return (
                        <div key={index} className="shadow-sm rounded-lg p-4" style={{ backgroundColor: item.color }}>
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-xs text-[#f5f5f5]">{item.title}</p>
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4" fill="none">
                              <path d="M5 15l7-7 7 7" />
                            </svg>
                            <p className="font-medium text-xs text-[#f5f5f5]">{item.percentage}</p>
                          </div>
                        </div>
                        <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">{item.value}</p>
                      </div>
                    )
                })
            }

        </div>
      </div>
    </div>
  );
};

export default Metrics;
