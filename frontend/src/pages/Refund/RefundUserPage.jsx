import { useState } from 'react';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import backgroundImage from '../../images/BG_Refund.jpg';  // Importing the background image
import jsPDF from 'jspdf'; // For PDF generation
import 'jspdf-autotable'; // For table in PDF
import { CSVLink } from 'react-csv'; // For CSV export

const CreateRefunds = () => {
  const [eventName, setEventName] = useState('');
  const [userId, setUserID] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [eventNameError, setEventNameError] = useState(''); // Event Name Error
  const [userIdError, setUserIdError] = useState(''); // User ID Error
  const [amountError, setAmountError] = useState(''); // Amount Error
  const [reasonError, setReasonError] = useState(''); // Reason Error
  const [emailError, setEmailError] = useState(''); // Email Error

  // Data for CSV Export
  const csvData = [
    { label: 'Event Name', value: eventName },
    { label: 'User ID', value: userId },
    { label: 'Amount', value: amount },
    { label: 'Reason', value: reason },
    { label: 'Email', value: email },
  ];

  // Handle Save Refund
  const handleSaveRefund = () => {
    let isValid = true;

    // Validation logic for each field
    if (!eventName) {
      setEventNameError('Event Name is required.');
      isValid = false;
    } else {
      setEventNameError('');
    }

    if (!userId) {
      setUserIdError('User ID is required.');
      isValid = false;
    } else {
      setUserIdError('');
    }

    if (!amount) {
      setAmountError('Amount is required.');
      isValid = false;
    } else if (amount < 0) {
      setAmountError('Amount cannot be negative.');
      isValid = false;
    } else {
      setAmountError('');
    }

    if (!reason) {
      setReasonError('Reason is required.');
      isValid = false;
    } else {
      setReasonError('');
    }

    if (!email) {
      setEmailError('Email is required.');
      isValid = false;
    } else if (!email.endsWith('@gmail.com')) {
      setEmailError('Email must included with @');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!isValid) {
      return; // Stop the function if validation fails
    }

    // Clear errors if all fields are valid
    const data = {
      eventName,
      userId,
      amount,
      reason,
      email,
    };

    setLoading(true);
    axios
      .post('http://localhost:5555/refunds', data)
      .then(() => {
        setLoading(false);
        setShowModal(true);  // Show modal after saving
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please check console');
        console.log(error);
      });
  };

  // Generate PDF Report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Refund Details', 20, 10);
    doc.autoTable({
      head: [['Field', 'Value']],
      body: [
        ['Event Name', eventName],
        ['User ID', userId],
        ['Amount', amount],
        ['Reason', reason],
        ['Email', email],
      ],
    });
    doc.save('refund_details.pdf');
        
    setEventName('');  // Resetting fields after download
    setUserID('');
    setAmount('');
    setReason('');
    setEmail('');
    setShowModal(false);  // Hide modal after generating PDF
  };

  return (
    <div
      className="p-4 min-h-screen"
      style={{
        backgroundImage: `url(${backgroundImage})`,  // Adding the background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      
      <h1 className="text-3xl my-4 text-black font-bold text-center">Create Refund</h1>
      {loading ? <Spinner /> : ''}

      <div className="flex flex-col shadow-lg rounded-lg w-full max-w-lg p-8 mx-auto bg-white bg-opacity-50">
        {/* Event Name Field */}
        <div className="mb-6">
          <label className="text-lg font-semibold text-gray-700 mb-2 block">Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => {
              setEventName(e.target.value);
              setEventNameError('');
            }}
            className="border-2 border-gray-300 rounded-lg px-4 py-2 w-full focus:border-sky-500 focus:ring-sky-500 transition-all"
          />
          {eventNameError && <p className="text-red-500 mt-1">{eventNameError}</p>}
        </div>

        {/* User ID Field */}
        <div className="mb-6">
          <label className="text-lg font-semibold text-gray-700 mb-2 block">User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => {
              setUserID(e.target.value);
              setUserIdError('');
            }}
            className="border-2 border-gray-300 rounded-lg px-4 py-2 w-full focus:border-sky-500 focus:ring-sky-500 transition-all"
          />
          {userIdError && <p className="text-red-500 mt-1">{userIdError}</p>}
        </div>

        {/* Amount Field */}
        <div className="mb-6">
          <label className="text-lg font-semibold text-gray-700 mb-2 block">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              const value = e.target.value;
              if (value >= 0) {
                setAmount(value);
                setAmountError('');
              } else {
                setAmountError('Amount cannot be negative.');
              }
            }}
            className="border-2 border-gray-300 rounded-lg px-4 py-2 w-full focus:border-sky-500 focus:ring-sky-500 transition-all"
          />
          {amountError && <p className="text-red-500 mt-1">{amountError}</p>}
        </div>

        {/* Reason Field */}
        <div className="mb-6">
          <label className="text-lg font-semibold text-gray-700 mb-2 block">Reason</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setReasonError('');
            }}
            className="border-2 border-gray-300 rounded-lg px-4 py-2 w-full focus:border-sky-500 focus:ring-sky-500 transition-all"
          />
          {reasonError && <p className="text-red-500 mt-1">{reasonError}</p>}
        </div>

        {/* Email Field */}
        <div className="mb-6">
          <label className="text-lg font-semibold text-gray-700 mb-2 block">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');  // Reset error when typing
            }}
            className="border-2 border-gray-300 rounded-lg px-4 py-2 w-full focus:border-sky-500 focus:ring-sky-500 transition-all"
          />
          {emailError && <p className="text-red-500 mt-1">{emailError}</p>}
        </div>

        <button
          className="w-full p-3 bg-gray text-black rounded-lg font-semibold hover:bg-sky-600 transition-all"
          onClick={handleSaveRefund}
        >
          Save
        </button>
      </div>

      {/* Modal for Download Options */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h3 className="text-lg font-semibold mb-4">Download Refund Details</h3>
            <div className="flex justify-around">
              <button
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all"
                onClick={generatePDF}
              >
                Download PDF
              </button>
              <CSVLink
                data={csvData}
                filename="refund_details.csv"
                className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all"
                onClick={() => setShowModal(false)}
              >
                Download CSV
              </CSVLink>
            </div>
            <button
              className="mt-4 w-full bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition-all"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRefunds;
