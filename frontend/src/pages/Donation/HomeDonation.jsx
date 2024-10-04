import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineDelete } from 'react-icons/md';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const HomeDonation = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState(''); // From date state
  const [toDate, setToDate] = useState('');     // To date state

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/donations')
      .then((response) => {
        setDonations(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      const matchesQuery =
        donation.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donation.contactNo.toString().includes(searchQuery) ||
        donation.amount.toString().includes(searchQuery) ||
        (donation.discription && donation.discription.toLowerCase().includes(searchQuery.toLowerCase()));

      const donationDate = donation.dateOfPayment ? new Date(donation.dateOfPayment) : null;

      const isWithinDateRange =
        (!fromDate || (donationDate && donationDate >= new Date(fromDate))) &&
        (!toDate || (donationDate && donationDate <= new Date(toDate)));

      return matchesQuery && isWithinDateRange;
    });
  }, [donations, searchQuery, fromDate, toDate]);

  // Calculate Total Donors and Total Amount
  const totalDonors = useMemo(() => {
    // If you want total donation entries:
    // return donations.length;

    // If you want unique donors:
    const uniqueDonors = new Set(donations.map(donation => donation.donorName));
    return uniqueDonors.size;
  }, [donations]);

  const totalAmount = useMemo(() => {
    return donations.reduce((total, donation) => total + Number(donation.amount), 0);
  }, [donations]);

  const downloadCSV = () => {
    const headers = ['ID', 'Donor Name', 'Email', 'Contact No', 'Amount', 'Date of Payment', 'Description'];

    const rows = donations.map((donation) => [
      donation._id,
      donation.donorName,
      donation.email,
      donation.contactNo,
      donation.amount,
      donation.dateOfPayment ? new Date(donation.dateOfPayment).toLocaleDateString('en-US') : 'N/A',
      donation.discription,
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'donations.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = (donation) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Donation Details', 14, 20);

    const headers = ['ID', 'Donor Name', 'Email', 'Contact No', 'Amount', 'Date of Payment', 'Description'];

    const tableData = [
      [
        donation._id,
        donation.donorName,
        donation.email,
        donation.contactNo,
        donation.amount,
        donation.dateOfPayment ? new Date(donation.dateOfPayment).toLocaleDateString('en-US') : 'N/A',
        donation.discription,
      ],
    ];

    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 30,
    });

    doc.save(`donation_${donation._id}.pdf`);
  };

  return (
    <div className="p-6 bg-blue-50">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl text-teal-700">Donors List</h1>
        <Link to="/donations/create">
          {/* Uncomment and style the button as needed */}
          {/* <button className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition duration-200">
            New Donor
          </button> */}
        </Link>
        <Link to='/admin/dashboard'>
          <button
            className='bg-gray-500 text-white px-4 py-2 rounded-md'
          >
            Admin Dashboard
          </button>
          </Link>
      </div>

      {/* Totals Section */}
      <div className="mb-4 flex space-x-8">
        <div className="bg-teal-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Donors</h2>
          <p className="text-2xl">{totalDonors}</p>
        </div>
        <div className="bg-teal-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Amount</h2>
          <p className="text-2xl">LKR {totalAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="mb-4 flex flex-col md:flex-row items-start md:items-center justify-end">
        <button
          onClick={downloadCSV}
          className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition duration-200 mr-2 mb-2 md:mb-0"
        >
          Download All Donations (CSV)
        </button>
        {/* Add more buttons if needed */}
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by donor name, email, contact, or amount..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded p-2 w-64"  // Adjusted width to 16rem (256px)
        />
      </div>

      {/* Date Range Filter */}
      <div className="mb-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div>
          <label className="block mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-auto">
          <table className="table-auto w-full border border-gray-300">
            <thead>
              <tr className="bg-teal-200">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Donor Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Contact No</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Date of Payment</th>
                <th className="border px-4 py-2">Payment Image</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Edit</th>
                <th className="border px-4 py-2">Delete</th>
                <th className="border px-4 py-2">Download PDF</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.length > 0 ? (
                filteredDonations.map((donation) => (
                  <tr key={donation._id} className="hover:bg-teal-100">
                    <td className="border px-4 py-2 text-center">{donation._id}</td>
                    <td className="border px-4 py-2 text-center">{donation.donorName}</td>
                    <td className="border px-4 py-2 text-center">{donation.email}</td>
                    <td className="border px-4 py-2 text-center">{donation.contactNo}</td>
                    <td className="border px-4 py-2 text-center">LKR {donation.amount.toFixed(2)}</td>
                    <td className="border px-4 py-2 text-center">
                      {donation.dateOfPayment
                        ? new Date(donation.dateOfPayment).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {donation.paymentImageUrl ? (
                        <a href={`http://localhost:5555${donation.paymentImageUrl}`} target="_blank" rel="noopener noreferrer">
                          <img
                            src={`http://localhost:5555${donation.paymentImageUrl}`}
                            alt="Payment"
                            className="h-16 w-16 object-cover rounded-md"
                          />
                        </a>
                      ) : (
                        <span className="text-sm text-gray-500">No Image</span>
                      )}
                    </td>
                    <td className="border px-4 py-2 text-center">{donation.discription}</td>
                    <td className="border px-4 py-2 text-center">
                      <Link to={`/donations/edit/${donation._id}`}>
                        <AiOutlineEdit className="text-yellow-600 text-2xl cursor-pointer" />
                      </Link>
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <Link to={`/donations/delete/${donation._id}`}>
                        <MdOutlineDelete className="text-red-600 text-2xl cursor-pointer" />
                      </Link>
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button onClick={() => downloadPDF(donation)} className="text-blue-600 text-xl">
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center py-4">
                    No donations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HomeDonation;
