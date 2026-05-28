import React, { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import { setMyShopData } from "../redux/ownerSlice";

function EditOwnerItem() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const { myShopData } = useSelector((state) => state.owner);

  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // ✅ Update form when item is loaded
  useEffect(() => {
    if (currentItem) {
      setFormData({
        name: currentItem.name || "",
        image: null,
        price: currentItem.price || "",
        Foodtype: currentItem.Foodtype || "veg",
        category: currentItem.category || "",
      });
      setFrontendImage(currentItem.image || "");
    }
  }, [currentItem]);

  // ✅ Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ File handler (with preview)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFormData((prev) => ({ ...prev, image: file || null }));
    setFrontendImage(file ? URL.createObjectURL(file) : currentItem?.image || "");
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", Number(formData.price));
      data.append("Foodtype", formData.Foodtype);
      data.append("category", formData.category);

      if (formData.image) {
        data.append("image", formData.image || currentItem.image );
      }

      const response = await fetch(
        `https://vingo-sozm.onrender.com/api/item/edit-item/${itemId}`,
        { method: "POST", body: data, credentials: "include",
          headers: {
            "authorization": `Bearer ${token}`
          }
        }
      );

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || "Failed to update item.");

      dispatch(setMyShopData(resData.shop));
      alert("Food item updated successfully ✅");
      navigate("/");
    } catch (err) {
      console.error("Error updating item:", err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch item by ID
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(
          `https://vingo-sozm.onrender.com/api/item/get-by-id/${itemId}`,
          { method: "GET", credentials: "include",
            headers:{
                authorization: `Bearer ${token}`,
            }
           }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch item.");
        setCurrentItem(data);
      } catch (err) {
        console.error("Fetch item error:", err.message);
      }
    };

    fetchItem();
  }, [itemId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-orange-50 to-white relative">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 z-10 cursor-pointer"
      >
        <IoMdArrowBack size={35} className="text-[#ff4d2d]" />
      </button>

      {/* Card */}
      <div className="w-full max-w-lg p-8 bg-white border border-orange-100 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <FaUtensils className="w-16 h-16 text-[#ff4d2d]" />
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
            Edit Food
          </h1>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
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
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Food Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {frontendImage && (
              <div className="mt-4">
                <img
                  src={frontendImage}
                  alt="Preview"
                  className="object-contain w-full h-48 border rounded-lg bg-gray-50"
                />
              </div>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
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
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Select Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500"
              required
            >
              <option value="">-- Select a category --</option>
              {categories.map((cate, index) => (
                <option key={index} value={cate}>
                  {cate}
                </option>
              ))}
            </select>
          </div>

          {/* Food Type */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Select Food Type
            </label>
            <select
              name="Foodtype"
              value={formData.Foodtype}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500"
              required
            >
              <option value="veg">Veg</option>
              <option value="non veg">Non-Veg</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 ${
              loading
                ? "bg-orange-300 cursor-not-allowed text-white"
                : "bg-[#ff4d2d] hover:bg-orange-600 text-white"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditOwnerItem;
