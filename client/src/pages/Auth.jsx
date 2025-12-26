import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, clearError } from '../app/feature/authSlice';
import { toast } from 'react-hot-toast'; // Toast properly handle korar jonno

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Lifecycle logic: Error & Success Handling
  useEffect(() => {
    // Jodi error thake, toast dekhabo ebong redux state theke clear kore dibo
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }

    // Jodi authentication success hoy, toast dekhaye home page a pathabo
    if (isAuthenticated) {
      toast.success(isLogin ? 'Welcome Back!' : 'Account Created Successfully!');
      navigate('/');
    }
  }, [isAuthenticated, error, navigate, dispatch, isLogin]);

  const onSubmit = async (data) => {
    try {
      if (isLogin) {
        const resultAction = await dispatch(
          loginUser({ email: data.email, password: data.password })
        );

        if (loginUser.fulfilled.match(resultAction)) {
          toast.success('Welcome Back!');
          navigate('/');
        }
      } else {
        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('image', data.image[0]);

        const resultAction = await dispatch(registerUser(formData));

        if (registerUser.fulfilled.match(resultAction)) {
          toast.success('Account Created Successfully!');
          navigate('/');
        }
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const toggleAuth = (status) => {
    setIsLogin(status);
    dispatch(clearError());
    reset();
  };

  return (
    <div className="fixed inset-0 z-[999] bg-white flex h-screen w-screen overflow-hidden">
      <div
        className={`flex w-full h-full transition-all duration-700 ease-in-out ${
          isLogin ? 'flex-row' : 'flex-row-reverse'
        }`}
      >
        {/* --- BRAND SIDE --- */}
        <motion.div
          layout
          className="hidden md:flex md:w-1/2 bg-black items-center justify-center p-12 relative overflow-hidden"
        >
          <div className="text-center z-10 text-white">
            <motion.div
              key={isLogin ? 'login-icon' : 'reg-icon'}
              initial={{ scale: 0.5, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-24 h-24 border-4 border-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
            >
              <span className="text-4xl font-bold">{isLogin ? 'H' : 'J'}</span>
            </motion.div>

            <motion.h1
              key={isLogin ? 'login-h' : 'reg-h'}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl font-bold mb-4 italic"
            >
              {isLogin ? 'Welcome Back to Luxury' : 'Start Your Journey With Us'}
            </motion.h1>
            <p className="text-gray-400 text-lg max-w-sm mx-auto">
              Access premium hotel booking features and manage your stays easily.
            </p>
          </div>

          <motion.div
            animate={{ scale: [1, 1.2, 1], x: isLogin ? [0, 50, 0] : [0, -50, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-gray-800 blur-3xl opacity-50"
          />
        </motion.div>

        {/* --- FORM SIDE --- */}
        <motion.div
          layout
          className="w-full md:w-1/2 h-full flex flex-col bg-white overflow-y-auto pt-20 pb-10 px-8 lg:px-20 relative"
        >
          {/* Close Icon */}
          <button
            onClick={() => navigate('/')}
            className={`absolute top-8 text-gray-500 hover:text-black flex items-center gap-2 transition-all cursor-pointer font-medium z-20 ${
              isLogin ? 'right-8' : 'left-8'
            }`}
          >
            {isLogin ? 'Close ✕' : '✕ Back'}
          </button>

          <motion.div
            initial={{ opacity: 0, x: isLogin ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-md w-full mx-auto"
          >
            <div className="flex gap-8 border-b border-gray-100 mb-8">
              <button
                disabled={loading}
                onClick={() => toggleAuth(true)}
                className={`pb-4 text-lg font-bold transition-all ${
                  isLogin ? 'border-b-2 border-black text-black' : 'text-gray-300'
                }`}
              >
                Sign In
              </button>
              <button
                disabled={loading}
                onClick={() => toggleAuth(false)}
                className={`pb-4 text-lg font-bold transition-all ${
                  !isLogin ? 'border-b-2 border-black text-black' : 'text-gray-300'
                }`}
              >
                Join Us
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      {...register('username', { required: 'Full name is required' })}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black focus:outline-none transition-all"
                      placeholder="Your Name"
                    />
                    {errors.username && (
                      <p className="text-red-500 text-xs mt-1 font-medium">
                        {errors.username.message}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                  })}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black focus:outline-none transition-all"
                  placeholder="yourname@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'At least 6 characters' },
                  })}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black focus:outline-none transition-all"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>
                )}
              </div>

              {/* Avatar Upload */}
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Profile Avatar
                    </label>
                    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                      <input
                        type="file"
                        accept="image/*"
                        {...register('image', { required: 'Profile image is required' })}
                        className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-black file:text-white cursor-pointer"
                      />
                    </div>
                    {errors.image && (
                      <p className="text-red-500 text-xs mt-1 font-medium">
                        {errors.image.message}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition-all mt-6 shadow-xl active:scale-95 disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : isLogin ? (
                  'Sign In Now'
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-400 font-medium">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                disabled={loading}
                onClick={() => toggleAuth(!isLogin)}
                className="text-black font-extrabold cursor-pointer ml-1 hover:underline disabled:opacity-50"
              >
                {isLogin ? 'Join Us' : 'Sign In'}
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
