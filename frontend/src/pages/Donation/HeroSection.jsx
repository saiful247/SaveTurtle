import React, { useEffect, useState } from 'react';
import DonationBG from '../../images/donationbg.jpg'; 
import seatIMG from '../../images/seat.jpg'; 
import { Link } from 'react-router-dom';

// Previous hooks remain the same
const useTypingEffect = (text, speed = 150, startDelay = 500) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    setDisplayedText('');

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    if (!text) return;

    const startTimeout = setTimeout(() => {
      const intervalId = setInterval(() => {
        if (index < text.length) {
          setDisplayedText((prev) => text.substring(0, index + 1));
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, speed);

      return () => clearInterval(intervalId);
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(cursorInterval);
    };
  }, [text, speed, startDelay]);

  return { displayedText, showCursor };
};

const useInView = (options = {}) => {
  const [ref, setRef] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, options]);

  return [setRef, isVisible];
};

const HeroSection = () => {
  const { displayedText, showCursor } = useTypingEffect("Save Turtles, Protect Our Oceans!", 150);
  const [titleRef, titleVisible] = useInView({ threshold: 0.1 });

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-[20s]
                   hover:scale-110 transform-gpu"
        style={{
          backgroundImage: `url(${DonationBG})`,
          filter: "brightness(0.7)",
        }}
      />
      
      <div className="relative z-10 h-full flex flex-col justify-center items-start p-8 md:p-16 lg:p-24">
        <div className="max-w-2xl text-white">
          <h1 
            ref={titleRef}
            className={`text-4xl md:text-5xl font-bold mb-4 transition-all duration-700
                       ${titleVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
          >
            {displayedText}{showCursor ? '|' : ''}
          </h1>
          
          <h2 className="text-2xl md:text-3xl mb-6 text-teal-300 transition-all duration-500
                         transform hover:translate-x-2 hover:text-teal-200">
            Your Support Can Help Preserve Marine Life For Future Generations
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/donations/create">
              <button 
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-md text-lg
                         transition-all duration-300 transform hover:scale-105 hover:-translate-y-1
                         hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] active:scale-95"
              >
                Donate Now
              </button>
            </Link>
            
            <button
              onClick={() => window.location.href = 'tel:0767089489'}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md text-lg
                       transition-all duration-300 transform hover:scale-105 hover:-translate-y-1
                       hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] active:scale-95"
            >
              CALL: 0767089489
            </button>
          </div>
          
          <p className="mt-6 text-lg transition-all duration-300 hover:translate-x-2">
            Join our community in protecting sea turtles and their habitats. 
            Every contribution makes a difference in marine conservation.
          </p>
        </div>
      </div>
    </div>
  );
};

// Add keyframes for animations at the start of your CSS
const WhoWeAreSection = () => {
  const [sectionRef, inView] = useInView({ threshold: 0.1 });
  const [listItemsVisible, setListItemsVisible] = useState(false);

  useEffect(() => {
    if (inView) {
      // Delay setting listItemsVisible to true to create a stagger effect
      setTimeout(() => setListItemsVisible(true), 500);
    }
  }, [inView]);

  const listItems = [
    "Openly update supporters on projects and donation impacts.",
    "Work with experts for comprehensive conservation efforts.",
    "Cultivate targeted relationships to meet conservation needs.",
    "Ensure effective use of donations through thorough evaluations.",
    "Actively acknowledge and celebrate our donors through events and messages.",
    "Encourage donor feedback to improve our programs and strengthen relationships.",
    "Engage with experts for a well-rounded approach to sea turtle conservation.",
    "Develop targeted initiatives to strengthen relationships with our donors."
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-20 px-6 bg-blue-50 text-gray-800"
    >
      <div className="container mx-auto">
        <h2 className={`text-3xl font-bold text-center mb-8 text-teal-600 transition-all duration-700
                      ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Who We Are?
        </h2>
        <div className="flex flex-col lg:flex-row justify-center items-center">
          <div className="w-full lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0 lg:pr-8">
            <p className={`mb-4 transition-all duration-700 delay-300
                        ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              Save Sea Turtles is a dedicated community working towards the conservation of marine life and their habitats.
            </p>
            <ul className="list-disc list-inside space-y-2">
              {listItems.map((item, index) => (
                <li 
                  key={index}
                  className={`transition-all duration-500
                           ${listItemsVisible 
                             ? 'opacity-100 translate-x-0' 
                             : 'opacity-0 -translate-x-10'}`}
                  style={{ 
                    transitionDelay: `${(index * 100) + 500}ms`,
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full lg:w-1/3 overflow-hidden rounded-lg">
            <img 
              src={seatIMG} 
              alt="Sea turtle conservation" 
              className={`w-full h-full object-cover transition-all duration-700 transform
                       hover:scale-110 hover:rotate-2
                       ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

function App() {
  return (
    <div className="App">
      <HeroSection />
      <WhoWeAreSection />
    </div>
  );
}

export default App;