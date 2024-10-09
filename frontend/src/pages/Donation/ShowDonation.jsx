// src/components/HomeDonation.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';

const HomeDonation = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5555/donations');
      setDonations(response.data.data);
    } catch (error) {
      console.error("Error fetching donations:", error);
      alert('Failed to fetch donations. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donation?")) return;

    try {
      await axios.delete(`http://localhost:5555/donations/${id}`);
      alert('Donation deleted successfully.');
      fetchDonations(); // Refresh the list
    } catch (error) {
      console.error("Error deleting donation:", error);
      alert('Failed to delete donation. Please check the console for details.');
    }
  };

  return (
    <div className='p-4'>
      <div className="flex justify-between items-center">
        <h1 className='text-3xl my-8'>Donation List</h1>
        <Link to='/donations/create'>
          <MdOutlineAddBox className='text-sky-800 text-4xl cursor-pointer' />
        </Link>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto">
          <table className='min-w-full bg-white border'>
            <thead>
              <tr>
                <th className='py-2 px-4 border-b'>No.</th>
                <th className='py-2 px-4 border-b'>Donor Name</th>
                <th className='py-2 px-4 border-b'>Email</th>
                <th className='py-2 px-4 border-b'>Contact No</th>
                <th className='py-2 px-4 border-b'>Amount</th>
                <th className='py-2 px-4 border-b'>Date of Payment</th>
                <th className='py-2 px-4 border-b'>Description</th>
                {/* <th className='py-2 px-4 border-b'>Receipt</th> */}
                <th className='py-2 px-4 border-b'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.length === 0 ? (
                <tr>
                  <td colSpan="9" className='text-center py-4'>
                    No donations found.
                  </td>
                </tr>
              ) : (
                donations.map((donation, index) => (
                  <tr key={donation._id} className='hover:bg-gray-100'>
                    <td className='py-2 px-4 border-b text-center'>{index + 1}</td>
                    <td className='py-2 px-4 border-b'>{donation.donorName}</td>
                    <td className='py-2 px-4 border-b'>{donation.email}</td>
                    <td className='py-2 px-4 border-b'>{donation.contactNo}</td>
                    <td className='py-2 px-4 border-b'>${donation.amount}</td>
                    <td className='py-2 px-4 border-b'>{new Date(donation.dateOfPayment).toLocaleDateString()}</td>
                    <td className='py-2 px-4 border-b'>{donation.description}</td>
                    <td className='py-2 px-4 border-b text-center'>
                      {donation.receiptOfPayment ? (
                        <a href={`http://localhost:5555${donation.receiptOfPayment}`} target="_blank" rel="noopener noreferrer">
                          <img src={`http://localhost:5555${donation.receiptOfPayment}`} alt="Receipt" className='w-16 h-16 object-cover rounded' />
                        </a>
                      ) : (
                        'No Receipt'
                      )}
                    </td>
                    <td className='py-2 px-4 border-b text-center'>
                      <div className='flex justify-center gap-x-2'>
                        <Link to={`/donations/details/${donation._id}`} title="View Details">
                          <BsInfoCircle className='text-green-600 text-xl cursor-pointer' />
                        </Link>
                        <Link to={`/donations/edit/${donation._id}`} title="Edit Donation">
                          <AiOutlineEdit className='text-yellow-600 text-xl cursor-pointer' />
                        </Link>
                        <button onClick={() => handleDelete(donation._id)} title="Delete Donation">
                          <MdOutlineDelete className='text-red-600 text-xl cursor-pointer' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HomeDonation;
