import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { GiTurtle } from "react-icons/gi";

const ShowMembershipPack = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/memberships/${id}`)
      .then((response) => {
        setMembership(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (!membership) {
    return <p>No membership package found</p>;
  }

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-green-800 mb-8">
        Membership Package Details
      </h1>
      <div className="border-2 border-sky-400 rounded-lg shadow-lg p-6 mx-auto w-full max-w-md bg-white">
        <div className="flex items-center justify-center mb-4">
          <GiTurtle className="text-5xl text-green-700 mr-2" />
          <h2 className="text-2xl font-semibold">
            Support Our Conservation Efforts!
          </h2>
        </div>
        <div className="mb-4">
          <p className="text-lg">
            <strong>Name:</strong> {membership.name}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-lg">
            <strong>Price:</strong> Rs {membership.price}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-lg">
            <strong>Duration:</strong> {membership.duration} months
          </p>
        </div>
        <div className="mb-4">
          <p className="text-lg">
            <strong>Features:</strong> {membership.features}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShowMembershipPack;
