import React, { useEffect } from "react";
import Nav from "./Nav";
import { useSelector, useDispatch } from "react-redux";
import { FaUtensils, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { OwnerItemCard } from "./OwnerItemCard";
import { setMyShopData } from "../redux/ownerSlice";

function OwnerDashBoard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { myShopData, userData } = useSelector((state) => state.owner);

  console.log("this is ui section p", myShopData);

  // ✅ Optimized useEffect (clean & error-free)
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/shop/get-my-account", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ✅ send cookies for auth
        });

        const data = await res.json();
        console.log("📦 Fetched shop data:", data);

        if (res.ok) {
          dispatch(setMyShopData(data)); // ✅ store shop data
        } else {
          dispatch(setMyShopData(null));
        }
      } catch (err) {
        console.error("❌ Fetch shop error:", err);
        dispatch(setMyShopData(null));
      }
    };

    fetchShop();
  }, [dispatch, userData]); // ✅ Correct dependencies added

  // rest of your code (unchanged)
  if (!myShopData?.shop) {
    return (
      <div className="bg-[#fff9f6] flex flex-col items-center min-h-screen">
        <Nav />
        <div className="flex justify-center items-center p-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Add Your Restaurant
              </h2>
              <p className="text-gray-500 mb-4 text-sm sm:text-base">
                Join our food delivery platform and reach thousands of hungry
                customers every day.
              </p>
              <button
                className="bg-[#ff4d2d] text-white px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200"
                onClick={() => navigate("/create-edit-shop")}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fff9f6] flex flex-col items-center overflow-hidden min-h-screen">
      <Nav />
      <div className="text-2xl sm:text-3xl text-gray-900 flex items-center gap-3 mt-8 text-center flex-col">
        <FaUtensils className="text-[#ff4d2d] w-14 h-14" />
        <h1>Welcome to {myShopData.shop.name}</h1>
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-200 w-full max-w-3xl relative">
          <div
            className="absolute top-4 right-4 bg-[#ff4d2d] text-white p-2 rounded-full shadow-sm hover:bg-orange-600 transition-colors cursor-pointer"
            onClick={() => navigate("/create-edit-shop")}
          >
            <FaPen size={20} />
          </div>
          <img
            src={myShopData.shop.image.url}
            alt={myShopData.shop.name}
            className="w-full h-48 sm:h-64 object-cover"
          />
          <div className="p-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              {myShopData.shop.name}
            </h1>
            <p className="text-gray-500">
              {myShopData.shop.city}, {myShopData.shop.state}
            </p>
            <p className="text-gray-500 mb-4">{myShopData.shop.address}</p>
          </div>
        </div>
      </div>

      {(!myShopData.shop.items || myShopData.shop.items.length === 0) ? (
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 mt-6">
          <div className="flex flex-col items-center text-center">
            <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Add Your Food Item
            </h2>
            <p className="text-gray-500 mb-4 text-sm sm:text-base">
              Share your delicious creations with our customers by adding them
              to the menu.
            </p>
            <button
              className="bg-[#ff4d2d] text-white px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200"
              onClick={() => navigate("/add-item")}
            >
              Add Food
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 w-full max-w-3xl mt-6">
          {myShopData.shop.items.map((item, index) => (
            <OwnerItemCard data={item} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default OwnerDashBoard;
