import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner';

const ShowReturn = () => {
  const [returnProduct, setReturnProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReturnProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/returns/${id}`);
        setReturnProduct(response.data);
      } catch (err) {
        setError('Failed to fetch return product details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReturnProduct();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this return?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5555/returns/${id}`);
      alert('Return deleted successfully.');
      navigate('/returns');  // Redirect to the list of returns after deletion
    } catch (err) {
      console.error('Failed to delete return:', err);
      alert('Failed to delete return.');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!returnProduct) {
    return <p className="text-center text-gray-500">No return data available.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6 text-sky-600">Return Details</h1>

      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-sky-500 text-white text-lg font-semibold p-4 text-center">
          Return ID: {returnProduct._id}
        </div>
        <div className="p-6 space-y-4">
          <ReturnInfo label="Product ID" value={returnProduct.productId || 'N/A'} />
          <ReturnInfo label="Order ID" value={returnProduct.orderId || 'N/A'} />
          <ReturnInfo label="Reason" value={returnProduct.reason || 'No reason provided'} />
          <ReturnInfo 
            label="Return Amount" 
            value={returnProduct.returnAmount ? `$${returnProduct.returnAmount}` : 'N/A'} 
          />
          <ReturnInfo
            label="Return Date"
            value={returnProduct.returnDate ? new Date(returnProduct.returnDate).toLocaleDateString() : 'N/A'}
          />
          <ReturnInfo
            label="Email"
            value={returnProduct.email || 'No email provided'}
          />
          <ReturnInfo
            label="Created At"
            value={returnProduct.createdAt ? new Date(returnProduct.createdAt).toLocaleString() : 'N/A'}
          />
          <ReturnInfo
            label="Last Updated At"
            value={returnProduct.updatedAt ? new Date(returnProduct.updatedAt).toLocaleString() : 'N/A'}
          />
        </div>

        {/* Only Delete Button */}
        <div className="flex justify-end p-4 bg-gray-100">
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ReturnInfo = ({ label, value }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className="text-gray-800">{value}</span>
  </div>
);

export default ShowReturn;
