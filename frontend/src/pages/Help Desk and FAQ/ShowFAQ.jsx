import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import axios from "axios";
const ShowFAQ = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState("desc");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchFaqs = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:5555/faq");
                setFaqs(response.data.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setError(
                    "Failed to fetch FAQs. Please check console for more details."
                );
                setLoading(false);
            }
        };

        fetchFaqs();
    }, []);
    const sortedFaqs = [...faqs].sort((a, b) => {
        if (sortOrder === "asc") {
            return new Date(a.createdAt) - new Date(b.createdAt);
        } else {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });

    const filteredFaqs = sortedFaqs.filter((faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center relative">
            <div className="absolute top-0 left-0 p-6 flex items-center space-x-4">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Frequently Asked Questions
                </h1>
            </div>
            <div className="absolute top-4 right-4 flex space-x-4 items-center">
                <button
                    className={`px-4 py-2 bg-gray-300 rounded ${
                        sortOrder === "asc" && "bg-blue-500 text-white"
                    }`}
                    onClick={() => setSortOrder("asc")}
                >
                    Sort Ascending
                </button>
                <button
                    className={`px-4 py-2 bg-gray-300 rounded ${
                        sortOrder === "desc" && "bg-blue-500 text-white"
                    }`}
                    onClick={() => setSortOrder("desc")}
                >
                    Sort Descending
                </button>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by question"
                    className="px-4 py-2 border border-gray-300 rounded"
                />
            </div>

            {loading ? (
                <Spinner />
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="w-full max-w-4xl mt-12">
                    {filteredFaqs.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {filteredFaqs.map((faq) => (
                                <div
                                    key={faq._id}
                                    className="bg-white shadow-lg rounded-lg p-4 border border-gray-200"
                                >
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {faq.question}
                                    </h3>
                                    <p className="mt-2 text-gray-600">
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center min-h-[50vh]">
                            <p className="text-gray-600">No FAQs available.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ShowFAQ;
