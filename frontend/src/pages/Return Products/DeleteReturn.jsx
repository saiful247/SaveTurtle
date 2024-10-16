import React, { useState } from 'react';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteReturn = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDeleteReturn = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:5555/returns/${id}`)
      .then(() => {
        setLoading(false);
        navigate('/returns');
      })
      .catch((error) => {
        setLoading(false);
        alert('An error occurred. Please check the console.');
        console.log(error);
      });
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center'>
      <h1 className='text-3xl font-bold text-gray-800 mb-4'>Delete Return</h1>
      {loading && <Spinner />}
      
      {/* Button to open the modal */}
      <button
        className='px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition duration-200'
        onClick={() => setIsModalOpen(true)}
      >
        Delete Return
      </button>

      {/* Modal for confirmation */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg p-6 w-96'>
            <h3 className='text-xl font-semibold text-gray-700 mb-4'>
              Confirm Deletion
            </h3>
            <p className='text-gray-600 mb-6'>
              Are you sure you want to delete this return? This action cannot be undone.
            </p>
            <div className='flex justify-end'>
              <button
                className='px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md mr-2'
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md'
                onClick={handleDeleteReturn}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteReturn;
  