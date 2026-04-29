import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query"
import { login } from "../../https/index"
import { enqueueSnackbar } from "notistack";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
 
const Login = ({ selectedRole }) => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const[formData, setFormData] = useState({
      email: "",
      password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
  
    const handleChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value});
    }

  
    const handleSubmit = (e) => {
      e.preventDefault();
      loginMutation.mutate(formData);
    }

    const loginMutation = useMutation({
      mutationFn: (reqData) => login(reqData),
      onSuccess: (res) => {
          const { data } = res;
          const { user, token } = data;
          
          // Role validation
          const userRole = user.role.toLowerCase();
          const selected = selectedRole ? selectedRole.toLowerCase() : "";
          
          // Allow "manager" selected role to match "sub admin" user role, and vice versa
          const isMatch = userRole === selected || 
                          (userRole === "sub admin" && selected === "manager") ||
                          (userRole === "manager" && selected === "sub admin");

          if (selectedRole && !isMatch) {
             enqueueSnackbar(`Access denied. You are not a ${selectedRole}.`, { variant: "error" });
             return;
          }

          if (token) {
            sessionStorage.setItem("token", token);
          }
          const { _id, name, email, phone, role } = user;
          dispatch(setUser({ _id, name, email, phone, role }));
          enqueueSnackbar("Login successful", { variant: "success" });
          
          // Redirect based on role
          if (role.toLowerCase() === "waiter") {
            navigate("/home", { replace: true }); 
          } else {
            navigate("/home", { replace: true });
          }
      },
      onError: (error) => {
        const { response } = error;
        enqueueSnackbar(response?.data?.message || "Login failed", { variant: "error" });
      }
    })

  // Theme-aware classes
  const labelColor = isDark ? "text-[#ababab]" : "text-gray-600";
  const inputBg = isDark ? "bg-[#1f1f1f]" : "bg-gray-100";
  const inputText = isDark ? "text-white" : "text-blue-900";
  const placeholderColor = isDark ? "placeholder-gray-500" : "placeholder-gray-400";

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className={`block ${labelColor} mb-2 mt-3 text-sm font-medium`}>
            Employee Email
          </label>
          <div className={`flex item-center rounded-lg p-5 px-4 ${inputBg}`}>
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
          <label className={`block ${labelColor} mb-2 mt-3 text-sm font-medium`}>
            Password
          </label>
          <div className={`flex items-center rounded-lg p-5 px-4 ${inputBg}`}>
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
              className="cursor-pointer ml-2 text-gray-500 password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg mt-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold"
        >
          Log in
        </button>
      </form>
    </div>
  );
};

export default Login;
