import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || '$';
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);

  const fetchUser = useCallback(async () => {
    try {
      const token = await getToken();
      console.log('Token from Clerk:', token);

      if (!token) return;

      const { data } = await axios.get('/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setIsOwner(data.role === 'hotelOwner');
        setSearchedCities(data.recentSearchedCities || []);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }, [getToken]);

  useEffect(() => {
    if (user) fetchUser();
  }, [user, fetchUser]);

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    axios,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
