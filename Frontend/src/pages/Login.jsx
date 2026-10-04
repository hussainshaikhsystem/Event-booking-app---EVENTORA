import React, { useContext, useEffect } from "react";
import { useState } from "react";
import api from "../utils/axiosinstance.js";
import { AuthContext } from "../context/Authcontext.jsx";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();
  const loginuser = async (e) => {
    setloading(true);
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
      navigate('/')
    } catch (err) {
      console.error(err.response?.data?.message || err.response?.data?.error || err.message);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="bg-[#f9f9f9] flex justify-center items-center min-h-screen">
      <div className="bg-white flex flex-col gap-4  w-[30vw] h-[70vh] rounded-3xl p-10  ">
        <div>
          <h1 className="text-center  text-black h-15 flex items-center justify-center w-auto rounded-2xl mt-3 text-3xl font-extrabold bg-">
            Login
          </h1>
        </div>
        <form onSubmit={loginuser} action="">
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
          <button className="bg-[#030507] font-bold text-2xl  mt-2 block text-center w-[96%] text-white  h-17 rounded-2xl mx-2">
           {loading ? 'signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
