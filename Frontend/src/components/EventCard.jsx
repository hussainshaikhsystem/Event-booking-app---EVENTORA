import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm flex flex-col transition hover:-translate-y-1 hover:shadow-lg">
      <img
        src={event.imageurl}
        alt={event.title}
        className="h-48 w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-[#101825]">
          {event.category}
        </span>
        <h3 className="line-clamp-2 min-h-[3.5rem] text-xl font-bold text-[#101825]">{event.title}</h3>
        <p className="line-clamp-2 min-h-[2.5rem] text-sm text-gray-500">{event.description}</p>
        <p className="text-sm text-gray-600">
          {new Date(event.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}{" "}
          · {event.location}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-bold text-[#101825]">
            {event.ticketprice === 0 ? "Free" : `₹${event.ticketprice}`}
          </span>
          <span className="text-xs text-gray-500">
            {event.availableseats} seats left
          </span>
        </div>
        <Link
          to={`/events/${event._id}`}
          className="mt-3 rounded-lg bg-[#101825] py-2 text-center text-white transition hover:bg-[#1c2a40]"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;