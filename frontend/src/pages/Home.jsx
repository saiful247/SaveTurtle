import React from 'react';
import { Link } from 'react-router-dom';

const UnderConstruction = () => {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white"
      style={{
        backgroundImage: `url('https://www.toptal.com/designers/subtlepatterns/patterns/concrete-wall.png')`, // Subtle, tech-related background
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h1 className="text-5xl font-mono mb-6">Page Under Construction</h1>
      <p className="text-lg font-mono mb-10">
        Will get it ready for ITP 100% evaluation.
      </p>

      <Link to="/createtickets">
        <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md transition duration-300">
          Contact Us
        </button>
      </Link>
    </div>
  );
};

export default UnderConstruction;
