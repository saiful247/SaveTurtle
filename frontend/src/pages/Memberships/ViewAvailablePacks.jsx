import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewAvailablePacks = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5555/memberships")
      .then((response) => {
        setMemberships(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching memberships", error);
        setLoading(false);
      });
  }, []);

  const handleSubscribe = (membershipId) => {
    navigate(`/subscribe/${membershipId}`);
  };

  const filteredMemberships = memberships.filter((membership) =>
    membership.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-green-50 min-h-screen py-10">
      <h1 className="text-5xl text-center font-bold text-primary mb-10">
        Turtle Conservation Membership Packages
      </h1>

      <div className="max-w-xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by membership name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-4 py-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {loading ? (
        <p className="text-center">Loading memberships...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredMemberships.map((membership) => (
            <div
              key={membership._id}
              className="bg-white shadow-lg rounded-lg p-6"
            >
              <h2 className="text-3xl font-bold text-green-700">
                {membership.name}
              </h2>
              <p className="text-green-600 mt-2">
                Price: Rs {membership.price}
              </p>
              <p className="text-green-600 mt-2">
                Duration: {membership.duration} Months
              </p>
              <p className="text-green-600 mt-2">{membership.features}</p>
              <button
                onClick={() => handleSubscribe(membership._id)}
                className="bg-primary text-white px-4 py-2 rounded-md mt-4 hover:bg-primary_light transition-all"
              >
                Subscribe
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAvailablePacks;
