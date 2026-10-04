import React, { useContext, useEffect } from "react";
import { useState } from "react";
import api from "../utils/axiosinstance.js";
import { AuthContext } from '../context/Authcontext.jsx'
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [step, setstep] = useState(1);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading , setloading] = useState(false);
  const {login} = useContext(AuthContext)
  const [otp , setotp] = useState("");
  const navigate = useNavigate()
  const registeruser = async (e) => {
    setloading(true);
    e.preventDefault()
    try{
       await api.post("/auth/register", { name, email, password });
    setstep(2)
    }catch(err){
     console.error(err.response?.data?.message || err.response?.data?.error || err.message);
    }finally{
      setloading(false)
    }
   
  };
  const otpverification = async (e) => {
    setloading(true);
    e.preventDefault();
    try {
      const res = await api.post('/auth/verify-otp', {email , otp});
      login(res.data);
      navigate('/')
    }catch(err){
       console.error(err.response?.data?.message || err.response?.data?.error || err.message);
    }finally {
      setloading(false)
    }
  }
  return (
    <div className="bg-[#f9f9f9] flex justify-center items-center min-h-screen">
      <div className="bg-white flex flex-col gap-4  w-[30vw] h-[70vh] rounded-3xl p-10  ">
        <div>
          <h1 className="font-extrabold text-3xl text[#030507] text-center">
            Create An Account
          </h1>
          <p className="text-center">Join Eventora today</p>
          <h1 className="text-center bg-[#101825] text-white h-15 flex items-center justify-center w-auto rounded-2xl mt-3 text-3xl font-extrabold bg-">{step === 1 ? "Register" : "verify otp" }</h1>
        </div>
        {step === 1 ? (  <form onSubmit={registeruser} action="">
          <div className=" p-2">
            <h2 className="text-[#5b5d60]">Full Name</h2>
            <input
              onChange={(e) => setname(e.target.value)}
              className="border-1 mt-1 w-[100%] h-[60px] rounded-xl "
              type="text"
            />
          </div>
          <div className=" p-2">
            <h2 className="text-[#5b5d60]">Email Address</h2>
            <input
              onChange={(e) => setemail(e.target.value)}
              className="border-1 mt-1 w-[100%] h-[60px] rounded-xl "
              type="email"
            />
          </div>
          <div className=" p-2">
            <h2 className="text-[#5b5d60]">Password</h2>
            <input
              onChange={(e) => setpassword(e.target.value)}
              className="border-1 mt-1 w-[100%] h-[60px] rounded-xl "
              type="password"
            />
          </div>
          <button className="bg-[#030507] mt-2 block text-center w-[96%] text-white  h-17 rounded-2xl mx-2">
            Sign Up
          </button>
          <p className="text-center mt-5">
            Already have an account?{" "}
            <span className="font-bold mt-2">Sign in</span>
          </p>
        </form>): (
          <form onSubmit={otpverification} action="">
        
          <div className=" p-2">
            <h2 className="text-[#5b5d60]">Email Address</h2>
            <input
              onChange={(e) => setemail(e.target.value)}
              className="border-1 mt-1 w-[100%] h-[60px] rounded-xl "
              type="email"
            />
          </div>
          <div className=" p-2">
            <h2 className="text-[#5b5d60]">Otp</h2>
            <input
              onChange={(e) => setotp(e.target.value)}
              className="border-1 mt-1 w-[100%] h-[60px] rounded-xl "
              type="password"
            />
          </div>
          <button className="bg-[#030507] mt-2 block text-center w-[96%] text-white  h-17 rounded-2xl mx-2">
            Verify
          </button>
          <p className="text-center mt-5">
            Already have an account?{" "}
            <span className="font-bold mt-2">Sign in</span>
          </p>
        </form>
        )}
      
      </div>
    </div>
  );
};

export default Register;
