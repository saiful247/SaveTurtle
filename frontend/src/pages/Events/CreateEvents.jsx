import { useState } from "react";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateEvents = () => {
  const [eventName, setEventName] = useState("");
  const [vanue, setVanue] = useState("");
  const [date, setEventDate] = useState("");
  const [time, setEventTime] = useState("");
  const [allocatedPersonCount, setPersonCount] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validate event name
    if (!eventName) {
      newErrors.eventName = "Event name is required";
    }

    // Validate venue
    if (!vanue) {
      newErrors.vanue = "Venue is required";
    }

    // Validate date
    if (!date) {
      newErrors.date = "Date is required";
    }

    // Validate time
    if (!time) {
      newErrors.time = "Time is required";
    }

    // Validate ticket price (cannot be negative)
    if (!allocatedPersonCount) {
      newErrors.allocatedPersonCount = "Person count is required";
    } else if (allocatedPersonCount < 0) {
      newErrors.price = "Person count cannot be negative";
    }

    // Validate ticket price (cannot be negative)
    if (!price) {
      newErrors.price = "Ticket price is required";
    } else if (price < 0) {
      newErrors.price = "Ticket price cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSaveEvent = () => {
    if (!validateForm()) {
      alert("Please fix the errors before submitting");
      return;
    }

    // Explicitly format the date as YYYY-MM-DD
    const formattedDate = date; // The date input already gives us YYYY-MM-DD

    const data = {
      eventName,
      vanue,
      date: formattedDate,
      time,
      allocatedPersonCount,
      price,
    };

    setLoading(true);
    axios
      .post("http://localhost:5555/events", data)
      .then(() => {
        setLoading(false);
        navigate("/events");
      })
      .catch((error) => {
        setLoading(false);
        alert("An error happened. Please check console");
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen bg-blue-100 flex justify-center items-center py-10">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg my-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Event</h1>
        {loading ? <Spinner /> : ""}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">Event Name</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => {
                setEventName(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, eventName: "" })); // Clear error for eventName
              }}
              className={`w-full mt-1 p-2 border ${
                errors.eventName ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.eventName && (
              <p className="text-red-500">{errors.eventName}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700">Venue</label>
            <input
              type="text"
              value={vanue}
              onChange={(e) => {
                setVanue(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, vanue: "" })); // Clear error for venue
              }}
              className={`w-full mt-1 p-2 border ${
                errors.vanue ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.vanue && <p className="text-red-500">{errors.vanue}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setEventDate(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, date: "" })); // Clear error for date
              }}
              className={`w-full mt-1 p-2 border ${
                errors.date ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.date && <p className="text-red-500">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => {
                setEventTime(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, time: "" })); // Clear error for time
              }}
              className={`w-full mt-1 p-2 border ${
                errors.time ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.time && <p className="text-red-500">{errors.time}</p>}
          </div>

          <div>
            <label className="block text-gray-700">
              Total Allocated Persons
            </label>
            <input
              type="number"
              value={allocatedPersonCount}
              onChange={(e) => {
                setPersonCount(e.target.value);
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  allocatedPersonCount: "",
                })); // Clear error for price
              }}
              className={`w-full mt-1 p-2 border ${
                errors.allocatedPersonCount
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.allocatedPersonCount && (
              <p className="text-red-500">{errors.allocatedPersonCount}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, price: "" })); // Clear error for price
              }}
              className={`w-full mt-1 p-2 border ${
                errors.price ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.price && <p className="text-red-500">{errors.price}</p>}
          </div>

          <div className="mt-4">
            <button
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleSaveEvent}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvents;
