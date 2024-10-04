import React, { useState,useEffect } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate,useParams } from 'react-router-dom';

const EditRefund = () => {
  const [eventName, setEventName] = useState('');
  const [userId, setUserID] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {id} = useParams();
  

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/refunds/${id}`)
    .then((response) => {
        setEventName(response.data.eventName);
        setUserID(response.data.userId)
        setAmount(response.data.amount)
        setReason(response.data.reason)
        setEmail(response.data.email)
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        alert('An error happened. Please Check console');
        console.log(error);
      });
  }, [])

  const handleEditRefund = () => {
    const data = {
      eventName,
      userId,
      amount,
      reason,
      email,
    };
    setLoading(true);
    axios
      .put(`http://localhost:5555/refunds/${id}`, data)
      .then(() => {
        setLoading(false);
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please Chack console');
        console.log(error);
      });
  };
  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Edit Refund</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Event Name</label>
          <input
            type='text'
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>User ID</label>
          <input
            type='text'
            value={userId}
            onChange={(e) => setUserID(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2  w-full '
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Amount</label>
          <input
            type='number'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2  w-full '
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Reason</label>
          <input
            type='text'
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2  w-full '
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Email</label>
          <input
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2  w-full '
          />
        </div>
        <button className='p-2 bg-sky-300 m-8' onClick={handleEditRefund}>
          Save
        </button>
      </div>
    </div>
  )
}

export default EditRefund
