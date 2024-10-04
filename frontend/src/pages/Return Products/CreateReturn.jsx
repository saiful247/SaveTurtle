import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const CreateReturns = () => {
  const [productId, setProductId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [reason, setReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!productId) newErrors.productId = 'Product ID is required';
    if (!orderId) newErrors.orderId = 'Order ID is required';
    if (!reason) newErrors.reason = 'Reason for return is required';
    if (!refundAmount || refundAmount <= 0) newErrors.refundAmount = 'Refund Amount must be greater than 0';
    if (!returnDate) newErrors.returnDate = 'Return Date is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid'; // Simple email regex validation

    return newErrors;
  };

  const handleSaveReturn = () => {
    const isConfirmed = window.confirm('Are you sure you want to submit this return request?');

    if (!isConfirmed) {
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = {
      productId,
      orderId,
      reason,
      refundAmount,
      returnDate,
      email,
    };

    setLoading(true);

    axios
      .post('http://localhost:5555/returns', data)
      .then(() => {
        setLoading(false);
        generatePDF(); // Generate PDF and prompt for download
        navigate('/return'); // Navigate to returns after PDF has been generated
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please check the console');
        console.log(error);
      });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Return Request Receipt', 20, 10);
    doc.text(`Product ID: ${productId}`, 20, 30);
    doc.text(`Order ID: ${orderId}`, 20, 40);
    doc.text(`Reason: ${reason}`, 20, 50);
    doc.text(`Refund Amount: ${refundAmount}`, 20, 60);
    doc.text(`Return Date: ${returnDate}`, 20, 70);
    doc.save(`Return_Receipt_${orderId}.pdf`); // This will prompt the user to download the PDF
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-gray-100"
      style={{
        backgroundImage: `url('/assets/download.jpeg')`, // Update the path for the turtle image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="bg-white bg-opacity-80 shadow-lg rounded-lg p-8 w-full max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Return Product Form</h1>
        {loading && (
          <div className="flex justify-center mb-4">
            <span className="spinner-border text-primary"></span>
          </div>
        )}

        <form>
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">Product ID</label>
              <input
                type="text"
                value={productId}
                onChange={(e) => {
                  setProductId(e.target.value);
                  setErrors((prevErrors) => ({ ...prevErrors, productId: null })); // Clear error on change
                }}
                className="p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Product ID"
              />
              {errors.productId && <span className="text-red-500">{errors.productId}</span>}
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => {
                  setOrderId(e.target.value);
                  setErrors((prevErrors) => ({ ...prevErrors, orderId: null })); // Clear error on change
                }}
                className="p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Order ID"
              />
              {errors.orderId && <span className="text-red-500">{errors.orderId}</span>}
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">Reason for Return</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setErrors((prevErrors) => ({ ...prevErrors, reason: null })); // Clear error on change
                }}
                className="p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Return Reason"
              />
              {errors.reason && <span className="text-red-500">{errors.reason}</span>}
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">Refund Amount</label>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => {
                  setRefundAmount(e.target.value);
                  setErrors((prevErrors) => ({ ...prevErrors, refundAmount: null })); // Clear error on change
                }}
                className="p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Refund Amount"
              />
              {errors.refundAmount && <span className="text-red-500">{errors.refundAmount}</span>}
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">Return Date</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => {
                  setReturnDate(e.target.value);
                  setErrors((prevErrors) => ({ ...prevErrors, returnDate: null })); // Clear error on change
                }}
                className="p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.returnDate && <span className="text-red-500">{errors.returnDate}</span>}
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">E-Mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prevErrors) => ({ ...prevErrors, email: null })); // Clear error on change
                }}
                className="p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Email"
              />
              {errors.email && <span className="text-red-500">{errors.email}</span>}
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleSaveReturn}
              className="w-full p-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReturns;
