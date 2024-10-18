import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { GiTurtle } from "react-icons/gi";

const UpdateMembershipPack = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [features, setFeatures] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // To store field-specific errors

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/memberships/${id}`)
      .then((response) => {
        const { name, price, duration, features } = response.data;
        setName(name);
        setPrice(price);
        setDuration(duration);
        setFeatures(features);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  const handleFieldChange = (field, value) => {
    // Update state for the corresponding field
    switch (field) {
      case "name":
        setName(value);
        break;
      case "price":
        setPrice(value);
        break;
      case "duration":
        setDuration(value);
        break;
      case "features":
        setFeatures(value);
        break;
      default:
        break;
    }
    // Clear the specific field error
    setErrors({ ...errors, [field]: "" });
  };

  const handleUpdateMembership = () => {
    // Validation checks
    const newErrors = {};
    if (!name) {
      newErrors.name = "Name is required.";
    } else if (name.length < 5) {
      newErrors.name = "Name must be at least 5 characters long.";
    }
    if (!price) {
      newErrors.price = "Price is required.";
    } else if (price <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }
    if (!duration) {
      newErrors.duration = "Duration is required.";
    } else if (duration <= 0) {
      newErrors.duration = "Duration must be greater than 0.";
    }
    if (!features) {
      newErrors.features = "Features are required.";
    } else if (features.length < 5) {
      newErrors.features = "Features must be at least 5 characters long.";
    }

    // If there are validation errors, set them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // No errors, proceed with the update
    const data = {
      name,
      price,
      duration,
      features,
    };

    setLoading(true);
    axios
      .put(`http://localhost:5555/memberships/${id}`, data)
      .then(() => {
        setLoading(false);
        navigate("/membership/view");
      })
      .catch((error) => {
        setLoading(false);
        setErrors({
          general: "An error occurred while updating the membership.",
        });
        console.error(error);
      });
  };

  return (
    <div className="bg-gradient-to-b from-green-200 to-blue-200 p-6 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold my-4 text-center text-green-700 flex items-center justify-center">
        <GiTurtle className="mr-2 text-6xl" />
        Update Membership Plan
      </h1>
      {loading && <Spinner />}
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6 mx-auto mt-4 border-2 border-green-300">
        {errors.general && (
          <p className="text-red-500 text-sm mb-4">{errors.general}</p>
        )}
        <div className="my-4">
          <label className="text-lg font-semibold text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            className="border-2 border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:border-green-500"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div className="my-4">
          <label className="text-lg font-semibold text-gray-700">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => handleFieldChange("price", e.target.value)}
            className="border-2 border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:border-green-500"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price}</p>
          )}
        </div>
        <div className="my-4">
          <label className="text-lg font-semibold text-gray-700">
            Duration (Months)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => handleFieldChange("duration", e.target.value)}
            className="border-2 border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:border-green-500"
          />
          {errors.duration && (
            <p className="text-red-500 text-sm">{errors.duration}</p>
          )}
        </div>
        <div className="my-4">
          <label className="text-lg font-semibold text-gray-700">
            Features
          </label>
          <input
            type="text"
            value={features}
            onChange={(e) => handleFieldChange("features", e.target.value)}
            className="border-2 border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:border-green-500"
          />
          {errors.features && (
            <p className="text-red-500 text-sm">{errors.features}</p>
          )}
        </div>
        <button
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
          onClick={handleUpdateMembership}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default UpdateMembershipPack;
