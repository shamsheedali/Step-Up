import React, { useState } from "react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import SignupImg from '../../../assets/images/auth/nike.png';
import { adminlogin } from '../../../api/admin'
import { useNavigate } from "react-router-dom";


const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation logic
  const validate = () => {
    let tempErrors = {};
    if (!formData.email) tempErrors.email = "Email is required";
    if (!formData.password) tempErrors.password = "Password is required";
    else if (formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) { 
      const loginSuccess = await adminlogin(formData);
  
      if (loginSuccess) {
        navigate('/dashboard'); 
      } else {
        setErrors({ general: "Invalid login credentials" }); 
      }
    }
  };
  

  return (
    <div className="bg-[#1a3120] w-full h-screen flex items-center justify-center">
      <div className="bg-white w-[70%] h-[80%] rounded-md flex">
        <div className="bg-black w-[50%] h-[100%] flex flex-col justify-center items-center">
          <img src={SignupImg} alt="" className="w-[286px] rotate-[321deg] brightness-[0.6] relative right-[40px] bottom-[35px]" />

          <h1 className="text-6xl absolute font-bold text-white">StepUp</h1>

        </div>
        <div className="w-[50%] text-black font-clash-grotesk flex flex-col items-center justify-center py-3 gap-8 text-center">
          <div>
            <h1 className="text-3xl font-bold font-clash-grotesk">
              Admin Login
            </h1>
          </div>
          <form className="flex flex-col gap-8 relative top-2" onSubmit={handleSubmit}>
            {/* Input section */}
            <div className="relative w-80">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="peer w-full text-lg border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-black focus:ring-0 transition duration-300 ease-in-out"
                required
              />
              <label
                className="absolute left-0 top-0 text-gray-400 transition-all duration-300 ease-in-out pointer-events-none peer-focus:top-[-20px] peer-valid:top-[-20px] peer-focus:text-gray-800 peer-valid:text-gray-800 peer-focus:text-sm peer-valid:text-sm"
              >
                Email
              </label>
              <div className="text-red-600">{errors.email}</div>
            </div>

            <div className="relative w-80">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="peer w-full text-lg border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-gray-800 focus:ring-0 transition duration-300 ease-in-out"
                required
              />
              <label
                className="absolute left-0 top-0 text-gray-400 transition-all duration-300 ease-in-out pointer-events-none peer-focus:top-[-20px] peer-valid:top-[-20px] peer-focus:text-gray-800 peer-valid:text-gray-800 peer-focus:text-sm peer-valid:text-sm"
              >
                Password
              </label>
              <div className="text-red-600">{errors.password}</div>
            </div>
            {errors.general && <div className="text-red-600 mt-2">{errors.general}</div>}
            <button
              type="submit"
              className="btn w-60 text-white mx-auto bg-black"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
