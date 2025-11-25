import React from "react";
import { roomsDummyData } from "../assets/assets";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useNavigate } from "react-router-dom";

const FeatureDestination = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full items-center px-6 md:px-16 lg:px-24 xl:px-32 bg-slate-50 py-20">
      <Title
        title="Featured Destination"
        subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experience."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-20">
        {roomsDummyData.slice(0, 4).map((room, index) => (
          <HotelCard
            onClick={() => {
              navigate(`/rooms/${room._id}`), scrollTo(0, 0);
            }}
            key={room._id}
            room={room}
            index={index}
          />
        ))}
      </div>

      <button
        onClick={() => {
          navigate("/rooms");
          scrollTo(0, 0);
        }}
        className="btn my-16"
      >
        View All Destination
      </button>
    </div>
  );
};

export default FeatureDestination;
