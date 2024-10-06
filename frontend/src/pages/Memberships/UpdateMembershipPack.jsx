import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import BackButton from '../../components/BackButton';
import { GiTurtle } from 'react-icons/gi';

const UpdateMembershipPack = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [features, setFeatures] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/memberships/${id}`)
      .then((response) => {
        const { name, price, duration, features } = response.data;
        setName(name);
        setPrice(price);
        setDuration(duration);
        setFeatures(features);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  const handleUpdateMembership = () => {
    const data = {
      name,
      price,
      duration,
      features
    };

    setLoading(true);
    axios.put(`http://localhost:5555/memberships/${id}`, data)
      .then(() => {
        setLoading(false);
        navigate('/membership/view');
      })
      .catch((error) => {
        setLoading(false);
        alert('An error occurred while updating the membership.');
        console.error(error);
      });
  };

  return (
    <div className="bg-gradient-to-b from-green-200 to-blue-200 p-6 min-h-screen flex flex-col items-center">
      <div className="absolute top-4 left-4">
        <BackButton /> 
      </div>
      <h1 className="text-4xl font-bold my-4 text-center text-green-700 flex items-center justify-center">
        <GiTurtle className="mr-2 text-6xl" />
        Update Membership Plan
      </h1>
      {loading && <Spinner />}
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6 mx-auto mt-4 border-2 border-green-300">
        <div className="my-4">
          <label className="text-lg font-semibold text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:border-green-500"
          />
        </div>
        <div className="my-4">
          <label className="text-lg font-semibold text-gray-700">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border-2 border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:border-green-500"
          />
        </div>
        <div className="my-4">
          <label className="text-lg font-semibold text-gray-700">Duration (Months)</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="border-2 border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:border-green-500"
          />
        </div>
        <div className="my-4">
          <label className="text-lg font-semibold text-gray-700">Features</label>
          <input
            type="text"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            className="border-2 border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:border-green-500"
          />
        </div>
        <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200" onClick={handleUpdateMembership}>
          Update
        </button>
      </div>
    </div>
  );
};

export default UpdateMembershipPack;
