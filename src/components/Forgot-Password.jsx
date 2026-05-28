import React, { useState } from 'react';
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
  import { ClipLoader } from "react-spinners";
export const ForgotPassword = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // 🔹 States
  const [email, setEmail] = useState(""); 
  const [otp, setOtp] = useState(""); 
  const [newPassword, setNewPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [error, setError] = useState(""); 
  const [loading,setLoading] = useState(false);
  const borderColor = "#ddd";


  // 🔹 Send OTP
  const handleSendOtp = async () => {
    const token = localStorage.getItem("token");

    setLoading(true);

    if (!email) {
      setError("Please enter your email!");
      setLoading(false);
      return;
    }
    setError("");
    try {
      const response = await fetch("https://vingo-sozm.onrender.com/api/auth/otp-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" ,
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email })   // ✅ Correct format
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      alert(data.message);
      setStep(2);
       setLoading(false);
    } catch (err) {
      setError(err.message);
       setLoading(false);

    }
   
  };

  // 🔹 Verify OTP
  const handleVerifyOtp = async () => {

    setLoading(true);

    if (!otp) {
      setError("Please enter OTP!");
       setLoading(false);
      return;
    }
    setError("");
    try {
      const response = await fetch("https://vingo-sozm.onrender.com/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json",  authorization: `Bearer ${token}`, },
        body: JSON.stringify({ email, otp })  
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      alert(data.message);
      setStep(3);
       setLoading(false);
    } catch (err) {
      setError(err.message);
       setLoading(false);
    }
  };

  // 🔹 Reset Password
  const handleResetPassword = async () => {
      setLoading(true);
    if (!newPassword || !confirmPassword) {
       setLoading(false);
      setError("All password fields are required!");
      return;
    }
    if (newPassword !== confirmPassword) {
       setLoading(false);
      setError("Passwords do not match!");
      return;
    }
    setError("");
    try {
      const response = await fetch("https://vingo-sozm.onrender.com/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, newPassword })
          // ✅ Correct format
      });

      const data = await response.json();

      if (!response.ok) {
         setLoading(false);
        throw new Error(data.error || `Password reset error! status: ${response.status}`);
      }

      alert("Password reset successful!");
       setLoading(false);
      navigate("/signin");
    } catch (err) {
      setError(err.message);
       setLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <IoArrowBackSharp
            size={30}
            className="text-[#ff4d2d] cursor-pointer"
            onClick={() => navigate('/signin')}
          />
          <h1 className="text-2xl font-bold text-[#ff4d2d]">Forgot Password</h1>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Step 1: Email */}
        {step === 1 && (
          <div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter your email"
                style={{ border: `1px solid ${borderColor}` }}
                required
              />
            </div>
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-[#ff4d2d] text-white py-2 px-4 rounded-lg font-medium transition hover:bg-[#e04326]">
              {loading ? <ClipLoader/> : "Send OTP" }
            
            </button>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <div>
            <div className="mb-6">
              <label htmlFor="otp" className="block text-gray-700 font-medium mb-1">Enter OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter OTP"
                style={{ border: `1px solid ${borderColor}` }}
                required
              />
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-[#ff4d2d] text-white py-2 px-4 rounded-lg font-medium transition hover:bg-[#e04326]">
                   {loading ? <ClipLoader/> : "Verify OTP" }
           
            </button>
          </div>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <div>
            <div className="mb-6">
              <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-1">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter new password"
                style={{ border: `1px solid ${borderColor}` }}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Confirm new password"
                style={{ border: `1px solid ${borderColor}` }}
                required
              />
            </div>
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-[#ff4d2d] text-white py-2 px-4 rounded-lg font-medium transition hover:bg-[#e04326]">
               {loading ? <ClipLoader/> : "Reset Password" }
              
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
