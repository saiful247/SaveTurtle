import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditEventBooking = () => {
  const { id } = useParams(); // Get the participant ID from the URL
  const navigate = useNavigate(); // To redirect after editing
  const [formData, setFormData] = useState({
    participantName: "",
    gender: "",
    phone: "",
    email: "",
    eventName: "",
    eventDate: "",
    ticketPrice: "",
    paymentImage: null, // New field for the image
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(null); // To store current image URL

  useEffect(() => {
    const fetchParticipantData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5555/eventBookingList/${id}`
        );
        const data = response.data;
        setFormData({
          participantName: data.participantName,
          gender: data.gender,
          phone: data.phone,
          email: data.email,
          eventName: data.eventName,
          eventDate: data.eventDate,
          ticketPrice: data.ticketPrice,
          paymentImage: null, // Keep the formData clean for file uploads
        });
        setCurrentImage(data.paymentImageUrl); // Set the current image URL
      } catch (error) {
        console.error("Error fetching participant data:", error);
        setError("Could not fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, paymentImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();

    // Append form data
    for (let key in formData) {
      formPayload.append(key, formData[key]);
    }

    try {
      await axios.put(
        `http://localhost:5555/eventBookingList/${id}`,
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type
          },
        }
      );
      alert("Participant updated successfully!");
      navigate("/eventBookingList"); // Redirect to the list after editing
    } catch (error) {
      console.error("Error updating participant:", error);
      setError("Failed to update data");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-blue-100 flex justify-center items-center py-10">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg my-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Event Booking</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <div>
            <label className="block text-gray-700">Participant Name</label>
            <input
              type="text"
              name="participantName"
              value={formData.participantName}
              onChange={handleInputChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Gender</label>
            <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
            </div>
          <div>
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Event Name</label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Event Date</label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleInputChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Ticket Price</label>
            <input
              type="number"
              name="ticketPrice"
              value={formData.ticketPrice}
              onChange={handleInputChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {currentImage && (
            <div>
              <label className="block text-gray-700">Current Payment Image</label>
              <img
                src={`http://localhost:5555${currentImage}`}
                alt="Payment"
                className="h-32 w-32 object-cover mt-2"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700">Upload New Payment Image</label>
            <input
              type="file"
              name="paymentImage"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Update Participant
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEventBooking;
