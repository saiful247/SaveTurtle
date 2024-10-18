import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReturnProduct = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchReturns = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5555/returns');
        setReturns(response.data.data);
      } catch (error) {
        console.error('Error fetching returns:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReturns();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this return?")) {
      try {
        await axios.delete(`http://localhost:5555/returns/${id}`);
        alert('Return deleted successfully!');
        setReturns((prevReturns) => prevReturns.filter(returnProduct => returnProduct._id !== id));
      } catch (error) {
        console.error('Error deleting the return:', error);
      }
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm("Are you sure you want to approve this return?")) {
      try {
        await axios.put(`http://localhost:5555/returns/${id}/approve`);
        alert('Return approved successfully!');
        setReturns((prevReturns) => 
          prevReturns.map(returnProduct =>
            returnProduct._id === id ? { ...returnProduct, status: 'Approved' } : returnProduct
          )
        );
      } catch (error) {
        console.error('Error approving the return:', error);
      }
    }
  };

  const handleDisapprove = async (id) => {
    if (window.confirm("Are you sure you want to disapprove this return?")) {
      try {
        await axios.put(`http://localhost:5555/returns/${id}/disapprove`);
        alert('Return disapproved successfully!');
        setReturns((prevReturns) => 
          prevReturns.map(returnProduct =>
            returnProduct._id === id ? { ...returnProduct, status: 'Disapproved' } : returnProduct
          )
        );
      } catch (error) {
        console.error('Error disapproving the return:', error);
      }
    }
  };

  const filteredReturns = returns.filter((returnProduct) => {
    const returnDate = new Date(returnProduct.returnDate);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const matchesSearchTerm =
      returnProduct.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnProduct.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnProduct.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnProduct.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDateRange =
      (!from || returnDate >= from) && (!to || returnDate <= to);

    return matchesSearchTerm && matchesDateRange;
  });

  const totalItems = filteredReturns.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReturns.slice(indexOfFirstItem, indexOfLastItem);

  const calculateTotalRefundAmount = () => {
    return filteredReturns.reduce((total, returnProduct) => {
      return total + (parseFloat(returnProduct.refundAmount) || 0);
    }, 0).toFixed(2);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title and settings
    doc.setFontSize(18);
    doc.text("Return Products List", 14, 22);
    
    // AutoTable data
    const tableColumn = ["Product ID", "Order ID", "Reason", "Refund Amount", "Return Date", "Email", "Status"];
    const tableRows = [];

    filteredReturns.forEach(returnProduct => {
      const returnDate = new Date(returnProduct.returnDate).toLocaleDateString();
      const returnData = [
        returnProduct.productId,
        returnProduct.orderId,
        returnProduct.reason,
        returnProduct.refundAmount,
        returnDate,
        returnProduct.email,
        returnProduct.status,
      ];
      tableRows.push(returnData);
    });

    // AutoTable for table generation
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30
    });

    // Total refund amount
    doc.text(`Total Refund Amount: $${calculateTotalRefundAmount()}`, 14, doc.autoTable.previous.finalY + 10);

    // Save the PDF
    doc.save('return_products_list.pdf');
  };

  // Function to handle email sending
const sendEmail = async (email, status) => {
  try {
    await axios.post('http://localhost:5555/returnProductsendEmail', { email, status });
    alert(`Email successfully sent for ${status}!`);
  } catch (error) {
    console.error('Error sending email:', error);
    alert('Failed to send email');
  }
};
  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className="flex justify-between items-center mb-6">
        <h1 className='text-4xl font-semibold'>Return Products List</h1>
        <button
          onClick={downloadPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Download PDF
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by Product ID, Order ID, or Email"
        className="border rounded p-2 mb-4 w-full md:w-1/3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="flex mb-4">
        <input
          type="date"
          className="border rounded p-2 mr-2"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          className="border rounded p-2"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className='min-w-full border-collapse border border-gray-300'>
            <thead>
              <tr className='bg-gray-200'>
                <th className='border px-4 py-2'>Product ID</th>
                <th className='border px-4 py-2'>Order ID</th>
                <th className='border px-4 py-2'>Reason</th>
                <th className='border px-4 py-2'>Refund Amount</th>
                <th className='border px-4 py-2'>Return Date</th>
                <th className='border px-4 py-2'>Email</th>
                <th className='border px-4 py-2'>Actions</th>
                <th className='border px-4 py-2'>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((returnProduct) => (
                <tr key={returnProduct._id}>
                  <td className='border px-4 py-2'>{returnProduct.productId}</td>
                  <td className='border px-4 py-2'>{returnProduct.orderId}</td>
                  <td className='border px-4 py-2'>{returnProduct.reason}</td>
                  <td className='border px-4 py-2'>{returnProduct.refundAmount}</td>
                  <td className='border px-4 py-2'>{new Date(returnProduct.returnDate).toLocaleDateString()}</td>
                  <td className='border px-4 py-2'>{returnProduct.email}</td>
                  <td className='border px-4 py-2'>
                    <div className='flex justify-center gap-4'>
                      <Link to={`/returns/details/${returnProduct._id}`}>
                        <BsInfoCircle className='text-xl text-green-600 hover:text-green-800 transition duration-200' />
                      </Link>
                      <Link to={`/returns/edit/${returnProduct._id}`}>
                        <AiOutlineEdit className='text-xl text-yellow-600 hover:text-yellow-800 transition duration-200' />
                      </Link>
                      <button onClick={() => handleDelete(returnProduct._id)}>
                        <MdOutlineDelete className='text-xl text-red-600 hover:text-red-800 transition duration-200' />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="mt-4 flex justify-center gap-x-4">
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        onClick={() => sendEmail(returnProduct.email, 'approved')} // On Approve, send approval email
                      >
                        Approve
                      </button>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        onClick={() => sendEmail(returnProduct.email, 'disapproved')} // On Disapprove, send disapproval email
                      >
                        Disapprove
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          <div className='mt-4 flex justify-between'>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Previous
            </button>
            <p>Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}</p>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={indexOfLastItem >= totalItems}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnProduct;
