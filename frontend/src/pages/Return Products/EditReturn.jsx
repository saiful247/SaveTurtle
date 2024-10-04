import React, { useState, useEffect } from 'react';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditReturn = () => {
  const [productId, setProductId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [reason, setReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/returns/${id}`)
      .then((response) => {
        setProductId(response.data.productId);
        setOrderId(response.data.orderId);
        setReason(response.data.reason);
        setRefundAmount(response.data.refundAmount);
        setReturnDate(response.data.returnDate);
        setEmail(response.data.email);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert('An error occurred. Please check the console.');
        console.log(error);
      });
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    if (!productId) newErrors.productId = "Product ID is required.";
    if (!orderId) newErrors.orderId = "Order ID is required.";
    if (!reason) newErrors.reason = "Reason is required.";
    if (!refundAmount || refundAmount <= 0) newErrors.refundAmount = "Refund Amount must be a positive number.";
    if (!returnDate) newErrors.returnDate = "Return Date is required.";
    if (!email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleEditReturn = () => {
    if (!validateForm()) return; // If validation fails, return early

    const data = {
      productId,
      orderId,
      reason,
      refundAmount,
      returnDate,
      email,
    };
    setLoading(true);
    axios.put(`http://localhost:5555/returns/${id}`, data)
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
    <div className='p-6 bg-gray-100 min-h-screen flex flex-col'>
      <h1 className='text-4xl font-bold text-center my-6'>Edit Return</h1>
      {loading && <Spinner />}
      <div className='flex flex-col border border-gray-300 shadow-lg rounded-lg w-full md:w-1/2 lg:w-1/3 mx-auto bg-white p-6'>
        <div className='my-4'>
          <label className='text-lg font-medium text-gray-600'>Return ID</label>
          <input
            type='text'
            value={id}
            readOnly
            className='border border-gray-300 px-4 py-2 mt-2 w-full rounded-md bg-gray-200 cursor-not-allowed'
          />
        </div>
        <div className='my-4'>
          <label className='text-lg font-medium text-gray-600'>Product ID</label>
          <input
            type='text'
            value={productId}
            onChange={(e) => {
              setProductId(e.target.value);
              setErrors({ ...errors, productId: '' }); // Clear error message
            }}
            className='border border-gray-300 px-4 py-2 mt-2 w-full rounded-md focus:ring-2 focus:ring-blue-400'
          />
          {errors.productId && <span className='text-red-500'>{errors.productId}</span>}
        </div>
        <div className='my-4'>
          <label className='text-lg font-medium text-gray-600'>Order ID</label>
          <input
            type='text'
            value={orderId}
            onChange={(e) => {
              setOrderId(e.target.value);
              setErrors({ ...errors, orderId: '' }); // Clear error message
            }}
            className='border border-gray-300 px-4 py-2 mt-2 w-full rounded-md focus:ring-2 focus:ring-blue-400'
          />
          {errors.orderId && <span className='text-red-500'>{errors.orderId}</span>}
        </div>
        <div className='my-4'>
          <label className='text-lg font-medium text-gray-600'>Reason</label>
          <input
            type='text'
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setErrors({ ...errors, reason: '' }); // Clear error message
            }}
            className='border border-gray-300 px-4 py-2 mt-2 w-full rounded-md focus:ring-2 focus:ring-blue-400'
          />
          {errors.reason && <span className='text-red-500'>{errors.reason}</span>}
        </div>
        <div className='my-4'>
          <label className='text-lg font-medium text-gray-600'>Refund Amount</label>
          <input
            type='number'
            value={refundAmount}
            onChange={(e) => {
              setRefundAmount(e.target.value);
              setErrors({ ...errors, refundAmount: '' }); // Clear error message
            }}
            className='border border-gray-300 px-4 py-2 mt-2 w-full rounded-md focus:ring-2 focus:ring-blue-400'
          />
          {errors.refundAmount && <span className='text-red-500'>{errors.refundAmount}</span>}
        </div>
        <div className='my-4'>
          <label className='text-lg font-medium text-gray-600'>Return Date</label>
          <input
            type='date'
            value={returnDate}
            onChange={(e) => {
              setReturnDate(e.target.value);
              setErrors({ ...errors, returnDate: '' }); // Clear error message
            }}
            className='border border-gray-300 px-4 py-2 mt-2 w-full rounded-md focus:ring-2 focus:ring-blue-400'
          />
          {errors.returnDate && <span className='text-red-500'>{errors.returnDate}</span>}
        </div>
        <div className='my-4'>
          <label className='text-lg font-medium text-gray-600'>E-Mail</label>
          <input
            type='email'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ ...errors, email: '' }); // Clear error message
            }}
            className='border border-gray-300 px-4 py-2 mt-2 w-full rounded-md focus:ring-2 focus:ring-blue-400'
          />
          {errors.email && <span className='text-red-500'>{errors.email}</span>}
        </div>
        <button
          className='w-full bg-blue-500 text-white py-2 mt-6 rounded-md hover:bg-blue-600 transition duration-200'
          onClick={handleEditReturn}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditReturn;
