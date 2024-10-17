import React, { useEffect, useState } from 'react';
import DonationBG from '../../images/donationbg.jpg'; 
import seatIMG from '../../images/seat.jpg'; 
import { Link } from 'react-router-dom';

const useTypingEffect = (text, speed) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index += 1;
      if (index === text.length) clearInterval(intervalId);
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return displayedText;
};

const HeroSection = () => {
  const typingText = useTypingEffect("Save Turtles, Protect Our Oceans!", 150);

  return (
    <div className="relative min-h-screen w-full">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{
          backgroundImage: `url(${DonationBG})`,
          filter: "brightness(0.7)"
        }}
      />
      <div className="relative z-10 h-full flex flex-col justify-center items-start p-8 md:p-16 lg:p-24">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 transition-transform duration-300 transform hover:scale-105">
            {typingText}
          </h1>
          
          <h2 className="text-2xl md:text-3xl mb-6 text-teal-300 transition-opacity duration-300 hover:opacity-80">
            Your Support Can Help Preserve Marine Life For Future Generations
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/donations/create">
              <button 
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-md text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Donate Now
              </button>
            </Link>
            
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              CALL: 0767089489
            </button>
          </div>
          
          <p className="mt-6 text-lg transition-transform duration-300 transform hover:scale-105">
            Join our community in protecting sea turtles and their habitats. 
            Every contribution makes a difference in marine conservation.
          </p>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <HeroSection />

      {/* About Us Section */}
      <section className="py-20 px-6 bg-blue-50 text-gray-800">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-teal-600 transition-transform duration-300 transform hover:scale-105">
            Who We Are?
          </h2>
          <div className="flex flex-col lg:flex-row justify-center items-center">
            <div className="w-full lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0 lg:pr-8">
              <p className="mb-4">
                Save Sea Turtles is a dedicated community working towards the conservation of marine life and their habitats.
              </p>
              <ul className="list-disc list-inside">
                {[
                  "Openly update supporters on projects and donation impacts.",
                  "Work with experts for comprehensive conservation efforts.",
                  "Cultivate targeted relationships to meet conservation needs.",
                  "Ensure effective use of donations through thorough evaluations.",
                  "Actively acknowledge and celebrate our donors through events and messages.",
                  "Encourage donor feedback to improve our programs and strengthen relationships.",
                  "Engage with experts for a well-rounded approach to sea turtle conservation.",
                  "Develop targeted initiatives to strengthen relationships with our donors."
                ].map((item, index) => (
                  <li key={index} className="transition-transform duration-300 transform hover:scale-105">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full lg:w-1/3">
              <img src={seatIMG} alt="Sea turtle conservation" className="rounded-lg shadow-md" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
