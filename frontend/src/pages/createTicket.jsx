import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import axios from "axios";

const CreateTickets = () => {
    const [topic, setTopic] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleTicketSubmission = () => {
        const data = {
            topic,
            description,
            name,
            phone,
            email,
        };

        setLoading(true);
        axios
            .post("http://localhost:5555/tickets", data)
            .then(() => {
                setLoading(false);
                setIsSuccess(true);
            })
            .catch((error) => {
                setLoading(false);
                alert("An error happened. Please check console");
                console.log(error);
            });
    };

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                setIsSuccess(false);
            }, 3000); // Overlay will disappear after 3 seconds

            return () => clearTimeout(timer); // Cleanup the timer
        }
    }, [isSuccess]);

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center relative">
            <div className="absolute top-0 left-0 p-6 flex items-center space-x-4">
                <BackButton />
                <h1 className="text-4xl font-semibold text-gray-800">
                    Create Ticket
                </h1>
            </div>

            <div className="absolute top-0 right-0 p-6">
                <Link
                    to="/faq"
                    className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition duration-200"
                >
                    FAQ
                </Link>
            </div>

            {loading ? <Spinner /> : null}
            <div className="bg-white shadow-lg rounded-xl border border-gray-200 w-full max-w-md p-6">
                <div className="my-4">
                    <label className="text-lg font-medium text-gray-700">
                        Topic
                    </label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="Enter topic"
                    />
                </div>
                <div className="my-4">
                    <label className="text-lg font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="Enter description"
                        rows="6"
                    />
                </div>
                <div className="my-4">
                    <label className="text-lg font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="Enter your name"
                    />
                </div>
                <div className="my-4">
                    <label className="text-lg font-medium text-gray-700">
                        Phone
                    </label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="Enter phone number"
                    />
                </div>
                <div className="my-4">
                    <label className="text-lg font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        placeholder="Enter email address"
                    />
                </div>
                <button
                    className="w-full py-3 mt-6 text-white bg-sky-500 rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition duration-200"
                    onClick={handleTicketSubmission}
                >
                    {loading ? "Saving..." : "Save"}
                </button>
            </div>

            {/* Success Overlay */}
            {isSuccess && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white text-center p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Ticket Created Successfully!
                        </h2>
                        <p className="text-gray-600">
                            Your ticket has been submitted and will be processed
                            shortly.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateTickets;
