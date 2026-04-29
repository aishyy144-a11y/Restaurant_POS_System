import React from 'react'
import { useSelector } from 'react-redux'

const MiniCard = ({title, icon, number, footerNum}) => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-[#1a1a1a]" : "bg-sky-100";
  const textColor = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  
  return (
    <div className={`${cardBg} py-5 px-5 rounded-lg w-[50%]`}>
        <div className='flex items-start justify-between'>
            <h1 className={`${textColor} text-lg font-semibold tracking-wide`}>{title}</h1>
            <button className={`${title === "Total Earnings" ? "bg-[#02ca3a]" : "bg-[#f6b100]"} p-3 rounded-lg text-[#f5f5f5] text-2xl`}>{icon}</button>
        </div>
        <div>
            <h1 className={`${textColor} text-4xl font-bold mt-5`}>{
              title === "Total Earnings" ? `PKR ${number}` : number}</h1>
            <h1 className={`${textColor} text-lg mt-2`}>
              <span className={Number(footerNum) >= 0 ? 'text-[#02ca3a]' : 'text-red-500'}>
                {Number(footerNum) > 0 ? "+" : ""}{footerNum}%
              </span> than yesterday
            </h1>
        </div>
    </div>
  )
}

export default MiniCard