import React, { useState } from 'react';
import { assets, cities } from '../assets/assets';
import { toggleHotelReg } from '../app/feature/authSlice';
import { registerHotel } from '../app/feature/hotelSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const HotelReg = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.hotel);

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    city: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(registerHotel(formData));

    if (registerHotel.fulfilled.match(resultAction)) {
      toast.success('Congratulations! Your hotel is registered.', {
        duration: 4000,
        icon: '🏨',
      });
      // AuthSlice-er extraReducers automatic modal bondho kore dibe
    } else {
      toast.error(resultAction.payload || 'Registration failed. Try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Container Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative flex bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden"
      >
        {/* Left Side Image with Overlay */}
        <div className="relative w-1/2 hidden md:block">
          <img src={assets.regImage} alt="reg" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent flex flex-col justify-end p-10 text-white">
            <h2 className="text-3xl font-bold">Grow Your Business</h2>
            <p className="opacity-80 mt-2 font-light">
              Join our community and reach thousands of travelers worldwide.
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="flex flex-col w-full md:w-1/2 p-8 md:p-12 bg-slate-50/50">
          <motion.button
            whileHover={{ rotate: 90 }}
            onClick={() => dispatch(toggleHotelReg())}
            className="absolute top-5 right-5 p-2 bg-gray-100 hover:bg-red-50 rounded-full transition-colors group"
          >
            <img
              src={assets.closeIcon}
              alt="close"
              className="h-4 w-4 grayscale group-hover:grayscale-0"
            />
          </motion.button>

          <div className="text-left mb-6">
            <h1 className="text-3xl font-bold text-gray-800">New Registration</h1>
            <p className="text-gray-400 font-light mt-1">Please fill in the hotel details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Fields Animation */}
            {[
              { id: 'name', label: 'Hotel Name', type: 'text', placeholder: 'The Grand Plaza' },
              {
                id: 'contact',
                label: 'Contact Number',
                type: 'text',
                placeholder: '+880 1xxx xxxxxx',
              },
              { id: 'address', label: 'Full Address', type: 'text', placeholder: 'Street, Area' },
            ].map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <label
                  htmlFor={field.id}
                  className="block text-sm font-semibold text-gray-600 mb-1 ml-1"
                >
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  value={formData[field.id]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                  required
                />
              </motion.div>
            ))}

            {/* City Select */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="city" className="block text-sm font-semibold text-gray-600 mb-1 ml-1">
                City Location
              </label>
              <select
                id="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white appearance-none cursor-pointer"
                required
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full mt-6 py-4 rounded-xl font-bold text-white shadow-lg shadow-indigo-200 transition-all
                ${
                  loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                'Confirm Registration'
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default HotelReg;
