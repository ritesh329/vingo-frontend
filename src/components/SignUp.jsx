import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    mobileNo: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
   const navigate=useNavigate();
  // 🔹 Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Normal Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://vingo-sozm.onrender.com/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ cookie allow
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        throw new Error(data.error || `HTTP error! status: ${res.status}`);
      }

      // ✅ Redux store update
      console.log("rdux ",data);
      // dispatch(setUserData(data.user));
    

      alert("Account created successfully!");
      navigate('/signin');
    } catch (err) {
      console.error("Signup failed:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Google Signup / Login
  const handleGoogleAuth = async () => {
    if (!formData.mobileNo) {
      setError("Mobile number is required before Google signup");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const { displayName, email } = result.user;

      const response = await fetch(
        "https://vingo-sozm.onrender.com/api/auth/google-auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ✅ cookie allow
          body: JSON.stringify({
            fullName: displayName,
            email,
            mobile: formData.mobileNo,
            role: formData.role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Google auth failed");
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      dispatch(setUserData(data.user || data));
      alert(data.message || "Google Login successful!");
    } catch (err) {
      console.error("Google Auth Error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Mobile No</label>
            <input
              type="text"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="user">User</option>
              <option value="owner">Owner</option>
              <option value="deliveryBoy">Delivery Boy</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} /> : "Sign Up"}
          </button>
        </form>

        {/* Google Login */}
        <button
          className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:border-gray-600"
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          {loading ? (
            <ClipLoader size={20} />
          ) : (
            <>
              <FcGoogle size={20} />
              <span>Login with Google</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SignUp;
