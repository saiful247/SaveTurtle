import { useState,useEffect } from 'react';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate,useParams } from 'react-router-dom';

const EditEvent = () => {
  const [eventName, setEventName] = useState('');
  const [vanue, setVanue] = useState('');
  const [date, setEventDate] = useState('');
  const [time, setEventTime] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {id} = useParams();
  const [errors, setErrors] = useState({});
  

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/events/${id}`)
    .then((response) => {
        setVanue(response.data.vanue);
        setEventDate(response.data.date)
        setEventTime(response.data.time)
        setEventName(response.data.eventName)
        setPrice(response.data.price)
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        alert('An error happened. Please Chack console');
        console.log(error);
      });
  }, [id])

  const validateForm = () => {
    const newErrors = {};

    // Validate participant name
    if (!eventName) {
      newErrors.participantName = 'Event name is required';
    }

    // Validate gender
    if (!vanue) {
      newErrors.gender = 'Vanue is required';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    if (!time) {
      newErrors.time = 'Time is required';
    }

    // Validate ticket price (cannot be negative)
    if (!price) {
      newErrors.price = "Ticket price is required";
    } else if (price < 0) {
      newErrors.price = "Ticket price cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };



  const handleEditEvent = () => {
    if (!validateForm()) {
      alert('Please fix the errors before submitting');
      return;
    }
    const data = {
        eventName,
        vanue,
        date,
        time,
        price,
    };
    setLoading(true);
    axios
      .put(`http://localhost:5555/events/${id}`, data)
      .then(() => {
        setLoading(false);
        navigate('/events');
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please Chack console');
        console.log(error);
      });
  };
  return (
    <div className='min-h-screen bg-blue-100 flex justify-center items-center py-10'>
      <div className='bg-white shadow-xl rounded-lg p-8 w-full max-w-lg my-10'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Create Event</h1>
        {loading ? <Spinner /> : ''}

        <div className='space-y-4'>
          <div>
            <label className='block text-gray-700'>Event Name</label>
            <input
              type='text'
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className={`w-full mt-1 p-2 border ${
                errors.eventName ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.eventName && <p className='text-red-500'>{errors.eventName}</p>}
          </div>

          <div>
            <label className='block text-gray-700'>Venue</label>
            <input
              type='text'
              value={vanue}
              onChange={(e) => setVanue(e.target.value)}
              className={`w-full mt-1 p-2 border ${
                errors.vanue ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.vanue && <p className='text-red-500'>{errors.vanue}</p>}
          </div>

          <div>
            <label className='block text-gray-700'>Date</label>
            <input
              type='date'
              value={date}
              onChange={(e) => setEventDate(e.target.value)}
              className={`w-full mt-1 p-2 border ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.date && <p className='text-red-500'>{errors.date}</p>}
          </div>

          <div>
            <label className='block text-gray-700'>Time</label>
            <input
              type='time'
              value={time}
              onChange={(e) => setEventTime(e.target.value)}
              className={`w-full mt-1 p-2 border ${
                errors.time ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.time && <p className='text-red-500'>{errors.time}</p>}
          </div>

          <div>
            <label className='block text-gray-700'>Price</label>
            <input
              type='number'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`w-full mt-1 p-2 border ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.price && <p className='text-red-500'>{errors.price}</p>}
          </div>

          <div className='mt-4'>
            <button
              className='w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
              onClick={handleEditEvent}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
);

}

export default EditEvent