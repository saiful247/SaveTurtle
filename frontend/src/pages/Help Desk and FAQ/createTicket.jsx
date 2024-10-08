import { useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";
import axios from "axios";
import jsPDF from "jspdf";
import GridPatternBG from "../../components/GridPatternBG";
const CreateTickets = () => {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({}); // State for storing validation errors

  const validateFields = () => {
    const newErrors = {};
    if (!topic) newErrors.topic = "Topic is required.";
    if (!description) newErrors.description = "Description is required.";
    if (!name) newErrors.name = "Name is required.";
    if (!phone || phone.length < 10)
      newErrors.phone = "Phone number must be 10 digits long.";
    if (!email || !email.includes("@"))
      newErrors.email = "Valid email is required.";

    return newErrors;
  };

  const handleTicketSubmission = () => {
    const validationErrors = validateFields();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop the function if validation fails
    }

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
        setIsSuccess(true); // Show success overlay
      })
      .catch((error) => {
        setLoading(false);
        alert("An error happened. Please check console");
        console.log(error);
      });
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Ticket Details", 20, 20);
    doc.text(`Topic: ${topic}`, 20, 30);
    doc.text(`Description: ${description}`, 20, 40);
    doc.text(`Name: ${name}`, 20, 50);
    doc.text(`Phone: ${phone}`, 20, 60);
    doc.text(`Email: ${email}`, 20, 70);
    doc.save("ticket-details.pdf");

    resetForm();
  };

  const resetForm = () => {
    setTopic("");
    setDescription("");
    setName("");
    setPhone("");
    setEmail("");
    setErrors({});
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative">
      {/* Header with Create Ticket Title and FAQ Button */}
      <GridPatternBG className="z-0" strokeColor="rgba(128, 128, 128, 0.2)" />
      <header className="w-full flex justify-between items-center py-4 px-16 absolute top-0">
        <h1 className="text-2xl font-semibold text-primary">Create Ticket</h1>
        <Link
          to="/faq"
          className="bg-primary text-white text-lg px-5 py-3 rounded-lg hover:bg-primary_light transition duration-200"
        >
          FAQ
        </Link>
      </header>

      {loading ? <Spinner /> : null}

      <div className="bg-white shadow-lg rounded-xl border border-gray-200 w-full max-w-5xl p-8 top-0 grid grid-cols-1 md:grid-cols-2 gap-6 z-10">
        <div>
          <h2 className="text-xl font-semibold text-primary mb-4">
            Ticket Information
          </h2>
          <div className="my-4">
            <label className="text-lg font-medium text-primary_light">
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setErrors({ ...errors, topic: "" }); // Clear error on change
              }}
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.topic ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary_light focus:border-transparent`}
              placeholder="Enter topic"
            />
            {errors.topic && (
              <p className="text-red-700 text-sm mt-1">{errors.topic}</p>
            )}
          </div>
          <div className="my-4">
            <label className="text-lg font-medium text-primary_light">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors({ ...errors, description: "" });
              }}
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary_light focus:border-transparent`}
              placeholder="Enter description"
              rows="6"
            />
            {errors.description && (
              <p className="text-red-700 text-sm mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Personal Information Section */}
        <div>
          <h2 className="text-xl font-semibold text-primary mb-4">
            Personal Information
          </h2>
          <div className="my-4">
            <label className="text-lg font-medium text-primary_light">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({ ...errors, name: "" });
              }}
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary_light focus:border-transparent`}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-700 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="my-4">
            <label className="text-lg font-medium text-primary_light">
              Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => {
                const phoneInput = e.target.value;
                if (/^\d{0,10}$/.test(phoneInput)) {
                  setPhone(phoneInput);
                  setErrors({ ...errors, phone: "" });
                }
              }}
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary_light focus:border-transparent`}
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <p className="text-red-700 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
          <div className="my-4">
            <label className="text-lg font-medium text-primary_light">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: "" });
              }}
              className={`mt-1 block w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary_light focus:border-transparent`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-red-700 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>
        <button
          className="w-full py-3 mt-6 text-white bg-primary rounded-lg hover:bg-primary_light focus:outline-none focus:ring-2 focus:ring-primary_light transition duration-200"
          onClick={handleTicketSubmission}
        >
          {loading ? "Saving..." : "Create"}
        </button>
      </div>

      {isSuccess && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white text-center p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-primary_light mb-4">
              Ticket Created Successfully!
            </h2>
            <p className="text-primary_light mb-4">
              Your ticket has been submitted. Download the ticket details as
              PDF?
            </p>
            <div className="flex space-x-4 justify-center">
              <button
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary_light transition duration-200"
                onClick={handleDownloadPDF}
              >
                Download
              </button>
              <button
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary_light transition duration-200"
                onClick={resetForm}
              >
                Proceed without downloading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTickets;
