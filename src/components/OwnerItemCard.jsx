import React from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { setMyShopData } from "../redux/ownerSlice";
import { useDispatch } from "react-redux";

export const OwnerItemCard = ({ data }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const dispatch=useDispatch();
    // const { userData } = useSelector((state) => state.user);

const handleDelete = async (itemId) => {
  try {
    const response = await fetch(
      `https://vingo-sozm.onrender.com/api/item/delete/${itemId}`,
      {
        method: "DELETE", // ✅ Correct method
        headers: {
          "Content-Type": "application/json",
             "authorization": `Bearer ${token}`, // ✅ Correct header
        },
        credentials: "include", // ✅ For sending cookies/session
      }
    );

    const result = await response.json();

      console.log(result.items);
    if (!response.ok) {
      throw new Error(result.error || "Failed to delete item");
    }

    alert("Item deleted successfully ✅");

   
    dispatch(setMyShopData(result.items));
     navigate("/");
  } catch (err) {
    console.error("Error deleting item:", err);
    alert(`Error: ${err.message}`);
  }
};


  if (!data) return null; // ✅ Safety check

  return (
    <div className="mb-7 flex w-full max-w-2xl overflow-hidden rounded-2xl border border-[#ff4d2d]/60 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
      {/* 🖼 Image Section */}
      <div className="flex h-40 w-48 flex-shrink-0 items-center justify-center bg-gray-100">
        <img
          src={data.image}
          alt={data.name}
          className="h-full w-full rounded-l-2xl object-cover"
        />
      </div>

      {/* 📄 Content Section */}
      <div className="flex flex-1 flex-col justify-between p-4">
        {/* Title & Details */}
        <div>
          <h2 className="text-lg font-bold text-[#ff4d2d]">{data.name}</h2>
          <p className="mt-1 text-sm text-gray-700">
            <span className="font-medium">Category:</span> {data.category}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Food Type:</span> {data.Foodtype}
          </p>
        </div>

        {/* Price & Actions */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-base font-semibold text-gray-800">
            Price:{" "}
            <span className="text-[#ff4d2d]">
              ₹{data.price} {/* ✅ Currency prefix */}
            </span>
          </div>

          <div className="flex space-x-3">
            {/* ✏️ Edit Button */}
            <button
              onClick={() => navigate(`/edit-item-owner/${data._id}`)}
              className="rounded-full p-2 text-[#ff4d2d] transition-colors hover:bg-orange-100"
              title="Edit Item"
            >
              <FaPen />
            </button>

            {/* 🗑 Delete Button */}
           <button
  onClick={() => handleDelete(data._id)} // ✅ agar item ka id pass karna hai
  className="rounded-full p-2 text-red-500 transition-colors hover:bg-red-100"
  title="Delete Item"
>
  <FaTrash />
</button>
          </div>
        </div>
      </div>
    </div>
  );
};
