import { useState, useEffect } from "react";
import Spinner from "../../components/Spinner";
import axios from "axios";

const ViewTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState(null);
    const [showReplyOverlay, setShowReplyOverlay] = useState(false);
    const [currentTicket, setCurrentTicket] = useState(null);
    const [replyMessage, setReplyMessage] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    "http://localhost:5555/tickets"
                );
                setTickets(response.data.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setError(
                    "Failed to fetch tickets. Please check console for more details."
                );
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const handleDelete = async () => {
        if (ticketToDelete) {
            try {
                await axios.delete(
                    `http://localhost:5555/tickets/${ticketToDelete}`
                );
                setTickets((prev) =>
                    prev.filter((ticket) => ticket._id !== ticketToDelete)
                );
                setShowDeleteOverlay(false);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleReplySubmit = async () => {
        if (currentTicket && replyMessage.trim()) {
            try {
                await axios.post(
                    `http://localhost:5555/tickets/${currentTicket}/reply`,
                    {
                        message: replyMessage,
                    }
                );
                setTickets((prev) =>
                    prev.map((ticket) =>
                        ticket._id === currentTicket
                            ? { ...ticket, status: "solved" }
                            : ticket
                    )
                );
                setReplyMessage("");
                setShowReplyOverlay(false);
            } catch (error) {
                console.log(error);
            }
        }
    };
    const sortedTickets = [...tickets].sort((a, b) => {
        if (sortOrder === "asc") {
            return new Date(a.createdAt) - new Date(b.createdAt);
        } else {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });
    const filteredTickets = sortedTickets.filter((ticket) =>
        ticket.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center relative">
            <div className="absolute top-0 left-0 p-6 flex items-center space-x-4">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Manage Tickets
                </h1>
            </div>
            <div className="absolute top-4 right-4 flex space-x-4 items-center">
                <button
                    className={`px-4 py-2 bg-gray-300 rounded ${
                        sortOrder === "asc" && "bg-blue-500 text-white"
                    }`}
                    onClick={() => setSortOrder("asc")}
                >
                    Oldest
                </button>
                <button
                    className={`px-4 py-2 bg-gray-300 rounded ${
                        sortOrder === "desc" && "bg-blue-500 text-white"
                    }`}
                    onClick={() => setSortOrder("desc")}
                >
                    Latest
                </button>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name"
                    className="px-4 py-2 border border-gray-300 rounded"
                />
            </div>

            {loading ? (
                <Spinner />
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="w-full max-w-4xl mt-12">
                    {filteredTickets.length > 0 ? (
                        <table className="table-auto w-full bg-white shadow-lg rounded-xl border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Time Created
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Topic
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTickets.map((ticket) => (
                                    <tr key={ticket._id} className="border-b">
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {new Date(
                                                ticket.createdAt
                                            ).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {ticket.topic}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            <div className="max-h-16 overflow-hidden overflow-ellipsis">
                                                {ticket.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {ticket.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {ticket.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {ticket.phone}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {ticket.status === "solved"
                                                ? "Solved"
                                                : "Unsolved"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            <div className="flex flex-col space-y-2">
                                                <button
                                                    className="text-blue-500"
                                                    onClick={() => {
                                                        setCurrentTicket(
                                                            ticket._id
                                                        );
                                                        setShowReplyOverlay(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    Reply
                                                </button>
                                                <button
                                                    className="text-red-500"
                                                    onClick={() => {
                                                        setTicketToDelete(
                                                            ticket._id
                                                        );
                                                        setShowDeleteOverlay(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex items-center justify-center min-h-[50vh]">
                            <p className="text-gray-600">
                                No tickets available.
                            </p>
                        </div>
                    )}
                </div>
            )}
            {showDeleteOverlay && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3>Are you sure you want to delete this ticket?</h3>
                        <div className="flex space-x-4 mt-4">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={handleDelete}
                            >
                                Confirm
                            </button>
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded"
                                onClick={() => setShowDeleteOverlay(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showReplyOverlay && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3>Reply to Ticket</h3>
                        <textarea
                            className="w-full border border-gray-300 rounded p-2 mt-4"
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            placeholder="Type your reply here..."
                        ></textarea>
                        <div className="flex space-x-4 mt-4">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handleReplySubmit}
                            >
                                Submit Reply
                            </button>
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded"
                                onClick={() => setShowReplyOverlay(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewTickets;
