import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditPurchase = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentImage, setPaymentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  // These states will be populated from the existing purchase data
  const [productName, setProductName] = useState('');
  const [productSize, setProductSize] = useState('');
  const [productPrice, setProductPrice] = useState(0);

  useEffect(() => {
    const fetchPurchase = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5555/purchaseList/${id}`);
        const purchase = response.data;
        setCustomerName(purchase.customerName);
        setEmail(purchase.email);
        setPhone(purchase.phone);
        setAddress(purchase.address);
        setQuantity(purchase.quantity);
        setProductName(purchase.productName);
        setProductSize(purchase.productSize);
        setProductPrice(purchase.productPrice);
        setTotalPrice(purchase.totalPrice);
        setCurrentImageUrl(purchase.paymentSlipUrl);
      } catch (error) {
        console.error('Error fetching purchase:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchase();
  }, [id]);

  useEffect(() => {
    setTotalPrice(productPrice * quantity);
  }, [quantity, productPrice]);

  const handleImageChange = (e) => {
    setPaymentImage(e.target.files[0]);
  };

  const handleUpdatePurchase = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('customerName', customerName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('productName', productName);
    formData.append('quantity', quantity);
    formData.append('productSize', productSize);
    formData.append('productPrice', productPrice);
    formData.append('totalPrice', totalPrice);

    if (paymentImage) {
      formData.append('paymentImage', paymentImage);
    }

    setLoading(true);
    try {
      await axios.put(`http://localhost:5555/purchaseList/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
      navigate('/purchaseList');
    } catch (error) {
      setLoading(false);
      console.error('Error updating purchase:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Edit Purchase</h1>

      <div className="flex space-x-6">
        <div className="w-1/3">
          {currentImageUrl ? (
            <img
              src={`http://localhost:5555${currentImageUrl}`}
              alt="Current Payment Slip"
              className="w-full object-cover rounded-md mb-4"
            />
          ) : (
            <div className="w-full h-60 bg-gray-200 rounded-md flex items-center justify-center mb-4">
              No Image
            </div>
          )}

          <div className="mt-4">
            <p className="text-gray-600 text-lg">Product: {productName}</p>
            <p className="text-gray-500 text-lg">Size: {productSize}</p>
            <p className="text-gray-500 text-lg">Unit Price: LKR {productPrice}</p>
          </div>
        </div>

        <div className="w-2/3">
          <form onSubmit={handleUpdatePurchase}>
            <div className="mb-4">
              <label className="block text-lg font-semibold text-gray-600">Your Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-lg font-semibold text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-lg font-semibold text-gray-600">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-lg font-semibold text-gray-600">Delivery Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter your delivery address"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-lg font-semibold text-gray-600">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                min="1"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-lg font-semibold text-gray-600">Total Price</label>
              <input
                type="text"
                value={`LKR ${totalPrice}`}
                className="w-full px-4 py-2 border rounded-md bg-gray-100"
                disabled
              />
            </div>

            <div className="mb-4">
              <label className="block text-lg font-semibold text-gray-600">Update Payment Slip</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full text-gray-700 mt-2"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md w-1/3 hover:bg-blue-600"
              >
                Update Purchase
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPurchase;