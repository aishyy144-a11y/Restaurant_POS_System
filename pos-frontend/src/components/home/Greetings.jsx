import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Greetings = () => {
  const userData = useSelector(state => state.user);
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  const textPrimary = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  const textSecondary = isDark ? "text-[#ababab]" : "text-gray-600";
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`;
  };

  const formatTime = (date) =>
    `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

  const getGreeting = () => {
    const hours = dateTime.getHours();
    if (hours >= 5 && hours < 12) return "Good Morning";
    if (hours >= 12 && hours < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-8 mt-4 md:mt-5 gap-4">
      <div>
        <h1 className={`${textPrimary} text-xl md:text-2xl font-semibold tracking-wide`}>
          {getGreeting()}, {userData.name || "TEST USER"}
        </h1>
        <p className={`${textSecondary} text-xs md:text-sm`}>
          Give your best services for customers 😀
        </p>
      </div>
      <div className="flex flex-col items-start md:items-end">
        <h1 className={`${textPrimary} text-2xl md:text-3xl font-bold tracking-wide w-auto md:w-[130px]`}>{formatTime(dateTime)}</h1>
        <p className={`${textSecondary} text-xs md:text-sm`}>{formatDate(dateTime)}</p>
      </div>
    </div>
  );
};

export default Greetings;
