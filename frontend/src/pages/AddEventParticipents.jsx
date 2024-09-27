import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import axios from "axios";

const CreateEventsParticipent = () => {
    const navigate = useNavigate();
    const { state } = useLocation(); // Access the passed state (event data)
    const [participantName, setParticipentName] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [paymentImage, setPaymentImage] = useState(null); // Add state for image file
    const [loading, setLoading] = useState(false);

    // Pre-fill event data from state
    const eventName = state?.eventName || "";
    const eventDate = state?.eventDate || "";
    const ticketPrice = state?.ticketPrice || "";

    const handleImageChange = (e) => {
        setPaymentImage(e.target.files[0]);
    };

    const handleSaveEventParticipent = () => {
        const formData = new FormData(); // Create FormData to include the image
        formData.append("participantName", participantName);
        formData.append("gender", gender);
        formData.append("phone", phone);
        formData.append("email", email);
        formData.append("eventName", eventName);
        formData.append("eventDate", eventDate);
        formData.append("ticketPrice", ticketPrice);

        if (paymentImage) {
            formData.append("paymentImage", paymentImage); // Add the image file if it's selected
        }

        setLoading(true);
        axios
            .post(
                "http://localhost:5555/eventViews/eventParticipants",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", // Ensure multipart/form-data for file uploads
                    },
                }
            )
            .then(() => {
                setLoading(false);
                navigate("/eventViews");
            })
            .catch((error) => {
                setLoading(false);
                alert("An error happened. Please check console");
                console.log(error);
            });
    };

    return (
        <div className="p-4">
            <BackButton />
            <h1 className="text-3xl my-4">Event Participant Details</h1>
            {loading ? <Spinner /> : ""}

            <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500">
                        Participant Name
                    </label>
                    <input
                        type="text"
                        value={participantName}
                        onChange={(e) => setParticipentName(e.target.value)}
                        className="border-2 border-gray-300 px-4 py-2 w-full"
                    />
                </div>

                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500">Gender</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="border-2 border-gray-500 px-4 py-2 w-full"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500">Phone</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="border-2 border-gray-300 px-4 py-2 w-full"
                    />
                </div>

                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-2 border-gray-300 px-4 py-2 w-full"
                    />
                </div>

                {/* Pre-filled, non-editable fields for event details */}
                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500">
                        Event Name
                    </label>
                    <input
                        type="text"
                        value={eventName}
                        disabled
                        className="border-2 border-gray-300 px-4 py-2 w-full bg-gray-200"
                    />
                </div>

                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500">
                        Event Date
                    </label>
                    <input
                        type="text"
                        value={eventDate}
                        disabled
                        className="border-2 border-gray-300 px-4 py-2 w-full bg-gray-200"
                    />
                </div>

                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500">
                        Ticket Price
                    </label>
                    <input
                        type="text"
                        value={ticketPrice}
                        disabled
                        className="border-2 border-gray-300 px-4 py-2 w-full bg-gray-200"
                    />
                </div>

                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500">
                        Upload Payment Image
                    </label>
                    <input type="file" onChange={handleImageChange} />
                </div>
                <div className="my-4 bg-red-100 p-4 rounded-md">
                    <p className="text-gray-700">
                        <strong>Attention:</strong> Please upload your payment
                        document here. We will process your payment and let you
                        know as soon as possible about the success or rejection
                        of the payment. Here are the payment details:
                    </p>
                    <p className="text-gray-700 mt-2">
                        <strong>Bank:</strong> Sampath Bank
                        <br />
                        <strong>Branch:</strong> Malabe
                        <br />
                        <strong>Account Name:</strong> SaveTurtle Sri Lanka
                        <br />
                        <strong>Account Number:</strong> 710 890 4965
                        <br />
                        <strong>Branch Code:</strong> 053
                    </p>
                </div>
                <div className="mt-4">
                    <button
                        onClick={handleSaveEventParticipent}
                        className="bg-sky-500 text-white px-4 py-2 rounded-lg"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateEventsParticipent;
