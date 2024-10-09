import React, { useState } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteRefund = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Handle delete refund
  const handleDeleteRefund = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:5555/refunds/${id}`)
      .then(() => {
        setLoading(false);
        navigate('/refunds');  // Redirect after delete
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please check the console');
        console.log(error);
      });
  };

  // Handle "No, Don't Delete" button
  const handleCancelDelete = () => {
    navigate('/refunds');  // Navigate to refund list or previous page
  };

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4">Delete Refund</h1>
      {loading ? <Spinner /> : ''}

      <div className="flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto">
        <h3 className="text-2xl mb-4">Are You Sure You want to delete this refund?</h3>

        <button
          className="p-4 bg-red-600 text-white m-8 w-full"
          onClick={handleDeleteRefund}
        >
          Yes, Delete it
        </button>

        {/* "No, Don't Delete" Button */}
        <button
          className="p-4 bg-gray-400 text-white w-full"
          onClick={handleCancelDelete}
        >
          No, Don't Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteRefund;
