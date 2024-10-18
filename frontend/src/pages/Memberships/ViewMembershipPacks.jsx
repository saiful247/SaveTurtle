import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { BsInfoCircle } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ViewMembershipPacks = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5555/memberships") // Adjusted API endpoint
      .then((response) => {
        setMemberships(response.data.data); // Ensuring correct response data structure
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Membership Packages Report", 14, 16);

    const tableColumn = ["Name", "Price", "Duration (Months)", "Features"];
    const tableRows = [];

    // Use filteredMemberships instead of memberships
    filteredMemberships.forEach((membership) => {
      const membershipData = [
        membership.name,
        `Rs ${membership.price}`,
        membership.duration,
        membership.features,
      ];
      tableRows.push(membershipData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("filtered-membership-packages-report.pdf");
  };

  // Filter memberships based on search term
  const filteredMemberships = memberships.filter((membership) =>
    membership.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-green-700 my-8">
        Premium Membership Packages
      </h1>

      <div className="flex justify-between mb-4">
        <button
          onClick={generatePDF}
          className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition-all"
        >
          Generate Report
        </button>
        <Link to="/membership/packagecreate">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition-all">
            Create New Membership
          </button>
        </Link>
        <Link to="/subscriptions/subscriptions">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition-all">
            View All Subscriptions
          </button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Membership Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-full"
        />
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white rounded-lg shadow-md">
            <thead className="bg-green-200 text-green-800">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Duration (Months)</th>
                <th className="p-4 text-left">Features</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMemberships.map((membership) => (
                <tr
                  key={membership._id}
                  className="border-b hover:bg-green-100 transition-all"
                >
                  <td className="p-4">{membership.name}</td>
                  <td className="p-4">Rs {membership.price}</td>
                  <td className="p-4">{membership.duration} Months</td>
                  <td className="p-4">{membership.features}</td>
                  <td className="p-4">
                    <div className="flex space-x-4 justify-center">
                      <Link
                        to={`/membership/details/${membership._id}`}
                        className="text-green-600 hover:text-green-800 transition-transform transform hover:scale-110"
                      >
                        <BsInfoCircle className="text-2xl" />
                      </Link>
                      <Link
                        to={`/membership/packageupdate/${membership._id}`}
                        className="text-yellow-500 hover:text-yellow-700 transition-transform transform hover:scale-110"
                      >
                        <AiOutlineEdit className="text-2xl" />
                      </Link>
                      <Link
                        to={`/membership/packagedelete/${membership._id}`}
                        className="text-red-600 hover:text-red-800 transition-transform transform hover:scale-110"
                      >
                        <MdOutlineDelete className="text-2xl" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewMembershipPacks;
