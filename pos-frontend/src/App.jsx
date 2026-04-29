import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Home, Auth, Orders, Tables, Menu, Dashboard, AdminLogin, RegisterPage, AddCategory, AddDish, HallSelection, KitchenLogin, Kitchen } from "./pages";
import RoleSelection from "./pages/RoleSelection";
import Register from "./components/auth/Register";
import Header from "./components/shared/Header";
import { useSelector, useDispatch } from "react-redux";
import useLoadData from "./hooks/useLoadData";
import PageLoader from "./components/shared/PageLoader"
import { useEffect, useRef } from "react";
import { removeCustomer } from "./redux/slices/customerSlice";
import { removeAllItems } from "./redux/slices/cartSlice";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "./https";
import { useSnackbar } from "notistack";

function Layout() {
  const isLoading = useLoadData();
  const location = useLocation();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const hideHeaderRoutes = ["/auth", "/", "/admin-login", "/kitchen-login", "/register"];
  const user = useSelector(state => state.user);
  const isAuth = user.isAuth;
  const isKitchen = user.role?.toLowerCase() === "kitchen";
  const lastOrderCountRef = useRef(-1);

  // Reset lastOrderCountRef when user logs in or out
  useEffect(() => {
    lastOrderCountRef.current = -1;
  }, [isAuth, user._id]);

  // Global Notification Listener (Stays alive across page navigations)
  const { data: resData } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    refetchInterval: 5000,
    enabled: !!isAuth, // Only fetch if logged in
  });

  const orders = resData?.data?.data || [];

  useEffect(() => {
    if (!resData || !isKitchen) return;

    const inProgressOrders = orders.filter(
      (o) => o.orderStatus?.toLowerCase() === "in progress"
    );

    // Initial sync (First load after login)
    if (lastOrderCountRef.current === -1) {
      const currentCount = inProgressOrders.length;
      lastOrderCountRef.current = currentCount;
      
      if (currentCount > 0) {
        enqueueSnackbar(`Kitchen Alert: You have ${currentCount} pending orders!`, { 
          variant: "info",
          autoHideDuration: 5000,
          anchorOrigin: { vertical: "top", horizontal: "right" }
        });
      }
      return;
    }

    // New order notification
    if (inProgressOrders.length > lastOrderCountRef.current) {
      enqueueSnackbar("New order received in kitchen!", { 
        variant: "info",
        autoHideDuration: 4000,
        anchorOrigin: { vertical: "top", horizontal: "right" }
      });
    }

    // Keep count in sync
    lastOrderCountRef.current = inProgressOrders.length;
  }, [isKitchen, orders, resData, enqueueSnackbar]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Clear in-progress order when leaving menu/tables flow
  useEffect(() => {
    const validPaths = ["/menu", "/tables", "/hall-selection"];
    const inFlow = validPaths.some(path => location.pathname.startsWith(path));
    
    if (!inFlow) {
      dispatch(removeCustomer());
      dispatch(removeAllItems());
    }
  }, [location.pathname, dispatch]);

  if(isLoading) return <PageLoader />

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoutes>
              <RoleSelection />
            </PublicRoutes>
          }
        />
        <Route path="/home" element={
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        } />
        <Route
          path="/auth"
          element={
            <PublicRoutes>
              <Auth />
            </PublicRoutes>
          }
        />
        <Route
          path="/admin-login"
          element={
            <PublicRoutes>
              <AdminLogin />
            </PublicRoutes>
          }
        />
        <Route
          path="/kitchen-login"
          element={
            <PublicRoutes>
              <KitchenLogin />
            </PublicRoutes>
          }
        />
        <Route
          path="/kitchen"
          element={
            <ProtectedRoutes>
              <Kitchen />
            </ProtectedRoutes>
          }
        />
        <Route path="/register" element={
          <ProtectedRoutes>
            <RegisterPage />
          </ProtectedRoutes>
        } />
        <Route
          path="/orders"
          element={
            <ProtectedRoutes>
              <Orders />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/hall-selection"
          element={
            <ProtectedRoutes>
              <HallSelection />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/tables"
          element={
            <ProtectedRoutes>
              <Tables />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/menu"
          element={
            <ProtectedRoutes>
              <Menu />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/add-category"
          element={
            <ProtectedRoutes>
              <AddCategory />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/add-dish"
          element={
            <ProtectedRoutes>
              <AddDish />
            </ProtectedRoutes>
          }
        />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </>
  );
}

function ProtectedRoutes({ children }) {
  const { isAuth } = useSelector((state) => state.user);
  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function PublicRoutes({ children }) {
  const { isAuth } = useSelector((state) => state.user);
  if (isAuth) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
