import React from 'react';
import { useNavigate } from 'react-router-dom';
import shopbg from '../../images/shopbg.jpg'; // Import the underwater background image

const LandingPage = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/productViews');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top banner */}
      <div className="bg-blue-900 text-white text-center py-2 text-sm">
        FREE STANDARD SHIPPING ON ORDERS OVER $75! USE CODE: SEATURTLE AT CHECKOUT
      </div>

      {/* Hero Section */}
      <div 
        className="flex-grow bg-cover bg-center relative" 
        style={{backgroundImage: `url(${shopbg})`}}
      >
        <div className="absolute inset-0 bg-blue-500 bg-opacity-30"></div>
        <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center h-full text-center relative z-10">
          <h1 className="text-6xl font-bold text-yellow-300 mb-4 shadow-text">SAVE TURTLES.LK</h1>
          <p className="text-3xl text-white mb-8 shadow-text">DIVE INTO OUR COLLECTION</p>
          <button 
            onClick={handleShopNow}
            className="bg-green-500 text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-green-600 transition duration-300 shadow-lg"
          >
            SHOP NOW
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-800 py-6 text-white">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg">DISCOVER THE WONDERS OF THE SEA</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;