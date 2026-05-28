import React, { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { FaUtensils } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setMyShopData } from "../redux/ownerSlice"; 

function CreateEditShop() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
const token = localStorage.getItem("token");
  const { myShopData } = useSelector((state) => state.owner);
  const { city, stateName, currentAddress } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: myShopData?.shop?.name || "",
    image: null,
    city: myShopData?.shop?.city || city || "",
    stateName: myShopData?.shop?.stateName || stateName || "",
    address: myShopData?.shop?.address || currentAddress || "",
  });

  const [frontendImage, setFrontendImage] = useState(
    myShopData?.shop?.image.url || ""
  );

  // ✅ Input change handler
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
      const data = new FormData();
      data.append("name", formData.name);
      data.append("image", formData.image);
      data.append("city", formData.city);
      data.append("state", formData.stateName);
      data.append("address", formData.address);

      const result = await fetch("https://vingo-sozm.onrender.com/api/shop/create-edit", {
        method: "POST",
        body: data,
        credentials: "include",
       
        headers: {
          authorization: `Bearer ${token}`, // ✅ Include token in headers if needed by backend
        }
        
      });

      const resData = await result.json();

      if (!result.ok) {
        throw new Error(resData.error || "Creation of shop error");
      }

      // ✅ Update Redux state
    dispatch(setMyShopData(resData.shop));
      alert("Shop is created ✅");
      navigate("/"); // redirect after success
    } catch (err) {
      console.error("Creation of shop error:", err.message);
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
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
            {myShopData ? "Edit Shop" : "Add Shop"}
          </h1>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Shop Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Shop Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* Shop Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Image
            </label>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {frontendImage && (
              <div className="mt-4">
                <img
                  src={frontendImage}
                  alt="Shop Preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* City & State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                  onChange={handleChange}
                // readOnly
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                name="stateName"
                value={formData.stateName}
                  onChange={handleChange}
                // readOnly
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter Shop Address"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
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

export default CreateEditShop;
