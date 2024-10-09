import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GiTurtle } from 'react-icons/gi'; // Importing the turtle icon

const ViewSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get('http://localhost:5555/subscriptions/subscriptions');
        setSubscriptions(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleApprove = async (id) => {
    // APPORVE FUNCTION
    console.log(`Approved subscription with ID: ${id}`);
  };

  const handleReject = async (id) => {
    // REJECT FUNCTION
    console.log(`Rejected subscription with ID: ${id}`);
  };

  // Filter subscriptions based on the search term
  const filteredSubscriptions = subscriptions.filter((subscription) => 
    subscription.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading subscriptions...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-green-50 min-h-screen py-10 flex flex-col items-center">
      <h1 className="text-4xl text-center font-bold mb-10 flex items-center">
        <GiTurtle className="text-5xl mr-2 text-green-600" />
        User Subscriptions
      </h1>
      
      {/* Search Bar */}
      <div className="mb-5 w-full max-w-md">
        <input
          type="text"
          placeholder="Search by User ID, First Name, Last Name, or Email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 w-full" // Styling for the input
        />
      </div>

      <div className="overflow-x-auto w-full max-w-6xl">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-green-200">
              <th className="py-3 px-4 border text-left text-green-700">User ID</th>
              <th className="py-3 px-4 border text-left text-green-700">First Name</th>
              <th className="py-3 px-4 border text-left text-green-700">Last Name</th>
              <th className="py-3 px-4 border text-left text-green-700">Email</th>
              <th className="py-3 px-4 border text-left text-green-700">Payment Slip</th>
              <th className="py-3 px-4 border text-left text-green-700">Status</th>
              <th className="py-3 px-4 border text-left text-green-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscriptions.map((subscription) => (
              <tr key={subscription._id} className="hover:bg-green-100 transition-all">
                <td className="py-2 px-4 border">{subscription.userId}</td>
                <td className="py-2 px-4 border">{subscription.firstName}</td>
                <td className="py-2 px-4 border">{subscription.lastName}</td>
                <td className="py-2 px-4 border">{subscription.email}</td>
                <td className="py-2 px-4 border">
                  <a
                    href={`http://localhost:5555/${subscription.paymentSlip}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 underline"
                  >
                    View Payment Slip
                  </a>
                </td>
                <td className="py-2 px-4 border">{subscription.status}</td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => handleApprove(subscription._id)}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600 transition-all"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(subscription._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-all"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewSubscriptions;
