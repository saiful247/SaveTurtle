import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GiTurtle } from 'react-icons/gi';
import { FaSave } from 'react-icons/fa';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';

const CreateMembershipPack = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [features, setFeatures] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // New state for error messages
  const navigate = useNavigate();

  const handleSaveMembership = async () => {
    const data = { name, price, duration, features };
    setErrors({}); // Reset errors

    // Simple client-side validation
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!price) {
      newErrors.price = "Price is required";
    } else if (price < 0) {
      newErrors.price = "Price cannot be less than 0"; // Price validation
    }
    if (!duration) {
      newErrors.duration = "Duration is required";
    } else if (duration < 0) {
      newErrors.duration = "Duration cannot be less than 0"; // New validation check for duration
    }
    if (!features) newErrors.features = "Features are required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop the function if there are validation errors
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5555/memberships', data);
      setLoading(false);
      navigate('/membership/view');
    } catch (error) {
      setLoading(false);
      alert('An error occurred. Please check the console.');
      console.log(error);
    }
  };

  return (
    <div className='p-8 bg-blue-50 min-h-screen flex flex-col items-center'>
      <div className="absolute top-4 left-4">
        <BackButton /> 
      </div>
      <div className='bg-white shadow-lg rounded-lg p-8 max-w-xl w-full'>
        <div className='flex items-center justify-center mb-4'>
          <GiTurtle className='text-green-600 text-5xl' />
          <h1 className='text-4xl font-bold text-gray-700 ml-4'>Create New Membership</h1>
        </div>
        {loading && <Spinner />}
        <div className='space-y-4'>
          <div>
            <label className='text-lg text-gray-500'>Name</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`border-2 px-4 py-2 w-full rounded-lg focus:border-green-400 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className='text-red-500 text-sm'>{errors.name}</p>} {/* Error message */}
          </div>
          <div>
            <label className='text-lg text-gray-500'>Price</label>
            <input
              type='number'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`border-2 px-4 py-2 w-full rounded-lg focus:border-green-400 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.price && <p className='text-red-500 text-sm'>{errors.price}</p>} {/* Error message */}
          </div>
          <div>
            <label className='text-lg text-gray-500'>Duration (Months)</label>
            <input
              type='number'
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className={`border-2 px-4 py-2 w-full rounded-lg focus:border-green-400 ${errors.duration ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.duration && <p className='text-red-500 text-sm'>{errors.duration}</p>} {/* Error message */}
          </div>
          <div>
            <label className='text-lg text-gray-500'>Features (Comma separated)</label>
            <input
              type='text'
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              className={`border-2 px-4 py-2 w-full rounded-lg focus:border-green-400 ${errors.features ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.features && <p className='text-red-500 text-sm'>{errors.features}</p>} {/* Error message */}
          </div>
          <button
            className='bg-green-500 text-white px-4 py-2 w-full rounded-lg hover:bg-green-600 flex items-center justify-center'
            onClick={handleSaveMembership}
          >
            <FaSave className='mr-2' /> Save Membership
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMembershipPack;
