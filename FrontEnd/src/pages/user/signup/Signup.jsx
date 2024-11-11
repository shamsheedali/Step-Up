import React, { useEffect, useState } from "react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import SignupImg from '../../../assets/images/auth/nike.png';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../../features/users/UserSlice';
import { Link, useNavigate } from "react-router-dom";
import { signUp, storeGoogleInfo } from "../../../api/users";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../../../../firebase/firebase';
import { toast } from "react-toastify";
import { sendOtp } from "../otp/OtpPage";
import { initializeBag } from "../../../features/bag/BagSlice";

const Signup = () => {
  
  const isVerified = useSelector((state) => state.user.isVerified);

  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //checking user verified or not in useEffect
  useEffect(() => {
    if(isVerified) {
      navigate('/')
    }
  }, [])

  // Validation logic
  const validate = () => {
    let tempErrors = {};

    // Username validation
    if (!formData.username) {
      tempErrors.username = "Username is required";
    } else if (/^[0-9]/.test(formData.username)) {
      tempErrors.username = "Username cannot start with a number";
    } else if (/^\s/.test(formData.username)) {
      tempErrors.username = "Username cannot start with a space";
    } else if (formData.username.length < 4) {
      tempErrors.username = "Username must be at least 4 characters";
    }

    // Email validation
    if (!formData.email) {
      tempErrors.email = "Email is required";
    }

    // Password validation
    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handleing form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true); 
      try {
        const {newUser} = await signUp(formData); 
        await sendOtp(newUser);
        navigate('/otp');
      } catch (error) {
        console.error("Signup failed:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  //google signup
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // User signed in successfully
      console.log("Signup successful: ", result.user);
      const user = result.user;
      toast.success("Signup Successful");
      const userDetails = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        profileImage: user.photoURL, 
      }
      await storeGoogleInfo(userDetails);
      dispatch(setUser({uid: user.uid, username: user.displayName, email: user.email, isVerified: true}));
      dispatch(initializeBag({ userId: user.uid }))

      // Redirect to homepage
      navigate("/"); 
    } catch (error) {
      console.error("Error during Google sign-up:", error);
    }
  };

  return (
    <div className="bg-[#dbdbdb] w-full h-screen flex items-center justify-center">
      <div className="bg-white w-[70%] h-[80%] rounded-md flex" style={{boxShadow: '7px 6px 11px black'}}>
        <div className="bg-black w-[50%] h-[100%] flex flex-col justify-center rounded-md items-center">
          <img src={SignupImg} alt="" className="w-[286px] rotate-[321deg] brightness-[0.6] relative right-[40px] bottom-[35px]" />
          <h1 className="text-6xl absolute font-bold text-white">StepUp</h1>
        </div>
        <div className="w-[50%] text-black font-clash-grotesk flex flex-col items-center justify-evenly py-3 gap-3 text-center">
          <div>
            <h1 className="text-3xl font-bold font-clash-grotesk">Get Started</h1>
            <h3 className="text-sm text-[#201f1fde] font-semibold">
              Already have an account? <Link to={'/login'} className="text-black underline">Log In</Link>
            </h3>
          </div>

          {/* Form section */}
          <form className="flex flex-col gap-8 relative top-2" onSubmit={handleSubmit}>
            <div className="relative w-80">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="peer w-full text-lg border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-black focus:ring-0 transition duration-300 ease-in-out"
                required
              />
              <label
                className="absolute left-0 top-[22px] text-gray-400 transition-all duration-300 ease-in-out pointer-events-none peer-focus:top-[-12px] peer-valid:top-[-12px] peer-focus:text-gray-800 peer-valid:text-gray-800 peer-focus:text-sm peer-valid:text-sm"
              >
                Username
              </label>
              <div className="text-red-600">{errors.username}</div>
            </div>

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
                className="absolute left-0 top-[22px] text-gray-400 transition-all duration-300 ease-in-out pointer-events-none peer-focus:top-[-12px] peer-valid:top-[-12px] peer-focus:text-gray-800 peer-valid:text-gray-800 peer-focus:text-sm peer-valid:text-sm"
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
                className="peer w-full text-lg border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-black focus:ring-0 transition duration-300 ease-in-out"
                required
              />
              <label
                className="absolute left-0 top-[22px] text-gray-400 transition-all duration-300 ease-in-out pointer-events-none peer-focus:top-[-12px] peer-valid:top-[-12px] peer-focus:text-gray-800 peer-valid:text-gray-800 peer-focus:text-sm peer-valid:text-sm"
              >
                Password
              </label>
              <div className="text-red-600">{errors.password}</div>
            </div>

            {/* Sign-up button */}
            <button
              type="submit"
              className={`btn w-60 text-white mx-auto bg-black ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading} // Disable button when loading
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          {/* Divider and social icons */}
          <div className="w-80 h-[2px] bg-gray-500"></div>
          <div className="flex space-x-4 relative bottom-2">
            <div className="w-fit px-3 flex gap-2 items-center justify-center h-12 border-2 border-black rounded cursor-pointer" onClick={handleGoogleSignup}>
              <FaGoogle className="text-black text-xl" />
              Sign in with Google
            </div>
            <div className="w-fit px-3 flex gap-2 items-center justify-center h-12 border-2 border-black rounded cursor-pointer">
              <FaFacebookF className="text-black text-xl" />
              Sign in with facebook
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
