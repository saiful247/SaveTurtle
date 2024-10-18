import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SubscribePage = () => {
  const { id } = useParams(); // 'id' from the URL, which is the membershipId
  const [membership, setMembership] = useState(null);
  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    paymentSlip: null,
  });
  const [errors, setErrors] = useState({}); // To store field-specific errors
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5555/memberships/${id}`)
      .then((response) => {
        setMembership(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching membership", error);
        setLoading(false);
      });
  }, [id]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "userId":
        if (!value.trim()) {
          error = "User ID is required";
        } else if (value.length < 4) {
          error = "User ID must be at least 4 characters";
        }
        break;
      case "firstName":
        if (!value.trim()) {
          error = "First Name is required";
        } else if (value.length < 3) {
          error = "First Name must be more than 2 characters";
        }
        break;
      case "lastName":
        if (!value.trim()) {
          error = "Last Name is required";
        } else if (value.length < 3) {
          error = "Last Name must be more than 2 characters";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          error = "Invalid email format";
        }
        break;
      case "paymentSlip":
        if (!value) error = "Payment slip is required";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate the individual field
    const fieldError = validateField(name, value);
    setErrors({ ...errors, [name]: fieldError });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, paymentSlip: file });

    // Validate the file input
    const fileError = validateField("paymentSlip", file);
    setErrors({ ...errors, paymentSlip: fileError });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Validate the form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Set errors if validation fails
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("userId", formData.userId);
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("membershipId", id); // Append membership ID
    formDataToSend.append("paymentSlip", formData.paymentSlip);

    try {
      const response = await axios.post(
        "http://localhost:5555/subscriptions/subscribe",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Log the response data for debugging
      console.log(response.data);

      // Navigate to receipt page if successful
      navigate(`/subscriptions/${response.data.data._id}`);
    } catch (error) {
      console.error("Error submitting subscription", error);
      alert("Failed to subscribe. Please try again.");
    }
  };

  if (loading) return <p>Loading membership details...</p>;

  return (
    <div className="bg-green-50 min-h-screen py-10">
      <h1 className="text-5xl text-center font-bold text-green-800 mb-10">
        Subscribe to {membership ? membership.name : "Membership"}
      </h1>

      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        {membership && (
          <>
            <p className="text-green-700 text-xl">
              Price: Rs {membership.price}
            </p>
            <p className="text-green-700 mt-2">
              Duration: {membership.duration}
            </p>
            <p className="text-green-700 mt-2">{membership.features}</p>
          </>
        )}

        {/* Bank Details and Instructions */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Bank Details
          </h2>
          <p className="text-green-700">
            Bank Name: Sampath Bank
            <br />
            Account Number: 1234567890
            <br />
            IFSC Code: ABCD0123456
            <br />
            Account Holder Name: SaveTurtle Foundation
          </p>
          <h3 className="text-xl font-bold text-green-800 mt-4">
            Instructions for Payment Slip
          </h3>
          <p className="text-green-700">
            Please transfer the membership amount to the above bank account.
            After making the payment, upload the payment slip in the form below.
            Make sure the payment slip clearly shows the transaction details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-green-700">User ID</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-300 rounded-md"
            />
            {errors.userId && <p className="text-red-500">{errors.userId}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-green-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-300 rounded-md"
            />
            {errors.firstName && (
              <p className="text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-green-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-300 rounded-md"
            />
            {errors.lastName && (
              <p className="text-red-500">{errors.lastName}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-green-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-300 rounded-md"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-green-700">Payment Slip</label>
            <input
              type="file"
              name="paymentSlip"
              onChange={handleFileChange}
              className="w-full"
            />
            {errors.paymentSlip && (
              <p className="text-red-500">{errors.paymentSlip}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubscribePage;
