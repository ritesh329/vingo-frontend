import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import SignUp from "./components/SignUp";
import Signin from "./components/Signin";
import { ForgotPassword } from "./components/Forgot-Password";
import Home from "./components/Home";
import CreateEditShop from "./components/CreateEditShop";
import AddItem from "./components/AddItem";
import EditOwnerItem from "./components/EditOwnerItem";

import useGetCurrentUser from "./hooks/useGetCurrentUser";
import useGetCity from "./hooks/useGetCity";
import useGetMyshop from "./hooks/useGetMyShop";

import useGetShopsByCity from "./hooks/useGetShopsByCity";
import useGetItemsInMyCity from "./hooks/useGetItemByCity";
import CartPage from "./components/CartPage";
import CheckOut from "./components/CheckOut";
import OrderPlaced from "./components/OrderPlaced";
import MyOrders from "./components/MyOrders";
import useGetMyOrdes from "./hooks/useGetMyorders";
import useUpdateLocation from "./hooks/useUpdateLocation";
import TrackOrderPage from "./components/TrackOrderPage";
import Shop from "./components/Shop";
import { useEffect } from "react";
import { setSocket } from "./redux/userSlice";
import {io} from 'socket.io-client'
function App() {

//  const { userData, myOrders } = useSelector(state => state.user)
  const dispatch=useDispatch();
 const { userData } = useSelector((state) => state.user);
  // 🔄 Custom hooks for auto-fetching user, shop, and city data
    useGetCity();
  useGetMyshop();

  useGetCurrentUser();

  useGetShopsByCity();
  useGetItemsInMyCity();
  useGetMyOrdes();
  useUpdateLocation();


     useEffect(() => {
    if (!userData?._id) return; // prevent running before user data is available

    // ✅ Proper key name is `withCredentials`, not `Credential`
    const socketInstance = io("https://vingo-sozm.onrender.com", {
      withCredentials: true,
    });

    // ✅ Save socket in Redux store
    dispatch(setSocket(socketInstance));

    socketInstance.on("connect", () => {
      console.log("🔗 Socket connected:", socketInstance.id);

      // ✅ Emit identity event to server
      socketInstance.emit("identity", { userId: userData._id });
    });

    socketInstance.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
    });

    // ✅ Clean up socket when component unmounts
    return () => {
      socketInstance.disconnect();
      console.log("🔌 Socket disconnected");
    };
  }, [userData, dispatch]);

    

    
   

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/" />}
      />
      <Route
        path="/signin"
        element={!userData ? <Signin /> : <Navigate to="/" />}
      />
      <Route
        path="/forgotPassword"
        element={!userData ? <ForgotPassword /> : <Navigate to="/" />}
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/signin" />}
      />
      <Route
        path="/create-edit-shop"
        element={userData ? <CreateEditShop /> : <Navigate to="/signin" />}
      />
      <Route
        path="/add-item"
        element={userData ? <AddItem /> : <Navigate to="/signin" />}
      />
      <Route
        path="/edit-item-owner/:itemId"
        element={userData ? <EditOwnerItem /> : <Navigate to="/signin" />}
      />
        <Route
        path="/cart"
        element={userData ? <CartPage /> : <Navigate to="/signin" />}
      />
       <Route
        path="/checkOut"
        element={userData ? <CheckOut /> : <Navigate to="/signin" />}
      />
       <Route
        path="/order-placed"
        element={userData ? <OrderPlaced/> : <Navigate to="/signin" />}
      />
       <Route
        path="/my-orders"
        element={userData ? <MyOrders/> : <Navigate to="/signin" />}
      />
       <Route
        path="/track-order/:orderId"
        element={userData ? <TrackOrderPage/> : <Navigate to="/signin" />}
      />
       <Route
        path="/shop/:shopId"
        element={userData ? <Shop/> : <Navigate to="/signin" />}
      />

      {/* Fallback Route (404 → redirect to home or signin) */}
      <Route path="*" element={<Navigate to={userData ? "/" : "/signin"} />} />
    </Routes>
  );
}

export default App;
