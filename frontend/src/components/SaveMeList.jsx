import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import { MapContainer, TileLayer, Marker } from "react-leaflet"; // Import React Leaflet components
import "leaflet/dist/leaflet.css"; // Import Leaflet's CSS file for proper map rendering

const SaveMeList = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'critical', or 'regular'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    axios
      .get("http://localhost:5555/api/saveMe")
      .then((response) => {
        const reportsData = response.data.data || [];
        setReports(reportsData);
        setFilteredReports(reportsData); // Initialize with all reports
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5555/api/saveMe/${id}`);
      const updatedReports = reports.filter((report) => report._id !== id);
      setReports(updatedReports);
      handleFilterAndSearch(filter, searchTerm, updatedReports); // Update filtered reports after deletion
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  const handleView = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  // Function to handle filtering and searching
  const handleFilterAndSearch = (
    filterType,
    searchText,
    reportsData = reports
  ) => {
    let updatedReports = reportsData;

    // Filter based on emergency level
    if (filterType !== "all") {
      updatedReports = reportsData.filter(
        (report) => report.emergencyLevel === filterType
      );
    }

    // Search filter for name or location
    if (searchText) {
      updatedReports = updatedReports.filter(
        (report) =>
          report.name.toLowerCase().includes(searchText.toLowerCase()) ||
          report.location.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredReports(updatedReports); // Update state with filtered results
  };

  const handleSearch = (e) => {
    const searchText = e.target.value;
    setSearchTerm(searchText);
    handleFilterAndSearch(filter, searchText);
  };

  const handleFilter = (filterType) => {
    setFilter(filterType);
    handleFilterAndSearch(filterType, searchTerm);
  };

  const handleDownloadPDF = async () => {
    const doc = new jsPDF();

    const imageUrl = `http://localhost:5555/uploads/${selectedReport.photo}`;
    const imgWidth = 60; // Image width in PDF
    const imgHeight = 60; // Image height in PDF

    // Convert image to base64 with Promise
    const loadImageToBase64 = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Prevent CORS issues
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/jpeg");
          resolve(dataURL); // Return base64 string
        };
        img.onerror = reject; // Handle errors
        img.src = url;
      });
    };

    try {
      const imageDataUrl = await loadImageToBase64(imageUrl); // Wait for image to load

      // Now that the image is loaded, generate the PDF
      doc.setFontSize(18);
      doc.text("Report Details", 20, 20);

      doc.addImage(imageDataUrl, "JPEG", 20, 30, imgWidth, imgHeight);

      doc.setFontSize(12);
      doc.text(`Name: ${selectedReport.name}`, 20, 100);
      doc.text(`Description: ${selectedReport.description}`, 20, 110);
      doc.text(`Location: ${selectedReport.location}`, 20, 120);
      doc.text(`Emergency Level: ${selectedReport.emergencyLevel}`, 20, 130);

      doc.save("report-details.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // Totals and Counts
  const totalReports = reports.length;
  const criticalReports = reports.filter(
    (report) => report.emergencyLevel === "critical"
  ).length;
  const regularReports = reports.filter(
    (report) => report.emergencyLevel === "regular"
  ).length;

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg mt-8 border border-gray-200">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">All SaveMe Reports</h2>
        <Link
          to="/saveMes/create"
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
        >
          Create New Report
        </Link>
      </div>

      {/* Report Counters */}
      <div className="flex justify-around items-center mb-6">
        <div className="text-center">
          <p className="text-gray-600">Total Reports</p>
          <p className="text-xl font-semibold text-gray-900">{totalReports}</p>
        </div>

        <div className="text-center">
          <p className="text-gray-600">Critical Reports</p>
          <p className="text-xl font-semibold text-red-600">
            {criticalReports}
          </p>
        </div>

        <div className="text-center">
          <p className="text-gray-600">Regular Reports</p>
          <p className="text-xl font-semibold text-green-600">
            {regularReports}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex space-x-2">
          <button
            onClick={() => handleFilter("all")}
            className={`px-4 py-2 rounded-md ${
              filter === "all" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilter("critical")}
            className={`px-4 py-2 rounded-md ${
              filter === "critical" ? "bg-red-500 text-white" : "bg-gray-100"
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => handleFilter("regular")}
            className={`px-4 py-2 rounded-md ${
              filter === "regular" ? "bg-green-500 text-white" : "bg-gray-100"
            }`}
          >
            Regular
          </button>
        </div>
      </div>

      {/* Table with Filtered Reports */}
      {filteredReports.length > 0 ? (
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">ID</th>
              <th className="px-4 py-2 text-left text-gray-600">Image</th>
              <th className="px-4 py-2 text-left text-gray-600">Name</th>
              <th className="px-4 py-2 text-left text-gray-600">Description</th>
              <th className="px-4 py-2 text-left text-gray-600">Location</th>
              <th className="px-4 py-2 text-left text-gray-600">
                Emergency Level
              </th>
              <th className="px-4 py-2 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredReports.map((report) => (
              <tr key={report._id} className="border-b">
                <td className="px-4 py-3">#{report._id}</td>
                <td className="px-4 py-3">
                  <img
                    src={`http://localhost:5555/uploads/${report.photo}`}
                    alt="Report"
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                </td>
                <td className="px-4 py-3">{report.name}</td>
                <td className="px-4 py-3">{report.description}</td>
                <td className="px-4 py-3">{report.location}</td>
                <td className="px-4 py-3">{report.emergencyLevel}</td>
                <td className="px-4 py-3 flex space-x-2">
                  <button
                    onClick={() => handleView(report)}
                    className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    View
                  </button>
                  <Link
                    to={`/saveMes/edit/${report._id}`}
                    className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(report._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-600">No reports available</p>
      )}

      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg border border-gray-300">
            <h3 className="text-xl font-semibold mb-4">Report Details</h3>
            <div className="flex">
              <img
                src={`http://localhost:5555/uploads/${selectedReport.photo}`}
                alt="Report"
                className="w-32 h-32 object-cover rounded-md border mr-4"
              />
              <div>
                <p className="mb-2">
                  <span className="font-bold">Name:</span> {selectedReport.name}
                </p>
                <p className="mb-2">
                  <span className="font-bold">Description:</span>{" "}
                  {selectedReport.description}
                </p>
                <p className="mb-2">
                  <span className="font-bold">Location:</span>{" "}
                  {selectedReport.location}
                </p>
                <p className="mb-2">
                  <span className="font-bold">Emergency Level:</span>{" "}
                  {selectedReport.emergencyLevel}
                </p>
              </div>
            </div>

            {/* Extract coordinates from the location string */}
            {selectedReport.location && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Location on Map</h4>

                {/* Parse the location string for latitude and longitude */}
                <MapContainer
                  center={[
                    parseFloat(selectedReport.location.split(",")[0]) ||
                      6.883890980841581,
                    parseFloat(selectedReport.location.split(",")[1]) ||
                      80.22546390071513,
                  ]}
                  zoom={13}
                  style={{ height: "200px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker
                    position={[
                      parseFloat(selectedReport.location.split(",")[0]) ||
                        6.883890980841581,
                      parseFloat(selectedReport.location.split(",")[1]) ||
                        80.22546390071513,
                    ]}
                  />
                </MapContainer>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={handleDownloadPDF}
                className="mr-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Download PDF
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaveMeList;
