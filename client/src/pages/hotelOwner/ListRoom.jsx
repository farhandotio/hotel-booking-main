import React, { useEffect } from 'react';
import Title from '../../components/Title';
import { useDispatch, useSelector } from 'react-redux';
import { getOwnerRooms, toggleRoomAvailability } from '../../app/feature/roomSlice';

const ListRoom = () => {
  const dispatch = useDispatch();
  const { rooms, loading } = useSelector((state) => state.room);

  useEffect(() => {
    dispatch(getOwnerRooms());
  }, [dispatch]);

  const handleToggle = (id) => {
    dispatch(toggleRoomAvailability(id));
  };

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View, edit, or manage all listed rooms."
      />
      <p className="text-gray-500 mt-8">All Rooms</p>

      <div className="w-full max-w-4xl text-left border border-gray-300 rounded-lg max-h-96 overflow-y-scroll mt-3">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">Facility</th>
              <th className="py-3 px-4 text-gray-800 font-medium">Price /night</th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">Available</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {rooms.length > 0 ? (
              rooms.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-200">
                    {item.roomType}
                  </td>

                  <td className="py-3 px-4 text-gray-700 border-t border-gray-200 max-sm:hidden">
                    {item.amenities?.join(', ') || 'N/A'}
                  </td>

                  <td className="py-3 px-4 text-gray-700 border-t border-gray-200">
                    ${item.pricePerNight}
                  </td>

                  <td className="py-3 px-4 border-t border-gray-200 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item.isAvailable}
                        onChange={() => handleToggle(item._id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-10 text-center text-gray-400">
                  {loading ? 'Loading rooms...' : 'No rooms found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListRoom;
