import React, { useState } from "react";
import { FaLeaf } from "react-icons/fa";
import { FaDrumstickBite } from "react-icons/fa";
import { IoStarSharp } from "react-icons/io5";
import { FaRegStar } from "react-icons/fa6";
import { TiMinus, TiPlus } from "react-icons/ti";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";
function FoodCard({ data }) {

   const {cartItems}=useSelector(state=>state.user);

     console.log("thi cart section",cartItems);

  const dispatch= useDispatch();
  const [Quantity,setQuantity]=useState(0);
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <IoStarSharp key={i} className="text-yellow-500 text-sm" />
        ) : (
          <FaRegStar key={i} className="text-yellow-500 text-sm" />
        )
      );
    }
    return stars;
  };

  const handleIncrease=()=>{
       const newQty=Quantity+1;
       setQuantity(newQty);
  }

   const handleDecrese=()=>{

      if(Quantity>0){
       const newQty=Quantity-1;
       setQuantity(newQty);
      }
  }

  return (
    <div className="w-[220px] rounded-xl border border-[#ff4d2d] bg-white shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col">
      {/* Food Image + Type */}
      <div className="relative w-full h-[150px] flex justify-center items-center bg-white">
        <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow">
          {data.Foodtype === "veg" ? (
            <FaLeaf className="text-green-500 text-lg" />
          ) : (
            <FaDrumstickBite className="text-red-500 text-lg" />
          )}
        </div>
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Food Details */}
      <div className="flex flex-col p-3 flex-1">
        <h1 className="font-semibold text-gray-900 text-sm truncate">
          {data.name}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          {renderStars(data.rating?.average || 0)}
          <span className="text-xs text-gray-500">
            {data.rating?.count || 0}
          </span>
        </div>

        {/* Price + Quantity */}
        <div className="flex justify-between items-center mt-3">
          <span className="font-semibold text-gray-800 text-sm">
            ₹{data.price}
          </span>

          <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
            <button className="px-2 py-1 hover:bg-gray-100 transition" onClick={handleDecrese}>
              <TiMinus />
            </button>
            <span className="px-2 text-sm text-gray-700">
              {Quantity || 0}
            </span>
            <button className="px-2 py-1 hover:bg-gray-100 transition" onClick={handleIncrease}>
              <TiPlus />
            </button>
            <button className={`${cartItems.some(i=>i.id==data._id) ? "bg-gray-800" : "bg-[#ff4d2d]"} text-white px-3 py-2 transition-colors`} onClick={
               ()=>
                
                Quantity>0 ? 
                
                dispatch(addToCart({
                 id:data._id,
                 name:data.name,
                  price:data.price,
                 image:data.image,
                 shop:data.shop,
                quantity:Quantity,
              foodType:data.Foodtype
               })): null
            }>
              <FaShoppingCart />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
