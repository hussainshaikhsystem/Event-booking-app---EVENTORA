import React from "react";
import { Link } from "react-router-dom";
import { FaTicketAlt } from "react-icons/fa";
const Footer = () => {
  return (
    <div className="flex flex-col justify-center items-center mb-6">
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
        <FaTicketAlt />
        Eventora
      </Link>
      <p className="text-center">
        The simplest , most dynamic way to manage , discover , and host world{" "}
        <br /> class events in your local city. lets make memories together
      </p>
       © {new Date().getFullYear()} Eventora Platform. All rights reserved.
    </div>
  );
};

export default Footer;
