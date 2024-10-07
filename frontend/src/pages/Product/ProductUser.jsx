import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import Spinner from '../../components/Spinner';

const ProductUser = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/productViews')
      .then((response) => {
        setProducts(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError('Failed to fetch products');
        setLoading(false);
      });
  }, []);

  // Filter products based on search query and category filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const handleClick = (product) => {
    // Navigate to the purchase form page with product data
    navigate(`/productViews/purchaseForm`, {
      state: {
        productName: product.name,
        productPrice: product.price,
        productCategory: product.category,
        productSize: product.size,
        productImage: product.imageUrl
      }
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Products</h1>

      {/* Search and Category Filter */}
      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by product name..."
          className="border rounded-md py-2 px-4 w-1/3"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border rounded-md py-2 px-4"
        >
          <option value="">All Categories</option>
          {[...new Set(products.map((product) => product.category))].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product._id} 
              onClick={() => handleClick(product)} // Use handleClick to navigate
              className="cursor-pointer"
            >
              <div className="bg-white shadow-md rounded-lg p-4">
                <div className="flex justify-center">
                  {product.imageUrl ? (
                    <img
                      src={`http://localhost:5555${product.imageUrl}`}
                      alt={product.name}
                      className="w-40 h-40 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-40 h-40 bg-gray-200 rounded-md flex items-center justify-center">
                      No Image
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold mt-4 text-center">{product.name}</h2>
                <p className="text-gray-600 text-center">LKR {product.price}</p>
                <p className="text-gray-500 text-center">{product.category}</p>
                <p className="text-gray-500 text-center">{product.size}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductUser;
