import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CreatePurchase = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+94 7');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentImage, setPaymentImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Pre-fill product data from state
  const productName = state?.productName || '';
  const productSize = state?.productSize || '';
  const productPrice = state?.productPrice || 0;
  const productImage = state?.productImage || '';

  // Calculate total price when quantity changes
  useEffect(() => {
    setTotalPrice(productPrice * quantity);
  }, [quantity, productPrice]);

  const handleImageChange = (e) => {
    setPaymentImage(e.target.files[0]);
  };

  // Validate form data
  const validate = () => {
    const newErrors = {};
    if (!customerName) newErrors.customerName = "Customer name is required.";
    if (!email) newErrors.email = "Email is required.";
    if (!phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\+94 7\d{8}$/.test(phone)) {
      newErrors.phone = "Phone number must be in the format +94 7XXXXXXXX.";
    }
    if (!address) newErrors.address = "Address is required.";
    if (!paymentImage) newErrors.paymentImage = "Payment slip image is required.";
    if (quantity <= 0) newErrors.quantity = "Quantity must be greater than 0.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value;

    // Allow only numbers after the default "+94 7" and restrict to 8 additional digits
    if (input.startsWith('+94 7') && /^\+94 7\d{0,8}$/.test(input)) {
      setPhone(input);
    }
  };

  const handleSavePurchase = (e) => {
    e.preventDefault();
    if (!validate()) return; // If validation fails, don't proceed

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
      formData.append('image', paymentImage);
    }

    setLoading(true);
    axios
      .post('http://localhost:5555/productViews/purchaseForm', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        setLoading(false);
        navigate('/productViews');
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please check the console');
        console.log(error);
      });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Purchase Product</h1>

      <div className="flex space-x-6">
        <div className="w-1/3">
          {productImage ? (
            <img
              src={`http://localhost:5555${productImage}`}
              alt={productName}
              className="w-full object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-60 bg-gray-200 rounded-md flex items-center justify-center">
              No Image
            </div>
          )}

          <div className="mt-4">
            <p className="text-gray-600 text-lg">Product: {productName}</p>
            <p className="text-gray-500 text-lg">Size: {productSize}</p>
            <p className="text-gray-500 text-lg">Quantity Price: LKR {productPrice}</p>
          </div>
        </div>

        <div className="w-2/3">
          <form onSubmit={handleSavePurchase}>
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
              {errors.customerName && <p className="text-red-600">{errors.customerName}</p>}
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
              {errors.email && <p className="text-red-600">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-lg font-semibold text-gray-600">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="+94 7XXXXXXXX"
                required
              />
              {errors.phone && <p className="text-red-600">{errors.phone}</p>}
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
              {errors.address && <p className="text-red-600">{errors.address}</p>}
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
              {errors.quantity && <p className="text-red-600">{errors.quantity}</p>}
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
              <label className="block text-lg font-semibold text-gray-600">Upload Payment Slip</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full text-gray-700 mt-2"
                required
              />
              {errors.paymentImage && <p className="text-red-600">{errors.paymentImage}</p>}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md w-1/3 hover:bg-blue-600"
              >
                Confirm Purchase
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchase;
