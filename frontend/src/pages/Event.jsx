import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DarkModeToggle from "../components/DarkModeToggle";
import * as XLSX from "xlsx";

const EventProgramPage = () => {
    const [eventsPrograms, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredEvents = eventsPrograms.filter((eventP) =>
        eventP.eventName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Event Programs Data", 14, 16);

        const tableColumn = [
            "No.",
            "Event Name",
            "Venue",
            "Date",
            "Time",
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
                        <button className="bg-gray-500 text-white px-4 py-2 rounded-md">
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
                    placeholder="Search by event name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-gray-500 px-4 py-2 w-full max-w-xs"
                />
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
                <table className="w-full border-separate border-spacing-2">
                    <thead>
                        <tr>
                            <th className="border border-slate-600 rounded-md"></th>
                            <th className="border border-slate-600 rounded-md max-md:hidden">
                                Event Name
                            </th>
                            <th className="border border-slate-600 rounded-md max-md:hidden">
                                Vanue
                            </th>
                            <th className="border border-slate-600 rounded-md">
                                Date
                            </th>
                            <th className="border border-slate-600 rounded-md">
                                Time
                            </th>
                            <th className="border border-slate-600 rounded-md">
                                Price
                            </th>
                            <th className="border border-slate-600 rounded-md">
                                Operations
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.map((eventP, index) => (
                            <tr key={eventP._id} className="h-8">
                                <td className="border border-slate-700 rounded-md text-center">
                                    {index + 1}
                                </td>
                                <td className="border border-slate-700 rounded-md text-center">
                                    {eventP.eventName}
                                </td>
                                <td className="border border-slate-700 rounded-md text-center max-md:hidden">
                                    {eventP.vanue}
                                </td>
                                <td className="border border-slate-700 rounded-md text-center max-md:hidden">
                                    {eventP.date}
                                </td>
                                <td className="border border-slate-700 rounded-md text-center max-md:hidden">
                                    {eventP.time}
                                </td>
                                <td className="border border-slate-700 rounded-md text-center max-md:hidden">
                                    {eventP.price}
                                </td>
                                <td className="border border-slate-700 rounded-md text-center">
                                    <div className="flex justify-center gap-x-4">
                                        <Link
                                            to={`/events/details/${eventP._id}`}
                                        >
                                            <BsInfoCircle className="text-2xl text-green-800" />
                                        </Link>
                                        <Link to={`/events/edit/${eventP._id}`}>
                                            <AiOutlineEdit className="text-2xl text-yellow-600" />
                                        </Link>
                                        <Link
                                            to={`/events/delete/${eventP._id}`}
                                        >
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
