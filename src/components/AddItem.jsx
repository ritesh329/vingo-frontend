import React, { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { FaUtensils } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setMyShopData } from "../redux/ownerSlice";

function AddItem() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const { myShopData } = useSelector((state) => state.owner);

  const categories = [
    "Snacks",
    "Desserts",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "South Indian",
    "Chinese",
    "Fast Food",
    "Others",
  ];

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    price: "",
    Foodtype: "veg",
    category: "",
  });

  const [frontendImage, setFrontendImage] = useState("");

  // ✅ Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ File input handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setFrontendImage(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, image: null }));
      setFrontendImage("");
    }
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.image) {
        alert("Please select an image before submitting.");
        return;
      }

      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", Number(formData.price)); // ensure number
      data.append("Foodtype", formData.Foodtype);
      data.append("category", formData.category);
      data.append("image", formData.image);

      const result = await fetch("https://vingo-sozm.onrender.com/api/item/add-item", {
        method: "POST",
        body: data,
        credentials: "include",
        headers: {
          authorization: token, // ✅ Include token in headers if needed by backend
        }
      });

      const resData = await result.json();

      if (!result.ok) {
        throw new Error(resData.error || "Failed to add food item.");
      }

      alert("Food item added successfully ✅");

      // reset form after success
      setFormData({
        name: "",
        image: null,
        price: "",
        Foodtype: "veg",
        category: "",
      });
      setFrontendImage("");

      navigate("/");
    } catch (err) {
      console.error("Error adding food item:", err.message);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen relative">
      {/* 🔙 Back Button */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute top-[20px] left-[20px] z-[10] cursor-pointer"
      >
        <IoMdArrowBack size={35} className="text-[#ff4d2d]" />
      </button>

      {/* Card */}
      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <FaUtensils className="text-[#ff4d2d] w-16 h-16" />
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2">Add Food</h1>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Food Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Image
            </label>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            {frontendImage && (
              <div className="mt-4">
                <img
                  src={frontendImage}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter Price"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Category
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500"
              value={formData.category}
              onChange={handleChange}
              name="category"
              required
            >
              <option value="">-- Select a category --</option>
              {categories.map((cate, index) => (
                <option value={cate} key={index}>
                  {cate}
                </option>
              ))}
            </select>
          </div>

          {/* Food Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Food Type
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500"
              value={formData.Foodtype}
              onChange={handleChange}
              name="Foodtype"
              required
            >
              <option value="veg">Veg</option>
              <option value="non veg">Non-Veg</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#ff4d2d] text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-orange-600 transition-all duration-200"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddItem;
