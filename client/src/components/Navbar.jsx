import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, toggleHotelReg } from '../app/feature/auth/authSlice';
import { assets } from '../assets/assets';
import { toast } from 'react-hot-toast';

const BookIcon = () => (
  <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
    />
  </svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux state theke user info, authentication status ebong role nawa
  const { user, isAuthenticated, isHotelOwner, hotelReg } = useSelector((state) => state.auth);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Hotels', path: '/rooms' },
    { name: 'Experience', path: '/' },
    { name: 'About', path: '/' },
  ];

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      setShowDropdown(false);
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === '/') {
        setIsScrolled(window.scrollY > 10);
      } else {
        setIsScrolled(true);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? 'bg-white/90 text-gray-700 backdrop-blur-lg py-3 md:py-4 shadow-sm'
          : 'py-4 md:py-6 text-white'
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo}
          alt="logo"
          className={`h-9 w-13 transition-all ${isScrolled ? 'invert opacity-80' : ''}`}
        />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => (
          <Link key={i} to={link.path} className="group flex flex-col gap-0.5 font-medium">
            {link.name}
            <div
              className={`${
                isScrolled ? 'bg-gray-700' : 'bg-white'
              } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
            />
          </Link>
        ))}
        {/* State-e thaka isHotelOwner use kora hoyeche */}
        {isAuthenticated && (
          <button
            onClick={() => (isHotelOwner ? navigate('/owner') : dispatch(toggleHotelReg()))}
            className={`border px-4 py-1 text-sm font-medium rounded-full cursor-pointer transition-all hover:bg-black hover:text-white ${
              isScrolled ? 'border-black text-black' : 'border-white text-white'
            }`}
          >
            {isHotelOwner ? 'Dashboard' : 'List Your Hotel'}
          </button>
        )}
      </div>

      {/* Desktop Right */}
      <div className="flex items-center justify-end w-full max-md:mx-5 md:w-fit gap-4">
        <img
          src={assets.searchIcon}
          alt="search"
          className={`${
            isScrolled ? 'invert' : ''
          } h-7 cursor-pointer hover:scale-110 transition-transform`}
        />

        {isAuthenticated ? (
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer p-1"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={user?.image || assets.profile_img}
                alt="profile"
                className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm hover:border-gray-300 transition-all"
              />
            </div>

            {/* Profile Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-3 w-56 bg-white shadow-2xl rounded-2xl py-3 text-gray-800 border border-gray-100 animate-in fade-in zoom-in duration-200">
                <div className="px-4 py-2 border-b border-gray-50 mb-2">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    My Account
                  </p>
                  <p className="text-sm font-semibold truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    navigate('/my-bookings');
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <BookIcon /> My Bookings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-500 flex items-center gap-3 transition-colors mt-2"
                >
                  <span className="text-lg">➔</span> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/auth')}
            className="bg-black text-white px-8 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-lg active:scale-95"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-3">
        <img
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          src={assets.menuIcon}
          className={`${isScrolled ? 'invert' : ''} h-6 cursor-pointer`}
          alt="menu"
        />
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-lg flex flex-col md:hidden items-center justify-center gap-6 font-semibold text-gray-800 transition-all duration-500 z-[100] ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button className="absolute top-6 right-6 p-2" onClick={() => setIsMenuOpen(false)}>
          <img src={assets.closeIcon} alt="close" className="h-6" />
        </button>

        {navLinks.map((link, i) => (
          <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)}>
            {link.name}
          </Link>
        ))}

        {isAuthenticated ? (
          <div className="flex flex-col items-center gap-4 w-full px-10">
            <button
              className="px-5 py-2 bg-black rounded-full text-white text-sm"
              onClick={() => {
                setIsMenuOpen(false);
                isHotelOwner ? navigate('/owner') : dispatch(toggleHotelReg());
              }}
            >
              {isHotelOwner ? 'Dashboard' : 'List Your Hotel'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              navigate('/auth');
              setIsMenuOpen(false);
            }}
            className="bg-black text-white px-10 py-3 rounded-full mt-4 shadow-xl"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
