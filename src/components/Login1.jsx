import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

export const Login1 = () => {
  const navigate = useNavigate();
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(false);
  const [formdata, setFormData] = useState({
    email: "",
    password: "",
  });

  // handle input changes
  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data Submitted:", formdata);
    alert(JSON.stringify(formdata));
    // 👉 यहाँ आप API call कर सकते हैं
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px] `}
        style={{ border: `1px solid ${borderColor}  ` }}
      >
        <h1 className={"text-3xl font-bold mb-2"} style={{ color: primaryColor }}>
          Vingo
        </h1>
        <p className="text-gray-600 mb-8">
          Login to your account to continue with food deliveries
        </p>

        {/* ✅ Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1"
            >
              Email
            </label>
            <input
              type="email"
              value={formdata.email}
              onChange={handleChanges}
              name="email"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none "
              placeholder="Enter Your Email "
              style={{ border: `1px solid ${borderColor}  ` }}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-2 relative">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-1"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formdata.password}
              onChange={handleChanges}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none"
              placeholder="Enter Your Password"
              style={{ border: `1px solid ${borderColor}` }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-gray-600 hover:text-indigo-500"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-4">
            <p
              className="text-sm text-[#ff4d2d] cursor-pointer hover:underline"
              onClick={() => navigate("/forgotPassword")}
            >
              Forgot Password?
            </p>
          </div>

          {/* submit */}
          <button
            type="submit"
            className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer `}
          >
            Login
          </button>
        </form>

        {/* Google Login */}
        <button className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:border-gray-600">
          <FcGoogle size={20} />
          <span>Login with Google</span>
        </button>

        <p className="text-center mt-6 cursor-pointer" onClick={() => navigate("/signup")}>
          Don’t have an account?{" "}
          <span className="text-[#ff4d2d]">Sign up</span>
        </p>
      </div>
    </div>
  );
};
