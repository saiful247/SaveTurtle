import { useState, useEffect } from "react";
import Spinner from "../../components/Spinner";
import axios from "axios";

const FaqDashboard = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
    const [showEditOverlay, setShowEditOverlay] = useState(false);
    const [faqToEdit, setFaqToEdit] = useState(null);
    const [faqToDelete, setFaqToDelete] = useState(null);
    const [showNewFaqOverlay, setShowNewFaqOverlay] = useState(false);
    const [newQuestion, setNewQuestion] = useState("");
    const [newAnswer, setNewAnswer] = useState("");
    const [editQuestion, setEditQuestion] = useState("");
    const [editAnswer, setEditAnswer] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchFaqs();
    }, []);

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

    const handleDelete = async () => {
        if (faqToDelete) {
            try {
                await axios.delete(`http://localhost:5555/faq/${faqToDelete}`);
                await fetchFaqs(); // Refresh the FAQ list
                setShowDeleteOverlay(false);
                setFaqToDelete(null);
            } catch (error) {
                console.log(error);
                setError("Failed to delete FAQ. Please try again.");
            }
        }
    };

    const handleNewFaqSubmit = async () => {
        if (newQuestion.trim() && newAnswer.trim()) {
            try {
                await axios.post("http://localhost:5555/faq", {
                    question: newQuestion,
                    answer: newAnswer,
                });
                await fetchFaqs(); // Refresh the FAQ list
                setNewQuestion("");
                setNewAnswer("");
                setShowNewFaqOverlay(false);
            } catch (error) {
                console.log("Error creating FAQ:", error);
                setError("Failed to create FAQ. Please try again.");
            }
        } else {
            setError("Question and Answer fields cannot be empty.");
        }
    };

    const handleEdit = (faq) => {
        setFaqToEdit(faq._id);
        setEditQuestion(faq.question);
        setEditAnswer(faq.answer);
        setShowEditOverlay(true);
    };

    const handleEditSubmit = async () => {
        if (editQuestion.trim() && editAnswer.trim()) {
            try {
                await axios.put(`http://localhost:5555/faq/${faqToEdit}`, {
                    question: editQuestion,
                    answer: editAnswer,
                });
                await fetchFaqs(); // Refresh the FAQ list
                setShowEditOverlay(false);
                setFaqToEdit(null);
            } catch (error) {
                console.log("Error editing FAQ:", error);
                setError("Failed to edit FAQ. Please try again.");
            }
        } else {
            setError("Question and Answer fields cannot be empty.");
        }
    };

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
                    Manage FAQs
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
                                    <div className="flex justify-end space-x-4 mt-4">
                                        <button
                                            className="text-blue-500"
                                            onClick={() => handleEdit(faq)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-500"
                                            onClick={() => {
                                                setFaqToDelete(faq._id);
                                                setShowDeleteOverlay(true);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
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

            {showDeleteOverlay && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3>Are you sure you want to delete this FAQ?</h3>
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

            {showEditOverlay && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3>Edit FAQ</h3>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded p-2 mt-4"
                            value={editQuestion}
                            onChange={(e) => setEditQuestion(e.target.value)}
                            placeholder="Enter question"
                        />
                        <textarea
                            className="w-full border border-gray-300 rounded p-2 mt-4"
                            value={editAnswer}
                            onChange={(e) => setEditAnswer(e.target.value)}
                            placeholder="Enter answer"
                        ></textarea>
                        <div className="flex space-x-4 mt-4">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handleEditSubmit}
                            >
                                Submit
                            </button>
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded"
                                onClick={() => setShowEditOverlay(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showNewFaqOverlay && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3>Create New FAQ</h3>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded p-2 mt-4"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Enter question"
                        />
                        <textarea
                            className="w-full border border-gray-300 rounded p-2 mt-4"
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            placeholder="Enter answer"
                        ></textarea>
                        <div className="flex space-x-4 mt-4">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handleNewFaqSubmit}
                            >
                                Submit
                            </button>
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded"
                                onClick={() => setShowNewFaqOverlay(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                className="fixed bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg"
                onClick={() => setShowNewFaqOverlay(true)}
            >
                New FAQ
            </button>
        </div>
    );
};

export default FaqDashboard;
