import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const SaveMeForm = ({ isEditMode = false }) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [emergencyLevel, setEmergencyLevel] = useState("regular");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const [mapLocation, setMapLocation] = useState([
    6.92792644314281, 79.86140442313628,
  ]); // Default location

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setMapLocation([e.latlng.lat, e.latlng.lng]);
        setLocation(`${e.latlng.lat}, ${e.latlng.lng}`); // Update form's location field
      },
    });

    return mapLocation === null ? null : (
      <Marker position={mapLocation}></Marker>
    );
  };

  useEffect(() => {
    if (isEditMode && id) {
      axios.get(`http://localhost:5555/api/saveMe/${id}`).then((response) => {
        const report = response.data.data;
        setName(report.name);
        setContact(report.contact);
        setLocation(report.location);
        setDescription(report.description);
        setEmergencyLevel(report.emergencyLevel);

        // Parse the location from the report and set map coordinates
        if (report.location) {
          const [lat, lng] = report.location.split(", ").map(Number);
          setMapLocation([lat, lng]);
        }
      });
    }
  }, [isEditMode, id]);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!name) newErrors.name = "Name is required";

    // Contact validation (10 digits)
    if (!contact) {
      newErrors.contact = "Contact is required";
    } else if (!/^\d{10}$/.test(contact)) {
      newErrors.contact = "Contact must be a 10-digit number";
    }

    // Location validation
    if (!location) newErrors.location = "Location is required";

    // Set errors
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // returns true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditMode) {
      // Bypass validation for disabled fields
      setErrors({}); // Clear errors for edit mode
    } else if (!validateForm()) {
      return; // Do not proceed if validation fails
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("contact", contact);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("photo", photo);
    formData.append("emergencyLevel", emergencyLevel);

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5555/api/saveMe/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("http://localhost:5555/api/saveMe/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate("/saveMes"); // Redirects to the list of reports after form submission
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? "Edit SaveMe Report" : "Create SaveMe Report"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: null })); // Clear error on change
            }}
            required
            disabled={isEditMode} // Disable field in edit mode
            className={`w-full mt-1 p-2 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contact:
          </label>
          <input
            type="number"
            value={contact}
            onChange={(e) => {
              setContact(e.target.value);
              setErrors((prev) => ({ ...prev, contact: null })); // Clear error on change
            }}
            required
            disabled={isEditMode} // Disable field in edit mode
            className={`w-full mt-1 p-2 border ${
              errors.contact ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.contact && (
            <p className="text-red-500 text-sm">{errors.contact}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location:
          </label>

          <input
            type="text"
            value={location}
            readOnly={isEditMode} // Make the input read-only in edit mode
            required
            className={`w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm ${
              isEditMode ? "bg-gray-200" : "bg-white"
            }`}
          />

          {/* Conditionally render the warning message in edit mode */}
          {isEditMode && (
            <p className="text-yellow-500 text-sm mt-2">
              You cannot update the location in edit mode.
            </p>
          )}

          {/* Optionally show an error message if there's an issue with the location */}
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location}</p>
          )}

          {/* Map component (assumed to be used for selecting location or display) */}
          <MapContainer
            center={mapLocation}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
          </MapContainer>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Photo (optional):
          </label>
          <input
            type="file"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full mt-1 p-2 bg-white border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Emergency Level:
          </label>
          <select
            value={emergencyLevel}
            onChange={(e) => setEmergencyLevel(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="regular">Regular</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description (optional):
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prev) => ({ ...prev, description: null })); // Clear error on change
            }}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isEditMode ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

SaveMeForm.propTypes = {
  isEditMode: PropTypes.bool,
};

export default SaveMeForm;
