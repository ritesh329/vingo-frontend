import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

const useGetMyshop = () => {
  const dispatch = useDispatch();
   const {userData}=useSelector(state=>state.user);
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch("https://vingo-sozm.onrender.com/api/shop/get-my-account", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ✅ Cookies bhejne ke liye
        });

        const data = await res.json();
        console.log("📦 useGetMyshop data:", data);

        if (res.ok) {
          dispatch(setMyShopData(data)); // ✅ shop data store
        } else {
          dispatch(setMyShopData(null));
        }
      } catch (err) {
        console.error("❌ useGetMyshop error:", err);
        dispatch(setMyShopData(null));
      }
    };

    fetchShop();
  }, [dispatch,userData]);
};

export default useGetMyshop;
