import React, { useState } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import backgroundImage from '../../images/BG.jpg';  // Importing the background image
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
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

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
        setEventName('');
        setUserID('');
        setAmount('');
        setReason('');
        setEmail('');
        setShowDownloadOptions(true);  // Show options to download after save
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
    setShowDownloadOptions(false);  // Hide download options after generating PDF
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
      <BackButton />
      <h1 className="text-3xl my-4 text-white">Create Refund</h1>
      {loading ? <Spinner /> : ''}
      <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto bg-white bg-opacity-90">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserID(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Reason</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <button
          className="p-2 bg-sky-300 m-8 hover:bg-sky-400 transition-all"
          onClick={handleSaveRefund}
        >
          Save
        </button>
      </div>

      {/* Download Options */}
      {showDownloadOptions && (
        <div className="mt-4 text-center">
          <h3 className="text-xl text-white">Download Refund Details</h3>
          <button
            className="p-2 bg-blue-500 m-2 text-white rounded hover:bg-blue-600 transition-all"
            onClick={generatePDF}
          >
            Download PDF
          </button>
          <CSVLink
            data={csvData}
            filename="refund_details.csv"
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all"
          >
            Download CSV
          </CSVLink>
        </div>
      )}
    </div>
  );
};

export default CreateRefunds;
