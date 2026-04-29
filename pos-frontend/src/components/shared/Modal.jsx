import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';


const Modal = ({ isOpen, onClose, title, children }) => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  
  if (!isOpen) return null;

  // Theme-aware classes
  const modalBg = isDark ? "bg-[#1a1a1a]" : "bg-white";
  const textColor = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  const borderColor = isDark ? "border-b-[#333]" : "border-b-gray-200";
  const closeBtnColor = isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-500 hover:text-gray-700";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`${modalBg} rounded-lg shadow-lg w-full max-w-lg mx-4`}>
        <div className={`flex justify-between items-center px-6 py-4 border-b ${borderColor}`}>
          <h2 className={`text-xl ${textColor} font-semibold`}>{title}</h2>
          <button
            className={`${closeBtnColor} text-2xl`}
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
