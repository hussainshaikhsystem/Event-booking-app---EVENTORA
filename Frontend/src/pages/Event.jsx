import React, { useEffect, useState } from "react";
import api from "../utils/axiosinstance";
import { FaRegClock, FaTicketAlt, FaShieldAlt } from "react-icons/fa";
import EventCard from "../components/EventCard.jsx";
const features = [
  {
    icon: <FaRegClock />,
    title: "Fast Booking",
    desc: "Secure your tickets instantly with our fast streamlined booking infrastructure built for speed.",
  },
  {
    icon: <FaTicketAlt />,
    title: "Seamless Access",
    desc: "Download tickets instantly or manage them right from your personal dashboard with ease.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Secure Platform",
    desc: "All transactions and registrations are backed by cutting-edge security and 2FA OTP tech.",
  },
];
const Event = () => {
  const [events, setevents] = useState([]);
  const [loading, setloading] = useState(false);
  const [search , setsearch] = useState("")
  useEffect(() => {
    setloading(true);
    const fetchevents = async () => {
      try {
        const res = await api.get("/events");
        console.log(res.data);
        setevents(Array.isArray(res.data) ? res.data : res.data.events || []);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
      } finally {
        setloading(false);
      }
    };
    fetchevents();
  }, []);
  const filteredevents = events.filter((event) => event.title.toLowerCase().includes(search.toLowerCase( )));

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10">
      <div className="my-8 relative w-full max-w-6xl min-h-[80vh] overflow-hidden rounded-3xl bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop')]">
        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* content */}
        <div className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center gap-8 px-6 py-16 text-center text-white">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider backdrop-blur">
            Welcome to Eventora
          </span>

          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight md:text-7xl">
            Find Your Next <br />
            <span className="bg-linear-to-b from-white to-gray-500 bg-clip-text text-transparent">
              Unforgettable
            </span>
            <br />
            Experience
          </h1>

          <p className="max-w-2xl max-w-2xl text-sm md:text-lg font-light text-gray-200">
            Discover the best tech conferences, late-night music festivals, and
            hands-on workshops happening directly in your area. Secure your spot
            today.
          </p>

          <input
          onChange={(e) => setsearch(e.target.value)}
            type="search"
            placeholder="Search Event by title"
            className="h-14 w-[80%] md:w-full h-[50px] max-w-2xl rounded-full bg-white px-6 text-black outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>
      {/* // features */}
      

      {/* // events  */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16">
        <h2 className="mb-6 text-3xl font-bold text-[#101825]">
          Upcoming Events
        </h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {filteredevents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Event;
