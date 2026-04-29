import React, { useRef } from "react";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Invoice = ({ orderInfo, setShowInvoice, autoPrint = false, onClose }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isWaiter = user?.role?.toLowerCase() === "waiter";
  const invoiceRef = useRef(null);

  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const WinPrint = window.open("", "", "width=600,height=420");

    WinPrint.document.write(`
            <html>
              <head>
                <title>Order Receipt</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 8px; }
                  .receipt-container { width: 200px; border: 1px solid #ddd; padding: 6px; }
                  h2 { text-align: center; margin: 4px 0; font-size: 14px; }
                  p, li, strong { font-size: 11px; }
                </style>
              </head>
              <body>
                ${printContent}
              </body>
            </html>
          `);

    WinPrint.document.close();
    WinPrint.focus();
    setTimeout(() => {
      WinPrint.print();
      WinPrint.close();
    }, 1000);
  };

  const handleClose = () => {
    setShowInvoice(false);
    if (onClose) {
      onClose();
    } else {
      navigate("/home");
    }
  };

  React.useEffect(() => {
    if (autoPrint) {
      setTimeout(() => {
        handlePrint();
      }, 500); // Small delay to ensure render
    }
  }, [autoPrint]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-2 rounded-lg shadow-lg w-[260px]">
        {/* Receipt Content for Printing */}

        <div ref={invoiceRef} className="receipt-container p-2">
          {/* Receipt Header */}
          <div className="flex justify-center mb-2">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
              className="w-10 h-10 border-4 border-green-500 rounded-full flex items-center justify-center shadow-lg bg-green-500"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="text-xl"
              >
                <FaCheck className="text-white" />
              </motion.span>
            </motion.div>
          </div>

          <h2 className="text-lg font-bold text-center mb-1">Order Receipt</h2>
          <p className="text-gray-600 text-center text-xs">Thank you for your order!</p>

          {/* Order Details */}

          <div className="mt-2 border-t pt-2 text-xs text-gray-700">
            <p>
              <strong>Order ID:</strong>{" "}
              {Math.floor(new Date(orderInfo.orderDate).getTime())}
            </p>
            <p>
              <strong>Name:</strong> {orderInfo.customerDetails.name}
            </p>
            <p>
              <strong>Phone:</strong> {orderInfo.customerDetails.phone}
            </p>
            <p>
              <strong>Guests:</strong> {orderInfo.customerDetails.guests}
            </p>
          </div>

          {/* Items Summary */}

          <div className="mt-2 border-t pt-2">
            <h3 className="text-xs font-semibold">Items Ordered</h3>
            <ul className="text-xs text-gray-700">
              {orderInfo.items.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-[10px]"
                >
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>PKR {item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bills Summary */}

          <div className="mt-2 border-t pt-2 text-xs">
            <p>
              <strong>Subtotal:</strong> PKR {orderInfo.bills.total.toFixed(2)}
            </p>
            <p>
              <strong>Tax:</strong> PKR {orderInfo.bills.tax.toFixed(2)}
            </p>
            <p className="text-sm font-semibold">
              <strong>Grand Total:</strong> PKR {orderInfo.bills.totalWithTax.toFixed(2)}
            </p>
          </div>

          {/* Payment Details */}

          <div className="mb-2 mt-2 text-xs">
            <p>
              <strong>Payment Method:</strong>{" "}
              {orderInfo.paymentMethod === "Online" ? "Online Payment" : "Cash"}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          {!isWaiter && (
            <button
              onClick={handlePrint}
              className="text-blue-500 hover:underline text-xs px-4 py-2 rounded-lg"
            >
              Print Receipt
            </button>
          )}
          <button
            onClick={handleClose}
            className={`text-red-500 hover:underline text-xs px-4 py-2 rounded-lg ${isWaiter ? 'w-full text-center' : ''}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
