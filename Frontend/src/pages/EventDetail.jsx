import React, { useEffect, useState } from "react";
import api from "../utils/axiosinstance";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChair,
  FaMoneyBillWave,
} from "react-icons/fa";
const EventDetail = () => {
  const [event, setevent] = useState(null);
  const [loading, setloading] = useState(true);
  const [comingotp, setcomingotp] = useState(false);
  const [confirm, setconfirm] = useState(false);
  const [submitting, setsubmitting] = useState(false);
  const [error, seterror] = useState("");
  const [otp, setotp] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetcheventbyid = async () => {
      try {
        const event = await api.post(`/events/${id}`);
        setevent(event.data);
      } catch (err) {
        seterror(err.response?.data?.error || "Something went wrong");
        console.log(err.response?.status, err.response?.data);
      } finally {
        setloading(false);
      }
    };
    fetcheventbyid();
  }, [id]);
  const sendbookingotp = async () => {
    setsubmitting(true);
    seterror("");
    try {
      await api.post("/bookings/send-otp");
      setcomingotp(true);
    } catch (err) {
      seterror(err.response?.data?.error || "Something went wrong");
      console.log(err.response?.status, err.response?.data);
    } finally {
      setsubmitting(false);
    }
  };
  const otpverification = async (e) => {
    e.preventDefault();
    setsubmitting(true);
    seterror("");
    try {
      await api.post("/bookings", { eventid: id, otp });
      setconfirm(true);
    } catch (err) {
      seterror(err.response?.data?.error || "Something Went Wrong");
    } finally {
      setsubmitting(false);
    }
  };
  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;
  return (
    <div className="flex justify-center items-center min-h-screen ">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col border-1  bg-[#f9f9f9]  p-10 rounded-2xl m-5 h-auto">
          <img
            className="rounded-2xl h-[40vh] object-cover"
            src={event.imageurl}
            alt=""
          />
          <div className="flex ">
            <div className=" flex flex-col gap-3 p-5 w-[60%]  ">
              <h2 className="h-[50px] bg-[#e6e6ea] w-[150px]  rounded-4xl flex justify-center items-center capitalize md:uppercase">
                {event.category}
              </h2>
              <h1 className="font-extrabold text-5xl ">{event.title}</h1>
              <h2>{event.description}</h2>
            </div>
            <div className=" bg-white gap-2 rounded-2xl w-[40%] flex m-4 p-4 flex-col self-start">
              <h2 className="font-bold text-2xl">Booking Details</h2>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e6e6ea]">
                  <FaMoneyBillWave />
                </div>
                <div>
                  <h2 className="text-xs uppercase text-gray-500">
                    Ticket Price
                  </h2>
                  <h2 className="font-bold">₹{event.ticketprice}</h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e6e6ea]">
                  <FaChair />
                </div>
                <div>
                  <h2 className="text-xs uppercase text-gray-500">
                    Availability
                  </h2>
                  <h2 className="font-bold">
                    {event.availableseats} / {event.totalseats}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e6e6ea]">
                  <FaCalendarAlt />
                </div>
                <div>
                  <h2 className="text-xs uppercase text-gray-500">Date</h2>
                  <h2 className="font-bold">
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e6e6ea]">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h2 className="text-xs uppercase text-gray-500">Location</h2>
                  <h2 className="font-bold">{event.location}</h2>
                </div>
              </div>

              {comingotp ? (
                <>
                  {confirm ? (
                    <>
                      <h2 className="text-xl text-[#6f757e] text-center bg-[#cfd3db] h-10 rounded-2xl flex justify-center items-center">Request sent</h2>
                      <p className="text-green-400 mt-2 text-center">
                        Booking Requested! Awaiting Admin Confirmation
                      </p>
                    </>
                  ) : (
                    <>
                      <form
                        className="flex flex-col gap-4"
                        onSubmit={(e) => otpverification(e)}
                        action=""
                      >
                        <p>Enter OTP to Confirm</p>
                        <input
                          className="h-17 font-extrabold rounded-2xl  text-center"
                          value={otp}
                          onChange={(e) => setotp(e.target.value)}
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="6 - Digit Code"
                        />
                        <button
                          disabled={submitting}
                          className="mt-2 block text-center w-full rounded-xl bg-[#111827] py-3 font-bold text-white"
                        >
                          {submitting
                            ? "Processing..."
                            : "Verify OTP & Confirm"}
                        </button>
                      </form>
                      <p className="text-green-400 mt-2 text-center">
                        OTP sent to your email. please verify for booking event
                      </p>
                      {error && (
                        <p className="text-red-500 font-bold text-2xl">
                          {error}
                        </p>
                      )}
                    </>
                  )}
                </>
              ) : (
                <button
                  disabled={submitting}
                  className="mt-2 block text-center w-full rounded-xl bg-[#111827] py-3 font-bold text-white"
                  onClick={sendbookingotp}
                >
                  {submitting ? "Processing..." : "Confirm Registration"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
