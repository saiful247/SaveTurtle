import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GiTurtle } from "react-icons/gi";
import { FaSave } from "react-icons/fa";
import Spinner from "../../components/Spinner";

const CreateMembershipPack = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    features: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear field-specific error when user types
  };

  const handleSaveMembership = () => {
    const { name, price, duration, features } = formData;
    const newErrors = {};

    // Validation for each field
    if (!name) {
      newErrors.name = "Name is required";
    } else if (name.length <= 4) {
      newErrors.name = "Name must be more than 4 characters";
    }

    if (!price) {
      newErrors.price = "Price is required";
    } else if (price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!duration) {
      newErrors.duration = "Duration is required";
    } else if (duration <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    }

    const featuresArray = features.split(",").map((feature) => feature.trim());
    if (!features) {
      newErrors.features = "Features are required";
    } else if (
      featuresArray.length === 0 ||
      featuresArray.some((feature) => feature.length < 5)
    ) {
      newErrors.features = "Each feature must be at least 5 characters long";
    }

    // Set errors if there are any
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear previous errors
    setErrors({});

    const data = { name, price, duration, features };

    setLoading(true);
    axios
      .post("http://localhost:5555/memberships", data)
      .then(() => {
        setLoading(false);
        navigate("/membership/view");
      })
      .catch((error) => {
        setLoading(false);
        alert("An error occurred. Please check the console.");
        console.log(error);
      });
  };

  return (
    <div className="p-8 bg-blue-50 min-h-screen flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-xl w-full">
        <div className="flex items-center justify-center mb-4">
          <GiTurtle className="text-green-600 text-5xl" />
          <h1 className="text-4xl font-bold text-gray-700 ml-4">
            Create New Membership
          </h1>
        </div>
        {loading && <Spinner />}
        <div className="space-y-4">
          <div>
            <label className="text-lg text-gray-500">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border-2 border-gray-300 px-4 py-2 w-full rounded-lg focus:border-green-400"
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label className="text-lg text-gray-500">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border-2 border-gray-300 px-4 py-2 w-full rounded-lg focus:border-green-400"
            />
            {errors.price && <p className="text-red-500">{errors.price}</p>}
          </div>
          <div>
            <label className="text-lg text-gray-500">Duration (Months)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="border-2 border-gray-300 px-4 py-2 w-full rounded-lg focus:border-green-400"
            />
            {errors.duration && (
              <p className="text-red-500">{errors.duration}</p>
            )}
          </div>
          <div>
            <label className="text-lg text-gray-500">
              Features (Comma separated)
            </label>
            <input
              type="text"
              name="features"
              value={formData.features}
              onChange={handleChange}
              className="border-2 border-gray-300 px-4 py-2 w-full rounded-lg focus:border-green-400"
            />
            {errors.features && (
              <p className="text-red-500">{errors.features}</p>
            )}
          </div>
          <button
            className="bg-green-500 text-white px-4 py-2 w-full rounded-lg hover:bg-green-600 flex items-center justify-center"
            onClick={handleSaveMembership}
          >
            <FaSave className="mr-2" /> Save Membership
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMembershipPack;
