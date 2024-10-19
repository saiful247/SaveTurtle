import { useEffect, useState } from "react";
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
    noOfPerson: "",
    ticketPrice: "",
    paymentImage: null, // New field for the image
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
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
          noOfPerson: data.noOfPerson,
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

  const validateForm = () => {
    const newErrors = {};

    // Validate participant name
    if (!formData.participantName) {
      newErrors.participantName = "Participant name is required";
    }

    // Validate gender
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    // Validate phone number (must start with 07 and be 10 digits)
    const phoneRegex = /^07[0-9]{8}$/;
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone number must start with 07 and have 10 digits";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Validate event name
    if (!formData.eventName) {
      newErrors.eventName = "Event name is required";
    }

    // Validate event date
    if (!formData.eventDate) {
      newErrors.eventDate = "Event date is required";
    }

    if (!formData.noOfPerson) {
      newErrors.noOfPerson = "Number of persons is required";
    } else if (formData.noOfPerson <= 0) {
      newErrors.noOfPerson = "Number of persons must be greater than zero";
    }

    // Validate ticket price (cannot be negative)
    if (!formData.ticketPrice) {
      newErrors.ticketPrice = "Ticket price is required";
    } else if (formData.ticketPrice < 0) {
      newErrors.ticketPrice = "Ticket price cannot be negative";
    }

    // Validate payment image (if a new file is uploaded)
    const allowedFileTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (
      formData.paymentImage &&
      !allowedFileTypes.includes(formData.paymentImage.type)
    ) {
      newErrors.paymentImage =
        "Allowed image types are jpg, jpeg, png, and webp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Show a popup with error messages if form is invalid
      let errorMessage = "Please fix the following errors:\n";
      Object.values(errors).forEach((error) => {
        errorMessage += `${error}\n`;
      });
      window.alert(errorMessage);
      return;
    }

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
        <h1 className="text-2xl font-bold mb-6 text-center">
          Edit Event Booking
        </h1>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-4"
        >
          <div>
            <label className="block text-gray-700">Participant Name</label>
            <input
              type="text"
              name="participantName"
              value={formData.participantName}
              onChange={handleInputChange}
              required
              className={`w-full mt-1 p-2 border ${
                errors.participantName ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.participantName && (
              <p className="text-red-500">{errors.participantName}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
              className={`w-full mt-1 p-2 border ${
                errors.gender ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500">{errors.gender}</p>}
          </div>
          <div>
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className={`w-full mt-1 p-2 border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.phone && <p className="text-red-500">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`w-full mt-1 p-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-gray-700">Event Name</label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
              required
              className={`w-full mt-1 p-2 border ${
                errors.eventName ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.eventName && (
              <p className="text-red-500">{errors.eventName}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Event Date</label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleInputChange}
              required
              className={`w-full mt-1 p-2 border ${
                errors.eventDate ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.eventDate && (
              <p className="text-red-500">{errors.eventDate}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Number Of Persons</label>
            <input
              type="number"
              name="noOfPerson"
              value={formData.noOfPerson}
              onChange={handleInputChange}
              required
              className={`w-full mt-1 p-2 border ${
                errors.noOfPerson ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.noOfPerson && (
              <p className="text-red-500">{errors.noOfPerson}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700">Ticket Price</label>
            <input
              type="number"
              name="ticketPrice"
              value={formData.ticketPrice}
              onChange={handleInputChange}
              required
              className={`w-full mt-1 p-2 border ${
                errors.ticketPrice ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.ticketPrice && (
              <p className="text-red-500">{errors.ticketPrice}</p>
            )}
          </div>

          {currentImage && (
            <div>
              <label className="block text-gray-700">
                Current Payment Image
              </label>
              <img
                src={`http://localhost:5555${currentImage}`}
                alt="Payment"
                className="h-32 w-32 object-cover mt-2"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700">
              Upload New Payment Image
            </label>
            <input
              type="file"
              name="paymentImage"
              accept="image/*"
              onChange={handleImageChange}
              className={`mt-2 ${
                errors.paymentImage ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.paymentImage && (
              <p className="text-red-500">{errors.paymentImage}</p>
            )}
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
