import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import { CSVLink } from 'react-csv'; // For CSV export
import jsPDF from 'jspdf'; // For PDF generation
import 'jspdf-autotable'; // For table in PDF
import backgroundImage from '../../images/BG.jpg';  // Import the background image

const RefundPage = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State to store search input

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/refunds')
      .then((response) => {
        setRefunds(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  // Filter refunds based on the search query (case-insensitive)
  const filteredRefunds = refunds.filter((refund) =>
    refund.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate PDF Report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Refund Report', 20, 10);
    doc.autoTable({
      head: [['No.', 'Event Name', 'User ID', 'Amount', 'Reason', 'Email']],
      body: filteredRefunds.map((refund, index) => [
        index + 1,
        refund.eventName,
        refund.userId,
        refund.amount,
        refund.reason,
        refund.email,
      ]),
    });
    doc.save('refund_report.pdf');
  };

  // Approve Refund Function
  const handleApprove = (id) => {
    console.log(`Approved refund with ID: ${id}`);
    // You can send an API request to approve the refund here
    // Example: axios.post(`/refunds/approve/${id}`)
  };

  // Reject Refund Function
  const handleReject = (id) => {
    console.log(`Rejected refund with ID: ${id}`);
    // You can send an API request to reject the refund here
    // Example: axios.post(`/refunds/reject/${id}`)
  };

  return (
    <div
      className='p-4 min-h-screen'
      style={{
        backgroundImage: `url(${backgroundImage})`,  // Setting the background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',  // Prevent the background from repeating
      }}
    >
      <div className="flex justify-between items-center">
        <h1 className='text-3xl my-8 text-white'>Refund List</h1>
        {/* <Link to='/refunds/create'>
          <MdOutlineAddBox className='text-sky-800 text-4xl' />
        </Link> */}
      </div>

      {/* Search Input */}
      <div className='mb-4'>
        <input
          type="text"
          placeholder="Search by Event Name"
          className="border border-gray-300 p-2 rounded-md w-full hover:blink-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
        />
      </div>

      {/* Report Generation Buttons */}
      <div className='flex gap-4 mb-4'>
        {/* PDF Report Button */}
        <button onClick={generatePDF} className="bg-blue-500 text-white p-2 rounded-md">
          Generate PDF Report
        </button>

        {/* CSV Export Button */}
        <CSVLink
          data={filteredRefunds}
          filename="refund_report.csv"
          className="bg-green-500 text-white p-2 rounded-md"
          headers={[
            { label: 'No.', key: 'index' },
            { label: 'Event Name', key: 'eventName' },
            { label: 'User ID', key: 'userId' },
            { label: 'Amount', key: 'amount' },
            { label: 'Reason', key: 'reason' },
            { label: 'Email', key: 'email' },
          ]}
          target="_blank"
        >
          Export CSV
        </CSVLink>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className='relative'>
            <table className='min-w-full table-auto border border-collapse border-gray-300 relative'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='px-4 py-2 border border-gray-300 text-left font-bold text-blue-500 opacity-90'>No.</th>
                  <th className='px-4 py-2 border border-gray-300 text-left font-bold text-blue-500 opacity-90'>Event Name</th>
                  <th className='px-4 py-2 border border-gray-300 text-left font-bold text-blue-500 opacity-90 max-md:hidden'>User ID</th>
                  <th className='px-4 py-2 border border-gray-300 text-left font-bold text-blue-500 opacity-90 max-md:hidden'>Amount</th>
                  <th className='px-4 py-2 border border-gray-300 text-left font-bold text-blue-500 opacity-90'>Reason</th>
                  <th className='px-4 py-2 border border-gray-300 text-left font-bold text-blue-500 opacity-90'>Email</th>
                  <th className='px-4 py-2 border border-gray-300 text-left font-bold text-blue-500 opacity-90'>Actions</th>
                  <th className='px-4 py-2 border border-gray-300 text-left font-bold text-blue-500 opacity-90'>Approve/Reject</th> {/* New Column */}
                </tr>
              </thead>
              <tbody className='bg-white bg-opacity-80'>
                {filteredRefunds.map((refund, index) => (
                  <tr key={refund._id} className='hover:bg-gray-100'>
                    <td className='px-4 py-2 border border-gray-300 text-center text-gray-800'>
                      {index + 1}
                    </td>
                    <td className='px-4 py-2 border border-gray-300 text-gray-800'>
                      {refund.eventName}
                    </td>
                    <td className='px-4 py-2 border border-gray-300 max-md:hidden text-gray-800'>
                      {refund.userId}
                    </td>
                    <td className='px-4 py-2 border border-gray-300 max-md:hidden text-gray-800'>
                      {refund.amount}
                    </td>
                    <td className='px-4 py-2 border border-gray-300 text-gray-800'>
                      {refund.reason}
                    </td>
                    <td className='px-4 py-2 border border-gray-300 text-gray-800'>
                      {refund.email}
                    </td>
                    <td className='px-4 py-2 border border-gray-300'>
                      <div className='flex justify-center gap-x-4'>
                        <Link to={`/refunds/details/${refund._id}`}>
                          <BsInfoCircle className='text-2xl text-green-800' />
                        </Link>
                        <Link to={`/refunds/edit/${refund._id}`}>
                          <AiOutlineEdit className='text-2xl text-yellow-600' />
                        </Link>
                        <Link to={`/refunds/delete/${refund._id}`}>
                          <MdOutlineDelete className='text-2xl text-red-600' />
                        </Link>
                      </div>
                    </td>
                    <td className='px-4 py-2 border border-gray-300'>
                      <div className='flex justify-center gap-x-2'>
                        <button
                          onClick={() => handleApprove(refund._id)}
                          className='bg-green-500 text-white p-1 rounded-md'
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(refund._id)}
                          className='bg-red-500 text-white p-1 rounded-md'
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Refund Queries */}
            <div className="mt-4">
              <p className="text-right font-bold text-white">
                Total Refunds: {filteredRefunds.length}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RefundPage;
