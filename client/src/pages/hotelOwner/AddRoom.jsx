import React, { useState } from 'react';
import Title from '../../components/Title';
import { assets } from '../../assets/assets';
import { useDispatch, useSelector } from 'react-redux';
import { createRoom } from '../../app/feature/roomSlice';
import { toast } from 'react-hot-toast';

const AddRoom = () => {
  const dispatch = useDispatch();

  // Selector theke loading state ana jate button handle kora jay
  const { loading } = useSelector((state) => state.room);

  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [inputs, setInputs] = useState({
    roomType: '',
    pricePerNight: '',
    amenities: {
      'Free Wifi': false,
      'Free Breakfast': false,
      'Room Service': false,
      'Mountain View': false,
      'Pool Access': false,
    },
  });

  const onSubmitHandelar = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('roomType', inputs.roomType);
    formData.append('pricePerNight', inputs.pricePerNight);

    const selectedAmenities = Object.keys(inputs.amenities).filter((key) => inputs.amenities[key]);
    formData.append('amenities', JSON.stringify(selectedAmenities));

    Object.keys(images).forEach((key) => {
      if (images[key]) {
        formData.append('images', images[key]);
      }
    });

    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const resultAction = await dispatch(createRoom(formData));

    if (createRoom.fulfilled.match(resultAction)) {
      toast.success('Room added successfully!');
      // Form Reset logic
      setInputs({
        roomType: '',
        pricePerNight: '',
        amenities: {
          'Free Wifi': false,
          'Free Breakfast': false,
          'Room Service': false,
          'Mountain View': false,
          'Pool Access': false,
        },
      });
      setImages({ 1: null, 2: null, 3: null, 4: null });
    } else {
      toast.error(resultAction.payload || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={onSubmitHandelar} className="max-w-4xl">
      <Title
        align="left"
        font="outfit"
        title="Add Room"
        subTitle="Fill in the details carefully and accurate room details, pricing, and amenities."
      />

      <p className="text-gray-800 mt-10 font-medium">Images</p>
      <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImage${key}`} key={key}>
            <div className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-all">
              <img
                src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea}
                alt=""
                className={images[key] ? 'w-full h-full object-cover' : 'w-10 opacity-50'}
              />
            </div>
            <input
              type="file"
              accept="image/*"
              id={`roomImage${key}`}
              hidden
              onChange={(e) => setImages({ ...images, [key]: e.target.files[0] })}
            />
          </label>
        ))}
      </div>

      <div className="w-full flex max-sm:flex-col sm:gap-6 mt-6">
        <div className="flex-1">
          <p className="text-gray-800 font-medium mb-1">Room Type</p>
          <select
            value={inputs.roomType}
            onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}
            className="border border-gray-300 rounded-lg p-2.5 w-full outline-primary bg-white"
            required
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>
        <div className="flex-1">
          <p className="text-gray-800 font-medium mb-1">
            Price <span className="text-xs text-gray-500">/night</span>
          </p>
          <input
            type="number"
            placeholder="0"
            className="border border-gray-300 rounded-lg p-2.5 w-full outline-primary"
            value={inputs.pricePerNight}
            onChange={(e) => setInputs({ ...inputs, pricePerNight: e.target.value })}
            required
          />
        </div>
      </div>

      <p className="text-gray-800 mt-6 font-medium">Amenities</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`amenities${index + 1}`}
              className="w-4 h-4 accent-primary"
              checked={inputs.amenities[amenity]}
              onChange={() =>
                setInputs({
                  ...inputs,
                  amenities: {
                    ...inputs.amenities,
                    [amenity]: !inputs.amenities[amenity],
                  },
                })
              }
            />
            <label htmlFor={`amenities${index + 1}`} className="text-gray-600 cursor-pointer">
              {' '}
              {amenity}
            </label>
          </div>
        ))}
      </div>

      <button
        disabled={loading}
        className="bg-primary text-white px-10 py-3 rounded-lg mt-10 hover:bg-opacity-90 transition-all disabled:bg-gray-400 font-semibold"
        type="submit"
      >
        {loading ? 'Creating...' : 'Add Room'}
      </button>
    </form>
  );
};

export default AddRoom;
