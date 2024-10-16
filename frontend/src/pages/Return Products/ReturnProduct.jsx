import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import Spinner from '../../components/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';

const ReturnProduct = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5555/returns')
      .then((response) => {
        setReturns(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this return?")) {
      axios
        .delete(`http://localhost:5555/returns/${id}`)
        .then(() => {
          alert('Return deleted successfully!');
          // Update the returns state to filter out the deleted return
          setReturns((prevReturns) => prevReturns.filter(returnProduct => returnProduct._id !== id));
        })
        .catch((error) => {
          console.error('There was an error deleting the return!', error);
        });
    }
  };

  const handleApprove = (id) => {
    if (window.confirm("Are you sure you want to approve this return?")) {
      axios
        .put(`http://localhost:5555/returns/${id}/approve`)
        .then(() => {
          alert('Return approved successfully!');
          // Update the returns state to mark the return as approved
          setReturns((prevReturns) => 
            prevReturns.map(returnProduct =>
              returnProduct._id === id ? { ...returnProduct, status: 'Approved' } : returnProduct
            )
          );
        })
        .catch((error) => {
          console.error('There was an error approving the return!', error);
        });
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

    const matchesStatusFilter =
      statusFilter === "All" || returnProduct.status === statusFilter;

    // Exclude approved returns
    return matchesSearchTerm && matchesDateRange && matchesStatusFilter && returnProduct.status !== 'Approved';
  });

  // Sorting functionality
  const [sortConfig, setSortConfig] = useState({ key: 'returnDate', direction: 'ascending' });

  const sortedReturns = [...filteredReturns].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const totalItems = sortedReturns.length;

  // Pagination functionality
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const calculateTotalRefundAmount = () => {
    return filteredReturns.reduce((total, returnProduct) => {
      return total + (parseFloat(returnProduct.refundAmount) || 0);
    }, 0).toFixed(2); // Format to two decimal places
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Add title
    doc.setFontSize(20);
    doc.text('Return Products List', 20, 20);
  
    // Add a header for the table
    doc.setFontSize(12);
    const headers = ['No.', 'Product ID', 'Order ID', 'Reason', 'Refund Amount', 'Return Date', 'Email', 'Status'];
  
    // Prepare data for the PDF
    const data = sortedReturns.map((returnProduct, index) => [
      index + 1,
      returnProduct.productId,
      returnProduct.orderId,
      returnProduct.reason,
      returnProduct.refundAmount,
      new Date(returnProduct.returnDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }), // Format the date here
      returnProduct.email,
      returnProduct.status,
    ]);
  
    const colWidths = [10, 30, 30, 50, 30, 30, 50, 30];
    const startY = 40; // starting Y position for the table
    const rowHeight = 10; // height of each row
  
    // Add headers
    headers.forEach((header, index) => {
      doc.text(header, 20 + colWidths.slice(0, index).reduce((a, b) => a + b, 0), startY); // Positioning
    });
  
    // Add data rows
    data.forEach((row) => {
      const currentRowY = startY + (data.indexOf(row) + 1) * rowHeight; // Calculate current row Y position
      row.forEach((cell, index) => {
        doc.text(String(cell), 20 + colWidths.slice(0, index).reduce((a, b) => a + b, 0), currentRowY); // Positioning
      });
    });
  
    // Save the PDF
    doc.save('return_products_list.pdf');
  };

  // Determine the current items for the page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedReturns.slice(indexOfFirstItem, indexOfLastItem);

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
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={downloadPDF}
          className='bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700 transition duration-200'
        >
          PDF GENERATE
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
          onChange={(e) => setFromDate(e.target.value.replace(/[a-zA-Z]/g, ''))} // Clean unwanted letters
        />
        <input
          type="date"
          className="border rounded p-2"
          value={toDate}
          onChange={(e) => setToDate(e.target.value.replace(/[a-zA-Z]/g, ''))} // Clean unwanted letters
        />
      </div>

     
      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto">
          <table className='min-w-full border-collapse border border-gray-300'>
            <thead>
              <tr className='bg-gray-200'>
                <th className='border px-4 py-2 cursor-pointer' onClick={() => setSortConfig({ key: 'productId', direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending' })}>Product ID</th>
                <th className='border px-4 py-2 cursor-pointer' onClick={() => setSortConfig({ key: 'orderId', direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending' })}>Order ID</th>
                <th className='border px-4 py-2 hidden md:table-cell cursor-pointer' onClick={() => setSortConfig({ key: 'reason', direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending' })}>Reason</th>
                <th className='border px-4 py-2 hidden md:table-cell cursor-pointer' onClick={() => setSortConfig({ key: 'refundAmount', direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending' })}>Refund Amount</th>
                <th className='border px-4 py-2 hidden md:table-cell cursor-pointer' onClick={() => setSortConfig({ key: 'returnDate', direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending' })}>Return Date</th>
                <th className='border px-4 py-2'>Email</th>
                <th className='border px-4 py-2'>Actions</th>
                <th className='border px-4 py-2'>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((returnProduct, index) => (
                <tr key={returnProduct._id}>
                  <td className='border px-4 py-2'>{returnProduct.productId}</td>
                  <td className='border px-4 py-2'>{returnProduct.orderId}</td>
                  <td className='border px-4 py-2 hidden md:table-cell'>{returnProduct.reason}</td>
                  <td className='border px-4 py-2 hidden md:table-cell'>{returnProduct.refundAmount}</td>
                  <td className='border px-4 py-2 hidden md:table-cell'>
                    {new Date(returnProduct.returnDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </td>
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
          {/* Display total refund amount */}
          <div className="mt-4 text-right font-semibold">
            Total Refund Amount: ${calculateTotalRefundAmount()}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            {Array.from({ length: Math.ceil(totalItems / itemsPerPage) }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 px-4 py-2 rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnProduct;     

