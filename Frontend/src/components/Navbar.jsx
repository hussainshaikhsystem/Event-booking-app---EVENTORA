import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTicketAlt } from "react-icons/fa";
import { AuthContext } from "../context/Authcontext";
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handlelogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <nav className="bg-[#101825] text-white shadow-md ">
      <div className="max-w-6xl mx-auto px-3 md:px-6 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex  items-center gap-2 text-sm md:text-2xl font-bold">
          <FaTicketAlt />
          Eventora
        </Link>

        <ul className="flex items-center gap-3 md:gap-6 text-sm md:text-base whitespace-nowrap">
          <li>
            <Link to="/events" className="hover:text-gray-300 transition">
              Events
            </Link>
          </li>
          {user ? (
           <>
           <li>
        <Link to={user.role === "admin" ? "/admin" : "/profile"}>
          <span className="md:hidden">
            {user.role === "admin" ? "Admin" : "Profile"}
          </span>
          <span className="hidden md:inline">
            Hi {user.role === "admin" ? "Admin" : "User"} , {user.name}
          </span>
        </Link>
      </li>
      <li>
        <button onClick={handlelogout}>Logout</button>
      </li>
        </>
          ) : (
            <li>
              <Link to="/login" className="hover:text-gray-300 transition">
                Login
              </Link>
            </li>
          )}
          <li>
            <Link
              to="/register"
              className="bg-white text-[#101825] font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              Sign Up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
