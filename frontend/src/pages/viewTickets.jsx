import { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
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

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center relative">
            <div className="absolute top-0 left-0 p-6 flex items-center space-x-4">
                <BackButton />
                <h1 className="text-2xl font-semibold text-gray-800">
                    View Tickets
                </h1>
            </div>

            {loading ? (
                <Spinner />
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="w-full max-w-4xl mt-12">
                    {tickets.length > 0 ? (
                        <table className="table-auto w-full bg-white shadow-lg rounded-xl border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        ID
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
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket) => (
                                    <tr key={ticket._id} className="border-b">
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {ticket._id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {ticket.topic}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {ticket.description}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {ticket.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {ticket.status === "solved"
                                                ? "Solved"
                                                : "Unsolved"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 space-x-4">
                                            <button
                                                className="text-blue-500"
                                                onClick={() => {
                                                    setCurrentTicket(
                                                        ticket._id
                                                    );
                                                    setShowReplyOverlay(true);
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
                                                    setShowDeleteOverlay(true);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex items-center">
                            <p className="text-gray-600">
                                No tickets available.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Delete Confirmation Overlay */}
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

            {/* Reply Overlay */}
            {showReplyOverlay && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3>Reply to Ticket</h3>
                        <textarea
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <div className="flex space-x-4 mt-4">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={handleReplySubmit}
                            >
                                Send Reply
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
