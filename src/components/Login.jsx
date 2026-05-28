import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();
  const primaryColor = "#ff4d2d"
  const hoverColor = "#e64323"
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('user');
  const [formdata, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    mobileNo: '',
    role: 'user',
  });

  // handle input changes
  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // handle role separately
  const handleRole = (r) => {
    setRole(r);
    setFormData(prev => ({ ...prev, role: r }));
  }

  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page refresh
    console.log("Form Data Submitted:", formdata);

    alert(JSON.stringify(formdata));
    
  }

  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4' style={{ backgroundColor: bgColor }}>

      <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px] `} style={{ border: `1px solid ${borderColor}  ` }}>
        <h1 className={'text-3xl font-bold mb-2'} style={{ color: primaryColor }}>Vingo</h1>
        <p className='text-gray-600 mb-8'>Create your account to get started with delicious food deliveries</p>

        {/* ✅ Form start */}
        <form onSubmit={handleSubmit}>

          {/* full Name */}
          <div className='mb-4'>
            <label htmlFor='fullName' className='block text-gray-700 font-medium mb-1'>Full Name</label>
            <input
              type='text'
              value={formdata.fullName}
              onChange={handleChanges}
              name='fullName'
              className='w-full border rounded-lg px-3 py-2 focus:outline-none '
              placeholder="Enter Your Full Name "
              style={{ border: `1px solid ${borderColor}  ` }}
              required
            />
          </div>

          {/* email */}
          <div className='mb-4'>
            <label htmlFor='email' className='block text-gray-700 font-medium mb-1'>Email</label>
            <input
              type='email'
              value={formdata.email}
              onChange={handleChanges}
              name='email'
              className='w-full border rounded-lg px-3 py-2 focus:outline-none '
              placeholder="Enter Your Email "
              style={{ border: `1px solid ${borderColor}  ` }}
              required
            />
          </div>

          {/* Mobile no */}
          <div className='mb-4'>
            <label htmlFor='mobileNo' className='block text-gray-700 font-medium mb-1'>Mobile Number</label>
            <input
              type='text'
              value={formdata.mobileNo}
              onChange={handleChanges}
              name='mobileNo'
              className='w-full border rounded-lg px-3 py-2 focus:outline-none '
              placeholder="Enter Your Mobile Number "
              style={{ border: `1px solid ${borderColor}  ` }}
              required
            />
          </div>

          {/* password */}
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password</label>
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

          {/* role */}
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700 font-medium mb-1">Role</label>
            <div className='flex gap-4'>
              {["user", "owner", "deliveryBoy"].map((r) => (
                <button
                  key={r}
                  type="button"
                  className='flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors '
                  onClick={() => handleRole(r)}
                  style={role === r ? { backgroundColor: primaryColor, color: 'white' } : { border: borderColor, color: "#333" }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* submit */}
          <button
            type="submit"
            className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer `}
          >
            SignUp
          </button>

        </form>
        {/* ✅ Form end */}

        {/* Google Signup */}
        <button className='w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:border-gray-600'>
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button>

        <p className='text-center mt-6 cursor-pointer' onClick={() => navigate('/signin')}>
          Already have an account ? <span className='text-[#ff4d2d]'>Sign in</span>
        </p>

      </div>
    </div>
  )
}
