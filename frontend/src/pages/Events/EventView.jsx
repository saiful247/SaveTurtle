import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Spinner from '../../components/Spinner';
import DarkModeToggle from '../../components/DarkModeToggle';

import b1 from '../../images/t1.webp';
import b2 from '../../images/t2.jpg';
import b3 from '../../images/t3.png';

const EventProgramPage = () => {
  const [eventsPrograms, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const images = [b1, b2, b3];

  const navigate = useNavigate(); // Initialize useNavigate
  const [startDate, setStartDate] = useState(''); // Start date for filter
  const [endDate, setEndDate] = useState(''); // End date for filter

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5555/eventViews')
      .then((response) => {
        setEvents(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  useEffect(() => {
    const isDarkMode = document.body.classList.contains('dark');
    setDarkMode(isDarkMode);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          setDarkMode(document.body.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.body, { attributes: true });

    return () => observer.disconnect(); // Clean up on component unmount
  }, []);

  // const filteredEvents = eventsPrograms.filter((eventP) =>
  //   eventP.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  const filteredEvents = eventsPrograms.filter((eventP) => {
    const matchesSearchQuery = 
      eventP.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eventP.vanue.toLowerCase().includes(searchQuery.toLowerCase());

    // Convert eventDate and startDate/endDate to Date objects for comparison
    const eventDate = new Date(eventP.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Check if eventDate falls within the selected date range
    const isWithinDateRange =
      (!start || eventDate >= start) &&
      (!end || eventDate <= end);

    return matchesSearchQuery && isWithinDateRange;
  });

  const handleClick = (event) => {
    // Navigate to the event participants page with event data
    navigate(`/eventViews/eventParticipants`, { 
      state: { 
        eventName: event.eventName, 
        eventDate: event.date, 
        ticketPrice: event.price 
      } 
    });
  };

  return (
    <div className='p-4'>
      <div className="my-4">
        <img src={images[currentImage]} alt={`Slide ${currentImage + 1}`} className="w-full h-80 object-cover rounded-md shadow-md" />
      </div>
  
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-3xl my-8 ${darkMode ? 'text-white' : 'text-black'}`}>Event List</h1>
        <div className="flex items-center gap-4">
          <DarkModeToggle />
        </div>
      </div>
  
      <div className={`bg-[#F9F6F0] p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className='flex justify-between items-center mb-4'>
          <input
            type='text'
            placeholder='Search by event name, Venue...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`border border-gray-500 px-4 py-2 w-full max-w-xs rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
          />
          {/* New Filter with reduced gap */}
          <div className="flex items-center gap-2 ml-4">
            <div>
              <label className="mr-1">From:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`border border-gray-500 px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              />
            </div>
            <div>
              <label className="mr-1">To:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`border border-gray-500 px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              />
            </div>
          </div>
        </div>
  
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-[#F9F6F0]">
            {filteredEvents.map((eventP) => (
              <div
                key={eventP._id}
                onClick={() => handleClick(eventP)} // Add onClick handler to navigate with event data
                className={`p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
              >
                <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>{eventP.eventName}</h2>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>Venue:</strong> {eventP.vanue}
                </p>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>Date:</strong> {eventP.date}
                </p>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>Time:</strong> {eventP.time}
                </p>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>Price:</strong> {eventP.price}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  
};

export default EventProgramPage;
