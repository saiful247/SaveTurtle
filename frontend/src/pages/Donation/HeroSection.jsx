import React from 'react';
import DonationBG from '../../images/donationbg.jpg'; // Corrected file extension
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen w-full">
      {/* Hero background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{
          backgroundImage: `url(${DonationBG})`, // Use the imported DonationBG here
          filter: "brightness(0.7)"
        }}
      />
      
      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col justify-center items-start p-8 md:p-16 lg:p-24">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Save Turtles, Protect Our Oceans!
          </h1>
          
          <h2 className="text-2xl md:text-3xl mb-6 text-black">
            Your Support Can Help Preserve Marine Life For Future Generations
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/donations/create"> {/* Use Link for navigation */}
              <button 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md text-lg transition-colors"
              >
                Donate Now
              </button>
            </Link>
            
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg transition-colors"
            >
              CALL: 0767089489
            </button>
          </div>
          
          <p className="mt-6 text-lg">
            Join our community in protecting sea turtles and their habitats. 
            Every contribution makes a difference in marine conservation.
          </p>
          
        </div>
      </div>
    </div>
    
  );
};

export default HeroSection;
