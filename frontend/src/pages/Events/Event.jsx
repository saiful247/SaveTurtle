import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineDelete } from "react-icons/md";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DarkModeToggle from "../../components/DarkModeToggle";
import * as XLSX from "xlsx";

const EventProgramPage = () => {
  const [eventsPrograms, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [startDate, setStartDate] = useState(""); // Start date for filter
  const [endDate, setEndDate] = useState(""); // End date for filter

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5555/events")
      .then((response) => {
        setEvents(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  // const filteredEvents = eventsPrograms.filter((eventP) =>
  //   eventP.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   eventP.vanue.toLowerCase().includes(searchQuery.toLowerCase())
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
      (!start || eventDate >= start) && (!end || eventDate <= end);

    return matchesSearchQuery && isWithinDateRange;
  });

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Event Programs Data", 14, 16);

    const tableColumn = [
      "No.",
      "Event Name",
      "Venue",
      "Date",
      "Time",
      "Total Allocated Seats",
      "Price",
    ];
    const tableRows = [];

    filteredEvents.forEach((eventP, index) => {
      const eventData = [
        index + 1,
        eventP.eventName,
        eventP.vanue,
        eventP.date,
        eventP.time,
        eventP.allocatedPersonCount,
        eventP.price,
      ];
      tableRows.push(eventData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("events-data.pdf");
  };

  const downloadExcel = () => {
    const data = filteredEvents.map((eventP, index) => ({
      "No.": index + 1,
      "Event Name": eventP.eventName,
      Venue: eventP.vanue,
      Date: eventP.date,
      Time: eventP.time,
      "Total Allocated seats": eventP.allocatedPersonCount,
      Price: eventP.price,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "EventsData");
    XLSX.writeFile(workbook, "events-data.xlsx");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl my-8">Event List</h1>
        <div className="flex items-center gap-4">
          <Link to="/events/create">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Add Event
            </button>
          </Link>
          <Link to="/eventBookingList">
            <button className="bg-[#FF5D22] text-white px-4 py-2 rounded-md">
              Booking Management
            </button>
          </Link>
          <Link to="/admin/dashboard">
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md">
              Admin Dashboard
            </button>
          </Link>

          <DarkModeToggle />
        </div>
      </div>

      <div className="my-4">
        <h3 className="text-lg text-gray-600">
          Total Events: {filteredEvents.length}
        </h3>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by event name, vanue..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-500 px-4 py-2 w-full max-w-xs"
        />
        {/* New Filter */}
        <div>
          <label className="mr-2">From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-500 px-4 py-2"
          />
        </div>
        <div>
          <label className="mr-2">To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-500 px-4 py-2"
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={downloadPDF}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Download PDF
          </button>
          <button
            onClick={downloadExcel}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Download Excel
          </button>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <table className="w-full border-collapse">
          {" "}
          {/* Change to border-collapse for outlines */}
          <thead className="bg-gray-200">
            {" "}
            {/* Added light gray background */}
            <tr>
              <th className="border border-slate-600 p-2 text-left"></th>
              <th className="border border-slate-600 p-2 text-left max-md:hidden">
                Event Name
              </th>
              <th className="border border-slate-600 p-2 text-left max-md:hidden">
                Venue
              </th>{" "}
              {/* Fixed typo: "Vanue" to "Venue" */}
              <th className="border border-slate-600 p-2 text-left">Date</th>
              <th className="border border-slate-600 p-2 text-left">Time</th>
              <th className="border border-slate-600 p-2 text-left">
                Total Allocation
              </th>
              <th className="border border-slate-600 p-2 text-left">Price</th>
              <th className="border border-slate-600 p-2 text-left">
                Operations
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((eventP, index) => (
              <tr key={eventP._id} className="h-8 even:bg-gray-100">
                {" "}
                {/* Added alternating row color */}
                <td className="border border-slate-700 text-center p-2">
                  {index + 1}
                </td>
                <td className="border border-slate-700 text-center p-2">
                  {eventP.eventName}
                </td>
                <td className="border border-slate-700 text-center p-2 max-md:hidden">
                  {eventP.vanue}
                </td>
                <td className="border border-slate-700 text-center p-2">
                  {eventP.date}
                </td>
                <td className="border border-slate-700 text-center p-2">
                  {eventP.time}
                </td>
                <td className="border border-slate-700 text-center p-2">
                  {eventP.allocatedPersonCount}
                </td>
                <td className="border border-slate-700 text-center p-2">
                  {eventP.price}
                </td>
                <td className="border border-slate-700 text-center p-2">
                  <div className="flex justify-center gap-x-4">
                    <Link to={`/events/details/${eventP._id}`}>
                      <BsInfoCircle className="text-2xl text-green-800" />
                    </Link>
                    <Link to={`/events/edit/${eventP._id}`}>
                      <AiOutlineEdit className="text-2xl text-yellow-600" />
                    </Link>
                    <Link to={`/events/delete/${eventP._id}`}>
                      <MdOutlineDelete className="text-2xl text-red-600" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EventProgramPage;
