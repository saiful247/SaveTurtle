import React, { useState } from 'react';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteDonation = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDeleteDonation = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:5555/donations/${id}`)
      .then(() => {
        setLoading(false);
        navigate('/donations');
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please check the console');
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {/* <BackButton /> */}
        <h1 className="text-3xl text-center mb-4 text-teal-700">Delete Donation</h1>
        {loading && <Spinner />}
        <h3 className="text-xl text-center text-teal-600 mb-6">
          Are you sure you want to delete this donation?
        </h3>
        <div className="flex flex-col items-center">
          <button
            className="bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-red-700 transition duration-300 transform hover:-translate-y-1"
            onClick={handleDeleteDonation}
          >
            Yes, Delete it!
          </button>
          <button
            className="bg-teal-500 text-white font-bold py-2 px-4 rounded-full shadow-md mt-4 hover:bg-teal-600 transition duration-300 transform hover:-translate-y-1"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDonation;
