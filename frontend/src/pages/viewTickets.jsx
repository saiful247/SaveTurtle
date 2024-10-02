import { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import axios from "axios";

const ViewTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    "http://localhost:5555/tickets"
                );
                setTickets(response.data);
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

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center relative">
            <div className="absolute top-0 left-0 p-6 flex items-center space-x-4">
                <BackButton />
                <h1 className="text-4xl font-semibold text-gray-800">
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
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket) => (
                                    <tr key={ticket.id} className="border-b">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {ticket.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {ticket.topic}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {ticket.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {ticket.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {ticket.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {ticket.description}
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
        </div>
    );
};

export default ViewTickets;
