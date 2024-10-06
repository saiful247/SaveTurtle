import { useState } from 'react';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteEvent = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Function to delete the event
  const handleDeleteEvent = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:5555/events/${id}`)
      .then(() => {
        setLoading(false);
        navigate('/events');
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please check the console');
        console.log(error);
      });
  };

  // Function to cancel and navigate back
  const handleCancelDelete = () => {
    navigate('/events'); // Simply navigate back without performing any delete operation
  };

  return (
    <div className="p-4 min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-semibold text-gray-800 mb-8">Delete Event</h1>

      {loading && <Spinner />}

      <div className="flex flex-col items-center border-2 border-red-500 rounded-lg bg-white shadow-lg w-full max-w-md p-8">
        <h3 className="text-2xl text-gray-700 mb-6">Are you sure you want to delete this event?</h3>

        {/* Yes, Delete it Button */}
        <button
          className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg mb-4 hover:bg-red-700 transition duration-300"
          onClick={handleDeleteEvent}
        >
          Yes, Delete it
        </button>

        {/* Cancel Delete Button */}
        <button
          className="w-full py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition duration-300"
          onClick={handleCancelDelete}  // Navigates back without deleting
        >
          Cancel Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteEvent;
