import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import restaurant from "../assets/images/restaurant-img.jpg";
import logo from "../assets/images/logo.png";
import lightLogo from "../assets/images/Light-logo.png";
import { login } from "../https";
import { setUser } from "../redux/slices/userSlice";

const KitchenLogin = () => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";
  const logoSrc = isDark ? logo : lightLogo;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "POS | Kitchen Login";
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginMutation = useMutation({
    mutationFn: (reqData) => login(reqData),
    onSuccess: (res) => {
      const { data } = res;
      const { user, token } = data;

      const userRole = user.role.toLowerCase();
      if (userRole !== "kitchen") {
        enqueueSnackbar("Access denied. Only Kitchen Staff can log in here.", { variant: "error" });
        return;
      }

      if (token) {
        localStorage.setItem("token", token);
      }
      const { _id, name, email, phone, role } = user;
      dispatch(setUser({ _id, name, email, phone, role }));
      enqueueSnackbar("Login successful", { variant: "success" });
      navigate("/home", { replace: true });
    },
    onError: (error) => {
      enqueueSnackbar("Access denied, email or password is wrong", { variant: "error" });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  // Theme-aware classes
  const rightBg = isDark ? "bg-[#1a1a1a]" : "bg-white";
  const textColor = isDark ? "text-[#f5f5f5]" : "text-blue-900";
  const labelColor = isDark ? "text-[#ababab]" : "text-gray-600";
  const inputBg = isDark ? "bg-[#1f1f1f]" : "bg-gray-100";
  const inputText = isDark ? "text-white" : "text-blue-900";
  const placeholderColor = isDark ? "placeholder-gray-500" : "placeholder-gray-400";
  const headingColor = isDark ? "text-yellow-400" : "text-yellow-500";

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Section */}
      <div className="w-1/2 relative flex items-center justify-center bg-cover">
        {/* BG Image */}
        <img className="w-full h-full object-cover" src={restaurant} alt="Restaurant Image" />

        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-80"></div>

        {/* Quote at bottom */}
        <blockquote className="absolute bottom-10 px-8 mb-10 text-2xl italic text-white">
          "Serve customers the best food with prompt and friendly service in a
          welcoming atmosphere, and they'll keep coming back."
          <br />
          <span className="block mt-4 text-yellow-400">- Founder of Aishelicious</span>
        </blockquote>
      </div>

      {/* Right Section */}
      <div className={`w-1/2 h-full ${rightBg} p-10 flex flex-col justify-center`}>
        <div className="flex flex-col items-center gap-2">
          <img
            src={logoSrc}
            alt="Aishelicious Logo"
            className={`h-14 w-14 border-2 rounded-full p-1 ${isDark ? "border-gray-600" : "border-gray-300 bg-white"}`}
          />
          <h1 className={`text-lg ${isDark ? "font-semibold" : "font-bold"} ${textColor} tracking-wide`}>
            Aishelicious
          </h1>
        </div>

        <div className="mt-10 mb-10 text-center">
          <h2 className={`text-4xl font-semibold ${headingColor} mb-2`}>
            Hello Kitchen Staff
          </h2>
          <p className={`${labelColor}`}>Please enter your credentials</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label className={`block ${labelColor} mb-2 mt-3 text-sm font-medium`}>
              Email
            </label>
            <div className={`flex item-center rounded-lg p-5 px-4 ${inputBg}`}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
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
            className="w-full rounded-lg mt-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-500 transition-colors"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="mt-6">
          <button 
            onClick={() => navigate(-1)} 
            className={`${isDark ? "bg-[#1f1f1f] text-white hover:bg-[#333]" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} px-4 py-2 rounded-lg transition-colors font-medium`}
          >
            Back to Role Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default KitchenLogin;
