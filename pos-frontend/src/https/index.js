import { axiosWrapper } from "./axiosWrapper";

// -------------------- Auth Endpoints --------------------
export const ping = () => axiosWrapper.get("/ping"); // For warming up backend cold start
export const login = (data) => axiosWrapper.post("/user/login", data);
export const register = (data) => axiosWrapper.post("/user/register", data);
export const getUserData = () => axiosWrapper.get("/user");
export const getAllUsers = () => axiosWrapper.get("/user/all");
export const logout = () => axiosWrapper.post("/user/logout");
export const deleteUser = (id) => axiosWrapper.delete(`/user/${id}`);

// -------------------- Table Endpoints --------------------
export const addTable = (data) => axiosWrapper.post("/table", data);
export const getTables = () => axiosWrapper.get("/table");
export const deleteTable = (id) => axiosWrapper.delete(`/table/${id}`);
export const updateTable = ({ tableId, ...tableData }) =>
  axiosWrapper.put(`/table/${tableId}`, tableData);

// -------------------- Payment Endpoints --------------------
export const createOrderRazorpay = (data) =>
  axiosWrapper.post("/payment/create-order", data);
export const verifyPaymentRazorpay = (data) =>
  axiosWrapper.post("/payment/verify-payment", data);

// -------------------- Order Endpoints --------------------
export const addOrder = (data) => axiosWrapper.post("/order", data);
export const getOrders = () => axiosWrapper.get("/order");
export const updateOrderStatus = ({ orderId, orderStatus }) =>
  axiosWrapper.put(`/order/${orderId}`, { orderStatus });
export const getDashboardStats = (params) => axiosWrapper.get("/stats", { params });
export const getDishStats = () => axiosWrapper.get("/stats/dishes");



// -------------------- Category Endpoints --------------------
export const addCategory = (data) => axiosWrapper.post("/category", data);
export const getCategories = () => axiosWrapper.get("/category");
export const deleteCategory = (id) => axiosWrapper.delete(`/category/${id}`);

// -------------------- Dish Endpoints --------------------
export const addDish = (data) => axiosWrapper.post("/dish", data);
export const getDishes = () => axiosWrapper.get("/dish");
export const deleteDish = (id) => axiosWrapper.delete(`/dish/${id}`);
export const updateDish = (id, data) => axiosWrapper.put(`/dish/${id}`, data);
export const getDishesByCategory = (categoryId) => axiosWrapper.get(`/dish/category/${categoryId}`);
