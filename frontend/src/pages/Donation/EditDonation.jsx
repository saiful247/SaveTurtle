import React, { useState, useEffect } from 'react';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditDonation = () => {
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [amount, setAmount] = useState('');
  const [dateOfPayment, setDateOfPayment] = useState('');
  const [discription, setDiscription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // State for error messages
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/donations/${id}`)
      .then((response) => {
        setDonorName(response.data.donorName);
        setEmail(response.data.email);
        setContactNo(response.data.contactNo);
        setAmount(response.data.amount);
        setDateOfPayment(response.data.dateOfPayment);
        setDiscription(response.data.discription);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please check console');
        console.log(error);
      });
  }, [id]);

  const validateEmail = (email) => {
    // Regex pattern for validating email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!donorName) newErrors.donorName = 'Donor Name is required.';
    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!contactNo) newErrors.contactNo = 'Contact No is required.';
    if (!amount) newErrors.amount = 'Amount is required.';
    if (!dateOfPayment) newErrors.dateOfPayment = 'Date of Payment is required.';
    if (!discription) newErrors.discription = 'Description is required.';

    return newErrors;
  };

  const handleEditDonation = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set errors if validation fails
      return;
    }

    const data = {
      donorName,
      email,
      contactNo,
      amount,
      dateOfPayment,
      discription,
    };
    setLoading(true);
    axios
      .put(`http://localhost:5555/donations/${id}`, data)
      .then(() => {
        setLoading(false);
        navigate('/donations');
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please check console');
        console.log(error);
      });
  };

  // Clear specific error when the field changes
  const handleChange = (field, value) => {
    if (errors[field]) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    }

    switch (field) {
      case 'donorName':
        setDonorName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'contactNo':
        setContactNo(value);
        break;
      case 'amount':
        setAmount(value);
        break;
      case 'dateOfPayment':
        setDateOfPayment(value);
        break;
      case 'discription':
        setDiscription(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className='p-4'>
      <h1 className='text-3xl my-4 text-teal-600'>Edit Donation</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-teal-500 rounded-xl w-[600px] p-4 mx-auto bg-blue-50'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-700'>Donor Name</label>
          <input
            type='text'
            value={donorName}
            onChange={(e) => handleChange('donorName', e.target.value)}
            className='border-2 border-teal-400 px-4 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-teal-300'
          />
          {errors.donorName && <p className='text-red-500 text-sm'>{errors.donorName}</p>} {/* Error message */}
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-700'>Email</label>
          <input
            type='text'
            value={email}
            onChange={(e) => handleChange('email', e.target.value)}
            className='border-2 border-teal-400 px-4 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-teal-300'
          />
          {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>} {/* Error message */}
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-700'>Contact No</label>
          <input
            type='number'
            value={contactNo}
            onChange={(e) => handleChange('contactNo', e.target.value)}
            className='border-2 border-teal-400 px-4 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-teal-300'
          />
          {errors.contactNo && <p className='text-red-500 text-sm'>{errors.contactNo}</p>} {/* Error message */}
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-700'>Amount</label>
          <input
            type='number'
            value={amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            className='border-2 border-teal-400 px-4 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-teal-300'
          />
          {errors.amount && <p className='text-red-500 text-sm'>{errors.amount}</p>} {/* Error message */}
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-700'>Date of Payment</label>
          <input
            type='date'
            value={dateOfPayment}
            onChange={(e) => handleChange('dateOfPayment', e.target.value)}
            className='border-2 border-teal-400 px-4 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-teal-300'
          />
          {errors.dateOfPayment && <p className='text-red-500 text-sm'>{errors.dateOfPayment}</p>} {/* Error message */}
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-700'>Description</label>
          <input
            type='text'
            value={discription}
            onChange={(e) => handleChange('discription', e.target.value)}
            className='border-2 border-teal-400 px-4 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-teal-300'
          />
          {errors.discription && <p className='text-red-500 text-sm'>{errors.discription}</p>} {/* Error message */}
        </div>
        <button
          className='p-2 bg-teal-500 text-white rounded-lg m-8 hover:bg-teal-600 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-105'
          onClick={handleEditDonation}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditDonation;
