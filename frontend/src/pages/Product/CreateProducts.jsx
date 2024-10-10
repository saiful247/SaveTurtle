import React, { useState } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateProducts = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const predefinedCategories = ['T-shirts', 'Hoodies', 'Caps & Hats', 'Accessories'];

  const validateForm = () => {
    let formErrors = {};

    if (!name) {
      formErrors.name = 'Product name is required';
    }
    if (!description) {
      formErrors.description = 'Description is required';
    }
    if (!price) {
      formErrors.price = 'Price is required';
    } else if (price <= 0) {
      formErrors.price = 'Price must be a positive number';
    }
    if (!stockQuantity) {
      formErrors.stockQuantity = 'Stock quantity is required';
    } else if (stockQuantity <= 0) {
      formErrors.stockQuantity = 'Stock quantity must be a positive number';
    }
    if (!category) {
      formErrors.category = 'Category is required';
    }
    if (!size) {
      formErrors.size = 'Size is required';
    }
    if (!image) {
      formErrors.image = 'Product image is required';
    } else if (!['image/jpeg', 'image/png', 'image/jpg'].includes(image.type)) {
      formErrors.image = 'Only JPG and PNG images are allowed';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Clear image error if valid image selected
    if (file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setErrors((prevErrors) => ({ ...prevErrors, image: null }));
    }
  };

  const handleSaveProduct = () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stockQuantity', stockQuantity);
    formData.append('category', category);
    formData.append('size', size);
    if (image) {
      formData.append('image', image);
    }

    setLoading(true);
    axios
      .post('http://localhost:5555/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        setLoading(false);
        navigate('/products');
      })
      .catch((error) => {
        setLoading(false);
        alert('An error happened. Please check console');
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen bg-blue-100 p-8">
      {/* <BackButton /> */}
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-4xl font-bold mb-6 text-center text-sky-500">New Product</h1>
        {loading && <Spinner />}
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value) setErrors((prevErrors) => ({ ...prevErrors, name: null })); // Clear error
              }}
              className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (e.target.value) setErrors((prevErrors) => ({ ...prevErrors, description: null }));
              }}
              className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
              placeholder="Enter product description"
              rows="4"
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                if (e.target.value > 0) setErrors((prevErrors) => ({ ...prevErrors, price: null }));
              }}
              className={`w-full px-4 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
              placeholder="Enter product price"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Stock Quantity</label>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => {
                setStockQuantity(e.target.value);
                if (e.target.value > 0) setErrors((prevErrors) => ({ ...prevErrors, stockQuantity: null }));
              }}
              className={`w-full px-4 py-2 border ${errors.stockQuantity ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
              placeholder="Enter product quantity"
            />
            {errors.stockQuantity && <p className="text-red-500 text-sm mt-1">{errors.stockQuantity}</p>}
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (e.target.value) setErrors((prevErrors) => ({ ...prevErrors, category: null }));
              }}
              className={`w-full px-4 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
            >
              <option value="">Select a category</option>
              {predefinedCategories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Size</label>
            <input
              type="text"
              value={size}
              onChange={(e) => {
                setSize(e.target.value);
                if (e.target.value) setErrors((prevErrors) => ({ ...prevErrors, size: null }));
              }}
              className={`w-full px-4 py-2 border ${errors.size ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
              placeholder="Enter product size"
            />
            {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Product Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className={`w-full px-4 py-2 border ${errors.image ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          </div>
          <div>
            <button
              onClick={handleSaveProduct}
              className="w-full bg-sky-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-600 transition duration-300"
            >
              Save Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProducts;
