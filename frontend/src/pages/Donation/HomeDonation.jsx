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
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

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

  const totalDonors = useMemo(() => {
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

  const downloadAllPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('All Donations Report', 14, 20);

    const headers = ['ID', 'Donor Name', 'Email', 'Contact No', 'Amount', 'Date of Payment', 'Description'];

    const tableData = filteredDonations.map((donation) => [
      donation._id,
      donation.donorName,
      donation.email,
      donation.contactNo,
      `LKR ${donation.amount.toFixed(2)}`,
      donation.dateOfPayment
        ? new Date(donation.dateOfPayment).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        : 'N/A',
      donation.discription,
    ]);

    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 30 },
        2: { cellWidth: 40 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 25 },
      },
    });

    const totalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Total Amount: LKR ${totalAmount.toFixed(2)}`, 14, totalY);
    doc.text(`Total Donors: ${totalDonors}`, 14, totalY + 7);

    doc.save('all_donations_report.pdf');
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

  const sendEmail = async (email, status, donationId) => {
    try {
      await axios.post("http://localhost:5555/sendDonationEmail", { email, status });

      // Update the donations state to reflect the new approval status
      setDonations(prevDonations =>
        prevDonations.map(donation =>
          donation._id === donationId
            ? { ...donation, approvalStatus: status } // Assuming you have an `approvalStatus` field
            : donation
        )
      );

      alert(`Email successfully sent for ${status}!`);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email");
    }
  };

  return (
    <div className="p-6 bg-blue-50">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl text-teal-700">Donors List</h1>
        <Link to='/admin/dashboard'>
          <button className='bg-gray-500 text-white px-4 py-2 rounded-md'>
            Admin Dashboard
          </button>
        </Link>
      </div>

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

      <div className="mb-4 flex flex-col md:flex-row items-start md:items-center justify-end gap-2">
        <button
          onClick={downloadCSV}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Download All Donations (CSV)
        </button>
        <button
          onClick={downloadAllPDF}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
        >
          Generate All Donations PDF
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by donor name, email, contact, or amount..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded p-2 w-64"
        />
      </div>

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
                <th className="border px-4 py-2">Approval Status</th>
                <th className="border px-4 py-2">Approval</th>
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
                      {donation.approvalStatus ? donation.approvalStatus : 'Pending'} {/* Displaying approval status */}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <div className="mt-4 flex justify-center gap-x-4">
                        <button
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          onClick={() => sendEmail(donation.email, "recieved", donation._id)} // Passing the donation ID
                        >
                          Approve
                        </button>
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          onClick={() => sendEmail(donation.email, "not recieved", donation._id)} // Passing the donation ID
                        >
                          Disapprove
                        </button>
                      </div>
                    </td>
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
                  <td colSpan="12" className="text-center py-4">
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