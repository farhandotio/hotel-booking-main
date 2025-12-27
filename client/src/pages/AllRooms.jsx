import React, { useEffect, useState } from 'react';
import { assets, facilityIcons } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRooms } from '../app/feature/roomSlice.js';

const AllRooms = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rooms, loading } = useSelector((state) => state.room);

  // States for Filtering and Sorting
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortOption, setSortOption] = useState('Newest First');
  const [openFilters, setOpenFilters] = useState(false);

  useEffect(() => {
    dispatch(getAllRooms());
  }, [dispatch]);
  
  useEffect(() => {
    let tempRooms = [...rooms];

    // 1. Room Type Filter
    if (selectedTypes.length > 0) {
      tempRooms = tempRooms.filter((room) => selectedTypes.includes(room.roomType));
    }

    // 2. Sorting Logic
    if (sortOption === 'Price Low to Hight') {
      tempRooms.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortOption === 'Price Hight to Low') {
      tempRooms.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortOption === 'Newest First') {
      tempRooms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredRooms(tempRooms);
  }, [rooms, selectedTypes, sortOption]);

  const toggleType = (checked, label) => {
    if (checked) {
      setSelectedTypes((prev) => [...prev, label]);
    } else {
      setSelectedTypes((prev) => prev.filter((item) => item !== label));
    }
  };

  const roomTypes = ['Single Bed', 'Double Bed', 'Luxury Room', 'Family Suite'];
  const sortOptions = ['Price Low to Hight', 'Price Hight to Low', 'Newest First'];

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 gap-10">
      {/* Left Side: Room Listings */}
      <div className="flex-1">
        <div className="flex flex-col items-start text-left mb-8">
          <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2">
            Experience luxury and comfort in our carefully curated rooms.
          </p>
        </div>

        {loading ? (
          <p>Loading rooms...</p>
        ) : filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <div
              key={room._id}
              className="flex flex-col md:flex-row items-start py-8 gap-6 border-b border-gray-200 last:border-0"
            >
              <img
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  window.scrollTo(0, 0);
                }}
                src={room.images[0]}
                alt="room"
                className="w-full md:w-72 h-48 rounded-xl object-cover cursor-pointer hover:opacity-90 transition"
              />
              <div className="flex-1 flex flex-col gap-2">
                <p className="text-blue-600 text-sm font-medium">{room.hotel?.city}</p>
                <h2
                  onClick={() => navigate(`/rooms/${room._id}`)}
                  className="text-2xl font-playfair cursor-pointer hover:text-blue-800"
                >
                  {room.roomType} - {room.hotel?.name}
                </h2>
                <div className="flex items-center gap-2">
                  <StarRating />
                  <span className="text-xs text-gray-400">(200+ reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <img src={assets.locationIcon} alt="" className="w-3" />
                  <span>{room.hotel?.address}</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {room.amenities.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200"
                    >
                      <img src={facilityIcons[item]} alt="" className="w-4 h-4 opacity-70" />
                      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-600">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-xl font-semibold text-gray-800 mt-2">
                  ${room.pricePerNight}{' '}
                  <span className="text-sm font-normal text-gray-500">/night</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="mt-10 text-gray-400">No rooms found matching your criteria.</p>
        )}
      </div>

      {/* Right Side: Filters */}
      <div className="w-full lg:w-80 border border-gray-300 rounded-xl overflow-hidden sticky top-32">
        <div className="bg-gray-50 px-5 py-4 border-b border-gray-300 flex justify-between items-center">
          <p className="font-bold text-gray-800 tracking-wide">FILTERS</p>
          <button
            onClick={() => {
              setSelectedTypes([]);
              setSortOption('Newest First');
            }}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            RESET
          </button>
        </div>

        <div className="p-5 space-y-8">
          {/* Room Types */}
          <div>
            <p className="font-semibold text-gray-900 mb-3">Room Type</p>
            {roomTypes.map((type, index) => (
              <label
                key={index}
                className="flex items-center gap-3 cursor-pointer mb-2 text-sm text-gray-600 hover:text-black"
              >
                <input
                  type="checkbox"
                  className="accent-blue-600"
                  checked={selectedTypes.includes(type)}
                  onChange={(e) => toggleType(e.target.checked, type)}
                />
                {type}
              </label>
            ))}
          </div>

          {/* Sorting */}
          <div>
            <p className="font-semibold text-gray-900 mb-3">Sort By</p>
            {sortOptions.map((option, index) => (
              <label
                key={index}
                className="flex items-center gap-3 cursor-pointer mb-2 text-sm text-gray-600 hover:text-black"
              >
                <input
                  type="radio"
                  name="sort"
                  className="accent-blue-600"
                  checked={sortOption === option}
                  onChange={() => setSortOption(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
