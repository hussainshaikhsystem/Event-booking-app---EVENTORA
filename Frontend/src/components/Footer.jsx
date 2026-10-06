import React from "react";
import { Link } from "react-router-dom";
import { FaTicketAlt } from "react-icons/fa";
const Footer = () => {
  return (
    <div className="flex flex-col justify-center items-center mb-6">
      <Link to="/" className="flex items-center gap-2 text-sm md:text-lg font-bold">
        <FaTicketAlt />
        Eventora
      </Link>
      <p className="text-center text-xs md:text-sm">
        The simplest , most dynamic way to manage , discover , and host world{" "}
        <br /> class events in your local city. lets make memories together
      </p>
      <div className="text-sm md:text-lg">© {new Date().getFullYear()} Eventora Platform. All rights reserved.</div> 
    </div>
  );
};

export default Footer;
