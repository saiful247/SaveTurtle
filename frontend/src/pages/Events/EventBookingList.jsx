import { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner'; // Ensure this component exists
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import {  MdOutlineDelete } from 'react-icons/md';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DarkModeToggle from '../../components/DarkModeToggle'; // Ensure this component exists
import * as XLSX from 'xlsx';
import { QRCodeCanvas } from 'qrcode.react';

// import { Pie } from 'react-chartjs-2';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

// ChartJS.register(ArcElement, Tooltip, Legend);

const EventBookData = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChart, setShowChart] = useState(false); // For toggling pie chart view

  const [startDate, setStartDate] = useState(''); // Start date for filter
  const [endDate, setEndDate] = useState(''); // End date for filter

  // Fetch participants data on component mount
  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5555/eventBookingList'); // Replace with your backend URL
        setParticipants(response.data.data);
      } catch (error) {
        console.error('Error fetching participants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  // Filter participants based on search query
  // const filteredParticipants = participants.filter((participant) =>
  //   participant.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   String(participant.phone).toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   participant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   participant.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  // Filter participants based on search query and date range
  const filteredParticipants = participants.filter((participant) => {
    const matchesSearchQuery = 
      participant.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(participant.phone).toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.eventName.toLowerCase().includes(searchQuery.toLowerCase());

    // Convert eventDate and startDate/endDate to Date objects for comparison
    const eventDate = new Date(participant.eventDate);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Check if eventDate falls within the selected date range
    const isWithinDateRange =
      (!start || eventDate >= start) &&
      (!end || eventDate <= end);

    return matchesSearchQuery && isWithinDateRange;
  });


  // Total bookings count
  const totalBookings = filteredParticipants.length;

  // Calculate total amount from ticket prices
  const totalAmount = filteredParticipants.reduce((sum, participant) => sum + parseFloat(participant.ticketPrice), 0);

  // Function to download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Event Booking Data', 14, 16);
    
    const tableColumn = ['No.', 'Participant Name', 'Gender', 'Phone', 'Email', 'Event Name', 'Event Date', 'Ticket Price'];
    const tableRows = [];

    filteredParticipants.forEach((participant, index) => {
      const participantData = [
        index + 1,
        participant.participantName,
        participant.gender,
        participant.phone,
        participant.email,
        participant.eventName,
        participant.eventDate,
        `$${participant.ticketPrice}`,
      ];
      tableRows.push(participantData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('events-booking-data.pdf');
  };

  // Function to download Excel
  const downloadExcel = () => {
    const data = filteredParticipants.map((participant, index) => ({
      'No.': index + 1,
      'Participant Name': participant.participantName,
      'Gender': participant.gender,
      'Phone': participant.phone,
      'Email': participant.email,
      'Event Name': participant.eventName,
      'Event Date': participant.eventDate,
      'Ticket Price': `$${participant.ticketPrice}`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'EventsBookingData');
    XLSX.writeFile(workbook, 'events-booking-data.xlsx');
  };

  //QR code
  const downloadQRCode = (book) => {
    const canvas = document.getElementById(`qr-canvas-${book._id}`);
    const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${book.title}_QRCode.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
};

//Email
// Function to handle email sending
const sendEmail = async (email, status) => {
  try {
    await axios.post('http://localhost:5555/sendEmail', { email, status });
    alert(`Email successfully sent for ${status}!`);
  } catch (error) {
    console.error('Error sending email:', error);
    alert('Failed to send email');
  }
};

// Function to prepare data for the pie chart
const getChartData = () => {
  const data = {};
  filteredParticipants.forEach(participant => {
    if (data[participant.eventName]) {
      data[participant.eventName] += 1; // Increment count for the event
    } else {
      data[participant.eventName] = 1; // Initialize count
    }
  });
  return Object.entries(data).map(([name, value]) => ({ name, value })); // Convert to array format
};

// Handle Analyze Data button click
const handleAnalyzeData = () => {
  setShowChart(true); // Show the pie chart when the button is clicked
};


  return (
    <div className='p-4'>
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className='text-3xl my-8'>Event Participant List</h1>
        <div className="flex items-center gap-4">
          <Link to='/eventViews'>
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded-md'
          >
            Add Booking
          </button>
          </Link>
          <Link to='/events'>
          <button
            className='bg-gray-500 text-white px-4 py-2 rounded-md'
          >
            Event Management
          </button>
          </Link>
          <Link to='/admin/dashboard'>
          <button
            className='bg-gray-500 text-white px-4 py-2 rounded-md'
          >
            Admin Dashboard
          </button>
          </Link>
          <DarkModeToggle/>
        </div>
      </div>

      {/* Total Bookings Count */}
      <div className="my-4">
        <h3 className="text-lg text-gray-600">Total Bookings: {totalBookings}</h3>
        <h3 className="text-lg text-gray-600">Total Amount: LKR {totalAmount.toFixed(2)}</h3> {/* Display Total Amount */}
      </div>

      {/* Search and Download Buttons */}
      <div className='flex justify-between items-center mb-4'>
        <input
          type='text'
          placeholder='Search by participant name...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='border border-gray-500 px-4 py-2 w-full max-w-xs'
        />
        {/* New Filter */}
        <div>
            <label className="mr-2">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className='border border-gray-500 px-4 py-2'
            />
          </div>
          <div>
            <label className="mr-2">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className='border border-gray-500 px-4 py-2'
            />
          </div>
        <div className="flex gap-4">
        <button
            onClick={handleAnalyzeData}
            className='bg-[#D6C41C] text-white px-4 py-2 rounded-md'
          >
            
            Analyze Data
          </button>
          <button
            onClick={downloadPDF}
            className='bg-blue-500 text-white px-4 py-2 rounded-md'
          >
            Download PDF
          </button>
          <button
            onClick={downloadExcel}
            className='bg-green-500 text-white px-4 py-2 rounded-md'
          >
            Download Excel
          </button>
        </div>
      </div>
      {showChart && (
        <div className="my-4">
          <h3 className="text-lg font-bold">Event Bookings Distribution</h3>
          <PieChart width={400} height={400}> {/* Adjusted size for better visibility */}
            <Pie
              dataKey="value"
              isAnimationActive={false}
              data={getChartData()}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              labelLine={false} // Disable default label line
              label={({ name, value }) => `${name} (${value})`} // Custom label
            >
              {getChartData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${name}: ${value}`, 'Count']} />
          </PieChart>
        </div>
      )}
      {/* Loading Spinner */}
      {loading ? (
        <Spinner />
      ) : (
        <>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participant Name
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Date
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket Price
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Image
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket QR
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approval
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operations
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredParticipants.length > 0 ? (
                filteredParticipants.map((participant, index) => (
                  <tr key={participant._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {participant.participantName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {participant.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {participant.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {participant.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {participant.eventName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {participant.eventDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      LKR {participant.ticketPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {participant.paymentImageUrl ? (
                        <a href={`http://localhost:5555${participant.paymentImageUrl}`} target="_blank" rel="noopener noreferrer">
                          <img
                            src={`http://localhost:5555${participant.paymentImageUrl}`} // Adjust if necessary
                            alt="Payment"
                            className="h-16 w-16 object-cover rounded-md"
                          />
                        </a>
                      ) : (
                        <span className="text-sm text-gray-500">No Image</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="mt-4 flex flex-col items-center">
                                    <QRCodeCanvas
                                        id={`qr-canvas-${participant._id}`}
                                        value={`Event Name: ${participant.eventName},Participant Name: ${participant.participantName}, Gender: ${participant.gender}, Phone: ${participant.phone}, ID: ${participant._id},Email: ${participant.email},Event Date: ${participant.eventDate},Ticket Price: ${participant.ticketPrice}`}
                                        size={128}
                                        bgColor={"#ffffff"}
                                        fgColor={"#000000"}
                                        level={"H"}
                                        includeMargin={true}
                                    />
                                    <button
                                        onClick={() => downloadQRCode(participant)}
                                        className="mt-2 text-blue-600 hover:text-blue-800"
                                    >
                                        Download QR
                                    </button>
                                </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="mt-4 flex justify-center gap-x-4">
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        onClick={() => sendEmail(participant.email, 'approved')} // On Approve, send approval email
                      >
                        Approve
                      </button>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        onClick={() => sendEmail(participant.email, 'disapproved')} // On Disapprove, send disapproval email
                      >
                        Disapprove
                      </button>
                    </div>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className='flex justify-center gap-x-4'>
                        <Link to={`/eventBookingList/edit/${participant._id}`}>
                          <AiOutlineEdit className='text-2xl text-yellow-600'/>
                        </Link>
                        <Link to={`/eventBookingList/delete/${participant._id}`}>
                          <MdOutlineDelete className='text-2xl text-red-600'/>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-6 py-4 text-center text-sm text-gray-500">
                    No participants found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
};

export default EventBookData;
