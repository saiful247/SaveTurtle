import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import axios from 'axios';

const CreateEventsParticipant = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [participantName, setParticipantName] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [paymentImage, setPaymentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Pre-fill event data from state
  const eventName = state?.eventName || '';
  const eventDate = state?.eventDate || '';
  const ticketPrice = state?.ticketPrice || '';

  const handleImageChange = (e) => {
    setPaymentImage(e.target.files[0]);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!participantName) {
      newErrors.participantName = 'Participant name is required';
    }
    if (!gender) {
      newErrors.gender = 'Gender is required';
    }

    const phoneRegex = /^07[0-9]{8}$/;
    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Phone number must start with 07 and have 10 digits';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!paymentImage) {
      newErrors.paymentImage = 'Payment image is required';
    } else if (!allowedFileTypes.includes(paymentImage.type)) {
      newErrors.paymentImage = 'Allowed image types are jpg, jpeg, png, and webp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEventParticipant = () => {
    if (!validateForm()) {
      alert('Please fix the errors before submitting');
      return;
    }


    const formData = new FormData();
    formData.append('participantName', participantName);
    formData.append('gender', gender);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('eventName', eventName);
    formData.append('eventDate', eventDate);
    formData.append('ticketPrice', ticketPrice);

    if (paymentImage) {
      formData.append('paymentImage', paymentImage);
    }

    setLoading(true);
    axios
      .post('http://localhost:5555/eventViews/eventParticipants', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        setLoading(false);
        navigate('/eventViews');
      })
      .catch((error) => {
        setLoading(false);
        alert('An error occurred. Please check the console');
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen bg-blue-100 flex justify-center items-center py-10">
      
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg my-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Event Participant Details</h1>
        {loading && <Spinner />}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">Participant Name</label>
            <input
              type="text"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              className={`w-full mt-1 p-2 border ${
                errors.participantName ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.participantName && (
              <p className="text-red-500">{errors.participantName}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={`w-full mt-1 p-2 border ${
                errors.gender ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500">{errors.gender}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full mt-1 p-2 border ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.phone && <p className="text-red-500">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full mt-1 p-2 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          {/* Event Details */}
          <div>
            <label className="block text-gray-700">Event Name</label>
            <input
              type="text"
              value={eventName}
              disabled
              className="w-full mt-1 p-2 border border-gray-300 bg-gray-200 rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700">Event Date</label>
            <input
              type="text"
              value={eventDate}
              disabled
              className="w-full mt-1 p-2 border border-gray-300 bg-gray-200 rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700">Ticket Price</label>
            <input
              type="text"
              value={ticketPrice}
              disabled
              className="w-full mt-1 p-2 border border-gray-300 bg-gray-200 rounded-md"
            />
            {errors.paymentImage && (
              <p className="text-red-500">{errors.paymentImage}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700">Upload Payment Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className={`mt-2 ${
                errors.paymentImage ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>

          <div className="bg-red-100 p-4 rounded-md">
            <p className="text-gray-700">
              <strong>Attention:</strong> Please upload your payment document here. We will process your payment and notify you as soon as possible about the status. Payment details:
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Bank:</strong> Sampath Bank<br />
              <strong>Branch:</strong> Malabe<br />
              <strong>Account Name:</strong> SaveTurtle Sri Lanka<br />
              <strong>Account Number:</strong> 710 890 4965<br />
              <strong>Branch Code:</strong> 053
            </p>
          </div>

          <div className="mt-4">
            <button
              onClick={handleSaveEventParticipant}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventsParticipant;
