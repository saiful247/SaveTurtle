import React, { useState } from 'react';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const CreateDonations = () => {
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [amount, setAmount] = useState('');
  const [dateOfPayment, setDateOfPayment] = useState('');
  const [discription, setDiscription] = useState('');
  const [paymentImage, setPaymentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setPaymentImage(e.target.files[0]);
  };

  // Validate contact number to ensure it's 10 digits
  const handleContactNoChange = (e) => {
    const value = e.target.value;
    setContactNo(value);
    if (value.length === 10) {
      setErrors((prevErrors) => ({ ...prevErrors, contactNo: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!donorName) newErrors.donorName = 'Donor name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(email)) newErrors.email = 'Invalid email format';
    if (!contactNo || contactNo.length !== 10) newErrors.contactNo = 'Contact number must be 10 digits';
    if (!amount || amount <= 0) newErrors.amount = 'Donation amount must be greater than zero';
    if (!dateOfPayment) newErrors.dateOfPayment = 'Date of payment is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDonation = () => {
    if (!validateForm()) return; // Stop form submission if validation fails

    const formData = new FormData();
    formData.append('donorName', donorName);
    formData.append('email', email);
    formData.append('contactNo', contactNo);
    formData.append('amount', amount);
    formData.append('dateOfPayment', dateOfPayment);
    formData.append('discription', discription);

    if (paymentImage) {
      formData.append('paymentImage', paymentImage);
    }

    setLoading(true);
    axios
      .post('http://localhost:5555/donations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        setLoading(false);
        setSuccessMessage('Donation created successfully!');
        generatePDF({ donorName, email, contactNo, amount, dateOfPayment, discription });
        setTimeout(() => {
          setSuccessMessage('');
          navigate('/donations/herosection');
        }, 3000);
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please check console');
        console.log(error);
      });
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();

    doc.setFontSize(12);
    doc.text('Donation Receipt', 20, 20);
    doc.text(`Donor Name: ${data.donorName}`, 20, 30);
    doc.text(`Email: ${data.email}`, 20, 40);
    doc.text(`Contact No: ${data.contactNo}`, 20, 50);
    doc.text(`Amount: $${data.amount}`, 20, 60);
    doc.text(`Date Of Payment: ${data.dateOfPayment}`, 20, 70);
    doc.text(`Description: ${data.discription}`, 20, 80);

    doc.save('donation_receipt.pdf');
  };

  return (
    <div className='min-h-screen flex bg-blue-50'>
      {/* Left Side: Save Turtles Community Text */}
      <div className='flex-1 flex flex-col justify-center items-center bg-teal-500 text-white p-8'>
        <h1 className='text-4xl font-bold mb-4'>Save Turtles Community</h1>
        <p className='text-lg text-center'>
          Join us in our mission to protect sea turtles. Your donation helps support conservation efforts!
        </p>
      </div>

      {/* Right Side: Donation Form */}
      <div className='w-full max-w-md flex-1 flex flex-col justify-center items-center p-8'>
        <h1 className='text-3xl text-center mb-6 text-teal-700'>Create Donation</h1>

        {/* Important Notice */}
        <div className='bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4'>
          <p className='font-bold'>Important Notice:</p>
          <p>Please make your donation before filling out the form. This ensures a smooth processing of your contribution.</p>
        </div>

        {/* Bank Details Section */}
        <div className='mb-4 p-4 border border-gray-300 rounded-lg bg-white'>
          <h2 className='text-xl font-bold mb-2'>Bank Details</h2>
          <p><strong>Bank Name:</strong> Bank of Ceylon</p>
          <p><strong>Account No:</strong> 87732461</p>
          <p><strong>Branch:</strong> Colombo</p>
        </div>

        {loading && <Spinner />}
        {successMessage && (
          <div className='bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4' role='alert'>
            <p className='font-bold'>Success!</p>
            <p>{successMessage}</p>
          </div>
        )}

        {/* Donation Form */}
        <div className='bg-white shadow-md rounded-lg px-8 py-6 w-full'>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Donor Name</label>
            <input
              type='text'
              placeholder='Enter Donor Name'
              value={donorName}
              onChange={(e) => {
                setDonorName(e.target.value);
                if (e.target.value) setErrors((prevErrors) => ({ ...prevErrors, donorName: '' }));
              }}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.donorName && 'border-red-500'}`}
            />
            {errors.donorName && <p className='text-red-500 text-xs italic'>{errors.donorName}</p>}
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Email</label>
            <input
              type='email'
              placeholder='Enter Email'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (e.target.value) setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
              }}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email && 'border-red-500'}`}
            />
            {errors.email && <p className='text-red-500 text-xs italic'>{errors.email}</p>}
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Contact No</label>
            <input
              type='number'
              placeholder='Enter Contact Number'
              value={contactNo}
              onChange={handleContactNoChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.contactNo && 'border-red-500'}`}
            />
            {errors.contactNo && <p className='text-red-500 text-xs italic'>{errors.contactNo}</p>}
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Amount</label>
            <input
              type='number'
              placeholder='Enter Donation Amount'
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (e.target.value > 0) setErrors((prevErrors) => ({ ...prevErrors, amount: '' }));
              }}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.amount && 'border-red-500'}`}
            />
            {errors.amount && <p className='text-red-500 text-xs italic'>{errors.amount}</p>}
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Date Of Payment</label>
            <input
              type='date'
              value={dateOfPayment}
              onChange={(e) => {
                setDateOfPayment(e.target.value);
                if (e.target.value) setErrors((prevErrors) => ({ ...prevErrors, dateOfPayment: '' }));
              }}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.dateOfPayment && 'border-red-500'}`}
            />
            {errors.dateOfPayment && <p className='text-red-500 text-xs italic'>{errors.dateOfPayment}</p>}
          </div>
          <div>
            <label className="block text-gray-700">Upload Payment Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="mt-2 border-gray-300"
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>Description</label>
            <textarea
              placeholder='Enter a description'
              value={discription}
              onChange={(e) => setDiscription(e.target.value)}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
          </div>
          <div className='flex items-center justify-center'>
            <button
              onClick={handleSaveDonation}
              className='bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105'
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDonations;
