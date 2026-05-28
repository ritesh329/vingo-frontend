import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMyOrders } from "../redux/userSlice";

const useGetMyOrders = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("https://vingo-sozm.onrender.com/api/order/my-orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ✅ Send cookies/session
        });

        const data = await res.json();
        console.log("📦 this is orders data:", data);

        if (res.ok) {
          dispatch(setMyOrders(data)); // ✅ Store orders in redux
        } else {
          dispatch(setMyOrders(null)); // ❌ Error or empty response
        }
      } catch (err) {
        console.error("❌ useMyOrders error:", err);
        dispatch(setMyOrders(null));
      }
    };

    if (userData) {
      fetchOrders();
    }
  }, [dispatch, userData]);
};

export default useGetMyOrders;
