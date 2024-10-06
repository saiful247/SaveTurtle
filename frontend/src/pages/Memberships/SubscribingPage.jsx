import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SubscribePage = () => {
  const { id } = useParams(); // 'id' from the URL, which is the membershipId
  const [membership, setMembership] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    paymentSlip: null,
  });
  const [errors, setErrors] = useState({}); // To store field-specific errors
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5555/memberships/${id}`)
      .then(response => {
        setMembership(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching membership", error);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear field-specific error when user types
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, paymentSlip: e.target.files[0] });
    setErrors({ ...errors, paymentSlip: '' }); // Clear file error
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const formDataToSend = new FormData();
    formDataToSend.append('userId', formData.userId);
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('membershipId', id); // Append membership ID
    formDataToSend.append('paymentSlip', formData.paymentSlip);

    try {
      const response = await axios.post('http://localhost:5555/subscriptions/subscribe', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Log the response data for debugging
      console.log(response.data);

      // Navigate to receipt page if successful
      navigate(`/subscriptions/${response.data.data._id}`);
    } catch (error) {
      console.error('Error submitting subscription', error);
      
      if (error.response && error.response.data && error.response.data.message) {
        const errorMessage = error.response.data.message;

        // Manually mapping error messages to specific fields
        if (errorMessage.includes("userId")) {
          setErrors({ ...errors, userId: errorMessage });
        } else if (errorMessage.includes("firstName")) {
          setErrors({ ...errors, firstName: errorMessage });
        } else if (errorMessage.includes("lastName")) {
          setErrors({ ...errors, lastName: errorMessage });
        } else if (errorMessage.includes("email")) {
          setErrors({ ...errors, email: errorMessage });
        } else if (errorMessage.includes("Payment slip")) {
          setErrors({ ...errors, paymentSlip: errorMessage });
        } else {
          alert(errorMessage); // General error
        }
      } else {
        alert('Failed to subscribe. Please try again.');
      }
    }
  };

  if (loading) return <p>Loading membership details...</p>;

  return (
    <div className="bg-green-50 min-h-screen py-10">
      <h1 className="text-5xl text-center font-bold text-green-800 mb-10">
        Subscribe to {membership ? membership.name : 'Membership'}
      </h1>

      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        {membership && (
          <>
            <p className="text-green-700 text-xl">Price: Rs {membership.price}</p>
            <p className="text-green-700 mt-2">Duration: {membership.duration}</p>
            <p className="text-green-700 mt-2">{membership.features}</p>
          </>
        )}

        <form onSubmit={handleSubmit} className="mt-6">

          <div className="mb-4">
            <label className="block text-green-700">User ID</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-300 rounded-md"
              required
            />
            {errors.userId && <p className="text-red-500">{errors.userId}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-green-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-300 rounded-md"
              required
            />
            {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-green-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-300 rounded-md"
              required
            />
            {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-green-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-300 rounded-md"
              required
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-green-700">Payment Slip</label>
            <input
              type="file"
              name="paymentSlip"
              onChange={handleFileChange}
              className="w-full"
              required
            />
            {errors.paymentSlip && <p className="text-red-500">{errors.paymentSlip}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubscribePage;
