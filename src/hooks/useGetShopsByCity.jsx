import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShopsInMyCity } from "../redux/userSlice";

const useGetShopsByCity = () => {
  const dispatch = useDispatch();
  const { city } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city) return; // 🛑 Avoid fetching if no city selected

    const fetchShops = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://vingo-sozm.onrender.com/api/shop/get-shop-city/${city}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        const data = await res.json();
        console.log("📌 Shops in city:", data);

        if (res.ok) {
          dispatch(setShopsInMyCity(data.message));
        } else {
          dispatch(setShopsInMyCity(null));
          setError(data?.message || "Failed to fetch shops");
        }
      } catch (err) {
        dispatch(setShopsInMyCity(null));
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [city, dispatch]);

  return { loading, error };
};

export default useGetShopsByCity;
