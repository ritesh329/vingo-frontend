import React, { useEffect, useState } from "react";
import { MdLocationOn } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { TiShoppingCart } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { GoPlus } from "react-icons/go";
import { TbReceiptFilled } from "react-icons/tb";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUserData, setSearchItems } from "../redux/userSlice";

function Nav() {

  const { userData, city,cartItems } = useSelector((state) => state.user);
const token = localStorage.getItem("token");
  const { myShopData } = useSelector((state) => state.owner);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
   const [query,setQuery]=useState("");
  const logout = async () => {
    try {
      const result = await fetch("https://vingo-sozm.onrender.com/api/auth/signout", {
        method: "GET",
        credentials: "include",
        headers: {
                 authorization: `Bearer ${token}`,
        }                                                           
      });

      const data = await result.json();
      if (!result.ok) throw new Error(data.error || "Logout failed");

      dispatch(clearUserData());
      navigate("/signin");
      alert(data.message);
    } catch (err) {
      console.error("Logout failed:", err.message);
      alert("Logout failed, please try again.");
    }
  };



   const handleSearchItems=async ()=>{


     try {
      const result = await fetch(`https://vingo-sozm.onrender.com/api/item/search-items?query=${query}&city=${city}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        credentials: "include"
      });

      const data = await result.json();

      if (!result.ok) {
        console.error("This is error for searching items", data.message);
        alert(data.message || "search items error");
        return;
      }

     
     dispatch(setSearchItems(data.items));
      console.log("searching item data:", data);

    } catch (err) {
      console.error("This is server error for searching item error:", err);
      
    }
   }

   useEffect(()=>{

     if(query){
       handleSearchItems()
     }else{
          dispatch(setSearchItems(null))
     }
   },[query])
  return (
    <div className="fixed top-0 z-[9999] flex h-20 w-full items-center justify-between gap-8 px-5 bg-[#fff9f6] md:justify-center">
      {/* 🔍 Mobile Search */}
      {showSearch && userData.role === "user" && (
        <div className="fixed top-20 left-[5%] flex h-[70%] w-[90%] items-center gap-5 rounded-lg bg-white px-3 shadow-xl md:hidden">
          <div className="flex w-[30%] items-center gap-2 overflow-hidden border-r-2 border-gray-400 pr-2">
            <MdLocationOn size={25} className="text-[#ff4d2d]" />
            <span className="truncate text-gray-600">{city}</span>
          </div>
          <div className="flex w-[80%] items-center gap-2">
            <IoSearch size={25} className="text-[#ff4d2d]" />
            <input
              type="text"
              placeholder="Search delicious food..."
              className="w-full px-2 text-gray-700 outline-0" onChange={(e)=>setQuery(e.target.value)} value={query}
            />
          </div>
        </div>
      )}

      {/* 🏠 Brand */}
      <h1
        className="cursor-pointer text-3xl font-bold text-[#ff4d2d]"
        onClick={() => navigate("/")}
      >
        Vingo
      </h1>

      {/* 🔍 Desktop Search */}
      {userData.role === "user" && (
        <div className="hidden h-[70%] items-center gap-5 rounded-lg bg-white shadow-xl md:flex md:w-[60%] lg:w-[40%]">
          <div className="flex w-[30%] items-center gap-2 overflow-hidden border-r-2 border-gray-400 px-2">
            <MdLocationOn size={25} className="text-[#ff4d2d]" />
            <span className="truncate text-gray-600">{city}</span>
          </div>
          <div className="flex w-[80%] items-center gap-2">
            <IoSearch size={25} className="text-[#ff4d2d]" />
            <input
              type="text"
              placeholder="Search delicious food..."
              className="w-full px-2 text-gray-700 outline-0" onChange={(e)=>setQuery(e.target.value)} value={query}
            />
          </div>
        </div>
      )}

      {/* 🔗 Actions */}
      <div className="flex items-center gap-4">
        {/* 📱 Mobile Search Toggle */}
        {userData.role === "user" &&
          (showSearch ? (
            <RxCross2
              size={25}
              className="text-[#ff4d2d] md:hidden"
              onClick={() => setShowSearch(false)}
            />
          ) : (
            <IoSearch
              size={25}
              className="text-[#ff4d2d] md:hidden"
              onClick={() => setShowSearch(true)}
            />
          ))}

        {/* 🛠 Owner Section */}
        {userData.role === "owner" ? (
          <>
            {myShopData && (
              <>
                {/* Add Item Button */}
                <button
                  onClick={() => navigate("/add-item")}
                  className="hidden items-center gap-1 rounded-full bg-[#ff4d2d]/10 p-2 text-[#ff4d2d] md:flex"
                >
                  <GoPlus size={20} />
                  <span>Add Food Item</span>
                </button>
                <button
                  onClick={() => navigate("/add-item")}
                  className="flex items-center gap-1 rounded-full bg-[#ff4d2d]/10 p-2 text-[#ff4d2d] md:hidden"
                >
                  <GoPlus size={20} />
                </button>
              </>
            )}

            {/* Orders */}
            <div className="relative hidden cursor-pointer items-center gap-2 rounded-lg bg-[#ff4d2d]/10 px-3 py-1 font-medium md:flex">
              <TbReceiptFilled size={20} />
              <span onClick={()=>navigate("/my-orders")}>My Orders</span>
              <span className="absolute -right-2 -top-2 rounded-full bg-[#ff4d2d] px-1.5 py-0.5 text-xs font-bold text-white">
                0
              </span>
            </div>
            <div className="relative flex cursor-pointer items-center gap-2 rounded-lg bg-[#ff4d2d]/10 px-3 py-1 font-medium md:hidden" onClick={()=>navigate("/my-orders")}>
              <TbReceiptFilled size={20} />
              <span className="absolute -right-2 -top-2 rounded-full bg-[#ff4d2d] px-1.5 py-0.5 text-xs font-bold text-white">
              0
              </span>
            </div>
          </>
        ) : (
          <>
            {/* 🛒 Cart */}

            {userData.role=="user" &&    <div className="relative cursor-pointer">
              <TiShoppingCart size={25} className="text-[#ff4d2d]" onClick={()=>navigate("/cart")}/>
              <span className="absolute -top-3 -right-2 text-sm font-bold text-[#ff4d2d]">
                  {cartItems.length}
              </span>
            </div>}
          
            <button className="hidden rounded-lg bg-[#ff4d2d]/10 px-3 py-1 text-sm font-medium text-[#ff4d2d] md:block" onClick={()=>navigate("/my-orders")}>
              My Orders
            </button>
          </>
        )}

        {/* 👤 User Info */}
        <div
          onClick={() => setShowInfo((prev) => !prev)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#ff4d2d] text-lg font-semibold text-white shadow-xl"
        >
          {userData.fullName?.[0]?.toUpperCase()}
        </div>

        {/* Dropdown */}
        {showInfo && (
          <div className="fixed top-20 right-3 z-[9999] flex w-44 flex-col gap-2 rounded-xl bg-white p-5 shadow-2xl md:right-[10%] lg:right-[25%]">
            <div className="text-lg font-semibold">
              {userData.fullName?.toUpperCase()}
            </div>

            {userData.role === "user" && (
              <div className="cursor-pointer font-semibold text-[#ff4d2d] md:hidden" onClick={()=>navigate("/my-orders")}>
                My Orders
              </div>
            )}

            <div
              className="cursor-pointer font-semibold text-[#ff4d2d]"
              onClick={logout}
            >
              Log Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Nav;
