import React, { useState } from "react";
import { useSelector } from "react-redux";
import { register } from "../../https";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = ({setIsRegister, buttonText = "Sign up", onSuccess, successMessage}) => {
  const theme = useSelector((state) => state.theme.theme);
  const user = useSelector((state) => state.user); // Get current logged-in user
  const isDark = theme === "dark";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+92",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      // Allow only alphabets and spaces, max length 15
      if (/^[a-zA-Z\s]*$/.test(value) && value.length <= 15) {
        setFormData({ ...formData, [name]: value });
      }
    } else if (name === "phone") {
      // Ensure +92 prefix and max 10 digits after it
      if (value.startsWith("+92")) {
        const numberPart = value.slice(3);
        if (/^\d*$/.test(numberPart) && value.length <= 13) {
          setFormData({ ...formData, [name]: value });
        }
      } else if (value.length < 3) {
        // Prevent deleting +92
        setFormData({ ...formData, [name]: "+92" });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRoleSelection = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  const registerMutation = useMutation({
    mutationFn: (reqData) => register(reqData),
    onSuccess: (res) => {
      const { data } = res;
      enqueueSnackbar(successMessage || data.message, { variant: "success" });
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "",
      });
      
      setTimeout(() => {
        if(onSuccess) onSuccess();
        if(setIsRegister) setIsRegister(false);
      }, 1500);
    },
    onError: (error) => {
      const { response } = error;
      const message = response?.data?.message || "Registration failed";
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  // Theme-aware classes
  const labelColor = isDark ? "text-[#ababab]" : "text-gray-600";
  const inputBg = isDark ? "bg-[#1f1f1f]" : "bg-gray-100";
  const inputText = isDark ? "text-white" : "text-blue-900";
  const placeholderColor = isDark ? "placeholder-gray-500" : "placeholder-gray-400";
  const buttonBg = isDark ? "bg-[#1f1f1f]" : "bg-gray-100";
  const roleButtonText = isDark ? "text-[#ababab]" : "text-blue-900";
  const buttonActive = isDark ? "bg-indigo-700" : "bg-indigo-200";

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className={`block ${labelColor} mb-1 text-sm font-medium`}>
            Employee Name
          </label>
          <div className={`flex item-center rounded-lg p-3 px-4 ${inputBg}`}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter employee name"
              className={`bg-transparent flex-1 ${inputText} ${placeholderColor} focus:outline-none`}
              required
            />
          </div>
        </div>
        <div>
          <label className={`block ${labelColor} mb-1 mt-2 text-sm font-medium`}>
            Employee Email
          </label>
          <div className={`flex item-center rounded-lg p-3 px-4 ${inputBg}`}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter employee email"
              className={`bg-transparent flex-1 ${inputText} ${placeholderColor} focus:outline-none`}
              required
            />
          </div>
        </div>
        <div>
          <label className={`block ${labelColor} mb-1 mt-2 text-sm font-medium`}>
            Employee Phone
          </label>
          <div className={`flex item-center rounded-lg p-3 px-4 ${inputBg}`}>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter employee phone"
              className={`bg-transparent flex-1 ${inputText} ${placeholderColor} focus:outline-none`}
              required
            />
          </div>
        </div>
        <div>
          <label className={`block ${labelColor} mb-1 mt-2 text-sm font-medium`}>
            Password
          </label>
          <div className={`flex items-center rounded-lg p-3 px-4 ${inputBg}`}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className={`bg-transparent flex-1 ${inputText} ${placeholderColor} focus:outline-none`}
              required
            />
            <span
              className="cursor-pointer ml-2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </span>
          </div>
        </div>
        <div>
          <label className={`block ${labelColor} mb-1 mt-2 text-sm font-medium`}>
            Choose your role
          </label>

          <div className="flex item-center gap-3 mt-2">
            {["Manager", "Waiter", "Cashier", "Kitchen"]
              .filter(role => {
                // If current user is Manager (or Sub Admin), they cannot create another Manager
                const currentUserRole = user?.role?.toLowerCase();
                if ((currentUserRole === "sub admin" || currentUserRole === "manager") && role === "Manager") return false;
                return true;
              })
              .map((role) => {
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelection(role)}
                  className={`${buttonBg} px-3 py-2 w-full rounded-lg ${roleButtonText} ${
                    formData.role === role ? buttonActive : ""
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg mt-4 py-2 text-lg bg-yellow-400 text-gray-900 font-bold"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default Register;
