import { useState } from 'react';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteEventBooking = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDeleteEventBooking = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:5555/eventBookingList/${id}`)
      .then(() => {
        setLoading(false);
        navigate('/eventBookingList');
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please Chack console');
        console.log(error);
      });
  };
  return (
    <div className='p-4'>
    <h1 className='text-3xl my-4'>Delete Event Booking</h1>
    {loading ? <Spinner /> : ''}
    <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
      <h3 className='text-2xl'>Are You Sure You want to delete this Event Booking?</h3>

      <button
        className='p-4 bg-red-600 text-white m-8 w-full'
        onClick={handleDeleteEventBooking}
      >
        Yes, Delete it
      </button>
    </div>
  </div>
  )
}

export default DeleteEventBooking
