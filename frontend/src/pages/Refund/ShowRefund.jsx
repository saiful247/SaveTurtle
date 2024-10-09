import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import backgroundImage from '../../images/r1.jpg'; // Import the image

const ShowRefund = () => {
  const [refund, setRefund] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/refunds/${id}`)
      .then((response) => {
        setRefund(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  return (
    <div
      className='p-4'
      style={{
        backgroundImage: `url(${backgroundImage})`, // Set background image
        backgroundSize: 'cover', // Cover the whole div
        backgroundPosition: 'center', // Center the image
        minHeight: '100vh', // Ensure it covers the full screen
      }}
    >
      <BackButton />
      <h1 className='text-3xl my-4'>Show Refund</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4 bg-white bg-opacity-80'>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Id</span>
            <span>{refund._id}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Event Name</span>
            <span>{refund.eventName}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>User ID</span>
            <span>{refund.userId}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Amount</span>
            <span>{refund.amount}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Reason</span>
            <span>{refund.reason}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Email</span>
            <span>{refund.email}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Create Time</span>
            <span>{new Date(refund.createdAt).toString()}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Last Update Time</span>
            <span>{new Date(refund.updatedAt).toString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowRefund;
