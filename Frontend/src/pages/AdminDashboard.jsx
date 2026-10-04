import React, { useEffect, useState } from "react";
import api from "../utils/axiosinstance";

const AdminDashboard = () => {
  const [events, setevents] = useState([]);
  const [bookings, setbookings] = useState([]);
  const [loading, setloading] = useState(true);
  const [busy, setbusy] = useState(null);
  const [createitems, setcreateitems] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    totalSeats: "",
    ticketPrice: "",
    image: "",
  });
  const [removingid, setremovingid] = useState(null);
  const [showcreate, setshowcreate] = useState(false);
  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchallbookings(), fetchallevents()]);
      setloading(false);
    };
    init();
  }, []);

  const fetchallevents = async () => {
    try {
      const res = await api.get("/events");
      setevents(res.data);
    } catch (err) {
      console.error(
        err.response?.data?.message || err.response?.data?.error || err.message,
      );
    }
  };
  const fetchallbookings = async () => {
    try {
      const res = await api.get("/bookings/my");
      setbookings(res.data);
    } catch (err) {
      console.error(
        err.response?.data?.message || err.response?.data?.error || err.message,
      );
    }
  };
  const handledelete = async (eventid) => {
    try {
      await api.delete(`/events/${eventid}`);
      setevents((prev) => prev.filter((e) => e._id !== eventid));
    } catch (err) {
      console.error(
        err.response?.data?.message || err.response?.data?.error || err.message,
      );
    }
  };
  const handleconfirmbooking = async (bookingid, paymentstatus) => {
    const booking = bookings.find((b) => b._id === bookingid);
    if (booking?.status === "confirmed") {
      alert("booking is already confirmed");
      return;
    }
    setbusy(bookingid);
    try {
      await api.put(`/bookings/${bookingid}/confirm`, { paymentstatus });
      await Promise.all([fetchallbookings(), fetchallevents()]);
    } catch (err) {
      const msg =
        err.response?.data?.message || err.response?.data.error || err.message;
      console.error(msg);
      alert(msg);
    } finally {
      setbusy(null);
    }
  };
  const cancelbooking = async (bookingid) => {
    setbusy(bookingid);
    try {
      await api.delete(`/bookings/${bookingid}`);
      setremovingid(bookingid);
      setTimeout(() => {
        setbookings((prev) => prev.filter((b) => b._id !== bookingid));
        setremovingid(null);
        fetchallevents();
      }, 300);
    } catch (err) {
      console.error(
        err.response?.data?.message || err.response?.data?.error || err.message,
      );
    } finally {
      setbusy(null);
    }
  };
  const handlecreateevent = async (e) => {
    e.preventDefault();
    try {
      await api.post("/events", createitems);
      setshowcreate(false);
      setcreateitems({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "",
        totalseats: "",
        ticketprice: "",
        image: "",
      });
      fetchallevents();
    } catch (err) {
      console.error(err, "unable to create event");
    }
  };
  const pending = bookings.filter((b) => b.status === "pending").length;
  const paid = bookings.filter((b) => b.paymentstatus === "paid");
  const revenue = paid.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="min-h-screen bg-[#f9f9f9] w-full flex flex-col gap-6 p-10 items-center">
      <div className="text-white  bg-black flex justify-between items-center w-[90%] rounded-2xl h-40 p-6">
        <div className="flex flex-col gap-3">
          <h1 className="font-extrabold text-4xl">Admin DashBoard</h1>
          <p>Manage events and manually confirm bookings</p>
        </div>
        <button
          onClick={() => setshowcreate(!showcreate)}
          className="bg-white h-15 text-black rounded-2xl flex justify-center items-center w-60 font-bold"
        >
          {showcreate ? "Cancel Creation" : "+ Create New Event"}
        </button>
      </div>
      <div className="boxes flex gap-3 justify-between w-[90%]">
        <div className="box bg-white  w-[30%] flex justify-between flex-row rounded-2xl p-4">
          <div className="">
            <h2 className="font-bold  text-[#88838a]">TOTAL REVENUE</h2>
            <h1 className="font-extrabold text-3xl text-[#089942]">
              ₹{revenue}
            </h1>
          </div>
          <div>
            <h1 className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-xl font-bold">
              ₹
            </h1>
          </div>
        </div>
        <div className="box bg-white w-[30%] flex justify-between flex-row  rounded-2xl p-4">
          <div>
            <h2 className="font-bold  text-[#88838a]">PAID CLIENTS</h2>
            <h1 className="font-extrabold text-3xl text-[#2d60d0]">
              {paid.length}
            </h1>
          </div>
          <div>
            <h1 className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-xl font-bold">
              👤
            </h1>
          </div>
        </div>
        <div className="box bg-white w-[30%] flex justify-between flex-row   rounded-2xl p-4">
          <div>
            <h2 className="font-bold  text-[#88838a]">PENDING REQUESTS</h2>
            <h1 className="font-extrabold text-3xl text-[#c78611]">
              {pending}
            </h1>
          </div>
          <div>
            <h1 className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl font-bold">
              ⏳
            </h1>
          </div>
        </div>
      </div>

      {showcreate && (
        <div className="w-[90%] flex gap-8 flex-col  min-h-auto p-10">
          <h1 className="font-extrabold text-3xl">Create New Event</h1>

          <form
            className="grid grid-cols-2 gap-6"
            onSubmit={handlecreateevent}
            action=""
          >
            <input
              onChange={(e) =>
                setcreateitems({ ...createitems, title: e.target.value })
              }
              className="h-15 pl-6"
              type="text"
              placeholder="Event Title"
            />
            <input
              onChange={(e) =>
                setcreateitems({ ...createitems, category: e.target.value })
              }
              className="h-15 pl-6"
              type="text"
              placeholder="Category (e.g; Tech, Music)"
            />
            <input
              onChange={(e) =>
                setcreateitems({ ...createitems, date: e.target.value })
              }
              className="h-15 pl-6"
              type="date"
              placeholder="dd-mm-yyyy"
            />
            <input
              onChange={(e) =>
                setcreateitems({ ...createitems, location: e.target.value })
              }
              className="h-15 pl-6"
              type="text"
              placeholder="Location"
            />
            <input
              onChange={(e) =>
                setcreateitems({ ...createitems, totalseats: e.target.value })
              }
              className="h-15 pl-6"
              type="number"
              placeholder="Total Seats"
            />
            <input
              onChange={(e) =>
                setcreateitems({ ...createitems, ticketprice: e.target.value })
              }
              className="h-15 pl-6"
              type="number"
              placeholder="Ticket Price (0 for free)"
            />
            <input
              type="text"
              onChange={(e) => setcreateitems({...createitems, imageurl: e.target.value})}
              className="col-span-2 h-15 pl-6 border-1 bordr-black pt-4"
            />
            <textarea
            onChange={(e) => setcreateitems({...createitems, description: e.target.value})}
              className="col-span-2 h-40 p-10 border-1 border-black"
              name=""
              id=""
              placeholder="Event Description"
            ></textarea>
            <button
              className="bg-[#101825] text-white font-bold flex justify-center items-center col-span-2 h-15 rounded-2xl"
              type="submit"
            >
              {" "}
              Publish Event
            </button>
          </form>
        </div>
      )}

      <div className="w-[90%] flex flex-row  ">
        <div className="events w-[50%]  p-5 flex flex-col ">
          <div className="flex gap-3">
            <span className="flex font-bold text-xl items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm">
              {events.length}
            </span>
            <h1 className="text-3xl font-bold">All Events</h1>
          </div>
          <div className="rounded-2xl overflow-hidden m-4">
            {loading ? (
              <div>Loading...</div>
            ) : (
              events.map((event) => (
                <div key={event._id} className="w-full bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="font-bold text-xl">{event.title}</h1>
                      <div className="flex gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          {new Date(event.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${event.availableseats > 0 ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                          {event.availableseats} / {event.totalseats} seats
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handledelete(event._id);
                      }}
                      className="border border-gray-200 text-red-600 text-sm px-4 py-2 rounded-xl hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="h-px w-full bg-gray-300 mt-3"></div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bookings p-5 w-[50%] ">
          <div className="flex gap-3">
            <span className="flex font-bold text-xl items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm">
              {bookings.length}
            </span>
            <h1 className="text-3xl font-extrabold">Booking Requests</h1>
          </div>

          <div className="rounded-2xl bg-white overflow-hidden m-4">
            {loading ? (
              <div>Loading....</div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking._id}
                  className={`flex flex-col p-4 gap-4 w-full transition-all duration-300 ease-in-out ${
                    removingid === booking._id
                      ? "opacity-0 scale-95 -translate-x-4"
                      : "opacity-100"
                  }`}
                >
                  <div className="flex justify-between">
                    <h1 className="font-extrabold text-2xl">
                      {booking.eventid?.title}
                    </h1>
                    <div className="flex gap-2 flex-col">
                      <p className="bg-[#fff7bd] text-[#916a27] text-xs   capitalize text-center md:uppercase px-3 py-1  rounded-xl">
                        {booking.status}
                      </p>
                      <p className="bg-[#e7e6eb]   text-[#2d2c34] text-xs capitalize md:uppercase px-3 py-1 rounded-xl">
                        {booking.paymentstatus}
                      </p>
                    </div>
                  </div>

                  <div className="box bg-[#f9f9f9] flex flex-col  p-3">
                    <div className="flex ">
                      <p className="text-[#74737a] w-25">USER : </p>
                      <p>{booking.userid?.name}</p>
                      <span> ({booking.userid?.email})</span>
                    </div>
                    <div className="flex ">
                      <p className="text-[#74737a] w-25">AMOUNT : </p>
                      <p className="text-[#4a9e7b]">
                        {" "}
                        ₹{booking.eventid?.ticketprice}
                      </p>
                    </div>
                    <div className="flex ">
                      <p className="text-[#74737a] w-25">DATE : </p>
                      <span>
                        {new Date(booking.createdAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex ">
                      <p className="text-[#74737a] w-25">SEATS : </p>
                      <p>
                        <span className="text-[#51af80]">
                          {booking.eventid?.availableseats}
                        </span>{" "}
                        /{booking.eventid?.totalseats}
                      </p>
                    </div>
                  </div>

                  <div className="buttons flex justify-between w-full">
                    <button
                      disabled={
                        busy === booking._id || booking.status === "cancelled"
                      }
                      onClick={() => handleconfirmbooking(booking._id, "paid")}
                      className="disabled:opacity-50 disabled:cursor-not-allowed w-auto p-3 rounded-2xl transition-all bg-[#f1faf5] text-[#5d9478]"
                    >
                      {busy === booking._id ? "Saving..." : "✓ Approve As paid"}
                    </button>
                    <button
                      disabled={
                        busy === booking._id || booking.status === "cancelled"
                      }
                      onClick={() =>
                        handleconfirmbooking(booking._id, "non-paid")
                      }
                      className="disabled:opacity-50 disabled:cursor-not-allowed w-auto p-3 rounded-2xl transition-all bg-[#f9f9fb] text-[#464750]"
                    >
                      ✓ Approve Undecided
                    </button>
                    <button
                      disabled={busy === booking._id}
                      onClick={() => cancelbooking(booking._id)}
                      className="w-auto p-3 transition-all rounded-2xl bg-[#f9f3f2] text-[#bd3844]"
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
