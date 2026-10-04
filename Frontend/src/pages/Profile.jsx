import React, { useContext, useEffect, useState } from "react";
import { FaTicketAlt } from "react-icons/fa";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Authcontext";
import api from "../utils/axiosinstance";

const Profile = () => {
  const { user , loading} = useContext(AuthContext);
  const [bookings, setbookings] = useState([]);
  const [loadingg, setloadingg] = useState(true);
  const [removingid, setremovingid] = useState(null);
  const navigate = useNavigate()
  const statusStyles = {
    confirmed: "bg-green-50 text-green-700",
    pending: "bg-yellow-50 text-yellow-700",
    cancelled: "bg-red-50 text-red-600",
  };
  useEffect(() => {
    setloadingg(true);
    const fetchbookings = async () => {
      try {
        const res = await api.get("/bookings/my");
        setbookings(res.data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setloadingg(false);
      }
    };
    fetchbookings();
  }, []);
  const cancelbooking = async (bookingid) => {
    if(removingid) return;
    setremovingid(bookingid)
    try{
       await api.delete(`/bookings/${bookingid}`);
       setTimeout(() => {
      setbookings((prev) => prev.filter((b) => b._id !== bookingid));
      setremovingid(null);
    }, 300);
    }catch(err){
      console.error(err.message)
      setremovingid(null)
    }
  }
  if(loading) return <p>Loading...</p>
  if(!user) return <Navigate to='/login' />
  return (
    <div className="bg-[#f9f9f9] min-h-screen py-10 px-4">
    <div className="max-w-4xl mx-auto flex flex-col gap-8">

      {/* Welcome card */}
      <div className="bg-white rounded-3xl p-8 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-[#030507] uppercase">
          {user.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-[#030507]">
            Welcome, {user.name}!
          </h1>
          <p className="flex items-center gap-2 text-sm text-[#5b5d60] mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            User Dashboard
          </p>
        </div>
      </div>

      {/* Bookings */}
      <div className="flex flex-col gap-4">
        <h2 className="flex items-center gap-3 text-2xl font-extrabold text-[#030507]">
          <FaTicketAlt className="text-gray-700" />
          My Bookings requests
        </h2>

        {loadingg ? (
          <p className="text-center text-gray-500 py-10">Loading...</p>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl flex flex-col items-center gap-4 py-16">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
              <FaTicketAlt className="text-gray-300 text-3xl" />
            </div>
            <p className="text-gray-500 font-medium">
              You haven't booked any events yet.
            </p>
            <Link
              to="/"
              className="bg-[#101825] text-white px-6 py-3 rounded-xl font-bold"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className={`bg-white border border-gray-100 rounded-2xl p-3 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-all duration-300 ${
                removingid === booking._id
                  ? "opacity-0 scale-95 -translate-x-4"
                  : "opacity-100"
              }`}
            >
              <img
                src={booking.eventid.imageurl}
                alt={booking.eventid.title}
                className="w-full sm:w-[140px] h-[110px] object-cover rounded-xl bg-gray-100 shrink-0"
              />

              <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-[#030507] truncate">
                      {booking.eventid?.title}
                    </h3>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-lg capitalize ${
                        statusStyles[booking.status] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex gap-4 flex-wrap mt-2 text-sm text-[#5b5d60]">
                    <span>
                      {new Date(booking.eventid.date).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </span>
                    <span>{booking.eventid.location}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Booking ID: {booking._id}
                </p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                <p className="text-xl font-extrabold text-[#030507]">
                  ₹{booking.eventid.ticketprice}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/events/${booking.eventid._id}`)} className="bg-[#101825] text-white text-sm px-4 py-2 rounded-xl hover:bg-[#030507]">
                    View Ticket
                  </button>
                  {booking.status !== "cancelled" && (
                    <button onClick={() => cancelbooking(booking._id)} className="border border-gray-200 text-red-600 text-sm px-4 py-2 rounded-xl hover:bg-red-50">
                    {removingid === booking._id ? "Cancelling..." : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    </div>
  );
};

export default Profile;
