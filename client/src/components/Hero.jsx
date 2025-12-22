import React from 'react';
import { assets, cities } from '../assets/assets';
import { motion } from 'framer-motion';
import {Search} from "lucide-react"

const Hero = () => {
  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: 'easeOut' },
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <div className="relative w-full min-h-screen flex items-center px-6 md:px-16 lg:px-24 xl:px-32 pt-25 max-md:pb-15 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 -z-20">
        <img
          src="/src/assets/heroImage.jpg"
          alt="Hero"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="flex flex-col items-start text-white max-w-4xl"
      >
        <motion.p
          variants={fadeInUp}
          className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs md:text-sm font-medium tracking-wider uppercase mb-6"
        >
          ✨ The Ultimate Hotel Experience
        </motion.p>

        <motion.h1
          variants={fadeInUp}
          className="font-playfair text-4xl md:text-7xl font-bold leading-tight md:leading-[1.1] mb-6"
        >
          Discover Your <span className="text-gray-300 italic">Perfect</span> <br />
          Gateway Destination
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="max-w-lg text-gray-200 text-sm md:text-lg mb-10 leading-relaxed opacity-90"
        >
          Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts.
          Start your journey today.
        </motion.p>

        {/* --- UPGRADED SEARCH FORM --- */}
        <motion.form
          variants={fadeInUp}
          className="w-full bg-white/95 backdrop-blur-2xl text-black rounded-2xl shadow-2xl p-2 md:p-3 flex flex-col md:flex-row items-stretch gap-2"
        >
          {/* Destination */}
          <div className="flex-1 p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <img src={assets.calenderIcon} alt="location" className="h-4 opacity-70" />
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                Destination
              </label>
            </div>
            <input
              list="destinations"
              type="text"
              className="w-full bg-transparent font-semibold text-sm outline-none placeholder:font-normal"
              placeholder="Where are you going?"
              required
            />
            <datalist id="destinations">
              {cities.map((city, index) => (
                <option value={city} key={index} />
              ))}
            </datalist>
          </div>

          <div className="hidden md:block w-[1px] bg-gray-200 my-4"></div>

          {/* Check In */}
          <div className="flex-1 p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <img src={assets.calenderIcon} alt="checkin" className="h-4 opacity-70" />
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                Check In
              </label>
            </div>
            <input
              type="date"
              className="w-full bg-transparent font-semibold text-sm outline-none cursor-pointer"
            />
          </div>

          <div className="hidden md:block w-[1px] bg-gray-200 my-4"></div>

          {/* Check Out */}
          <div className="flex-1 p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <img src={assets.calenderIcon} alt="checkout" className="h-4 opacity-70" />
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                Check Out
              </label>
            </div>
            <input
              type="date"
              className="w-full bg-transparent font-semibold text-sm outline-none cursor-pointer"
            />
          </div>

          <div className="hidden md:block w-[1px] bg-gray-200 my-4"></div>

          {/* Guests */}
          <div className="p-3 hover:bg-gray-50 rounded-xl transition-colors min-w-[100px]">
            <div className="flex items-center gap-2 mb-1">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                Guests
              </label>
            </div>
            <input
              min={1}
              max={10}
              type="number"
              className="w-full bg-transparent font-semibold text-sm outline-none"
              placeholder="1"
            />
          </div>

          {/* Search Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-black text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-black/95 transition-all shadow-lg cursor-pointer"
          >
            <Search size={20} />
            <span>Search</span>
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Hero;
