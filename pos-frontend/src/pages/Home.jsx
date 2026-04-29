import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/shared/BottomNav";
import Greetings from "../components/home/Greetings";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import { BiSolidDish } from "react-icons/bi";
import { MdOutlineReorder, MdTableBar, MdRestaurantMenu } from "react-icons/md";
import MiniCard from "../components/home/MiniCard";
import RecentOrders from "../components/home/RecentOrders";
import PopularDishes from "../components/home/PopularDishes";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../https";

const Home = () => {
  const theme = useSelector((state) => state.theme.theme);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-[#1f1f1f]" : "bg-white";

  useEffect(() => {
    document.title = "POS | Home";
  }, []);

  const { data: statsData } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const stats = statsData?.data?.data || {
    todayEarnings: 0,
    earningsPercentage: 0,
    inProgressCount: 0,
    inProgressPercentage: 0
  };

  const isRestricted = ["waiter", "kitchen"].includes(user?.role?.toLowerCase().trim());

  return (
    <section className={`${bgColor} ${isRestricted ? 'h-[calc(100vh-80px)] overflow-hidden' : 'min-h-screen overflow-y-auto'} flex flex-col ${isRestricted ? 'pb-0' : 'pb-36'}`}>
      {/* PAGE CONTENT WRAPPER */}
      <div className={`flex ${isRestricted ? 'flex-col' : 'flex-col lg:flex-row'} ${isRestricted ? 'gap-1' : 'gap-3'} flex-1 ${isRestricted ? 'overflow-hidden' : 'overflow-y-auto'}`}>

        {/* Left Side (or Top for Restricted) */}
        <div className={`${isRestricted ? 'w-full mb-0' : 'flex-[3]'} px-4`}>
          <Greetings />

          {!isRestricted && (
            <>
              <div className="flex flex-col sm:flex-row items-center w-full gap-3 mt-8">
                <MiniCard
                  title="Today Earnings"
                  icon={<BsCashCoin />}
                  number={Number(stats.todayEarnings).toFixed(2)}
                  footerNum={stats.earningsPercentage}
                />
                <MiniCard
                  title="In Progress"
                  icon={<GrInProgress />}
                  number={stats.inProgressCount}
                  footerNum={stats.inProgressPercentage}
                />
              </div>

              <RecentOrders />
            </>
          )}
        </div>

        {/* Right Side (or Bottom for Restricted) */}
        <div className={`${isRestricted ? 'w-full mt-0 flex-1 overflow-y-auto scrollbar-hide pb-16' : 'flex-[2]'} px-4`}>
          <PopularDishes isRestricted={isRestricted} />
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <BottomNav />
    </section>
  );
};

export default Home;
