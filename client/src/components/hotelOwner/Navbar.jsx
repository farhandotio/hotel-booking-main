import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { useSelector } from 'react-redux';

const Navbar = () => {
  // Redux state theke user nawa
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="h-9  w-13 invert opacity-80" />
      </Link>
      <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full border border-transparent transition-all">
        <img
          src={user?.image || assets.profile_img}
          alt="profile"
          className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
        />
      </div>
    </div>
  );
};

export default Navbar;
