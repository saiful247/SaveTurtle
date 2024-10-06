import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import BackButton from '../../components/BackButton';

const DeleteMembershipPack = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [membership, setMembership] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/memberships/${id}`)
      .then((response) => {
        setMembership(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = () => {
    setLoading(true);
    axios.delete(`http://localhost:5555/memberships/${id}`)
      .then(() => {
        setLoading(false);
        navigate('/membership/view');
      })
      .catch((error) => {
        setLoading(false);
        alert('Error deleting membership');
        console.error(error);
      });
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <BackButton />
      <h1 className="text-4xl font-bold text-center text-red-600 my-8">Delete Membership Plan</h1>
      {loading ? <Spinner /> : (
        <div className="border-2 border-red-400 p-6 rounded-xl shadow-lg bg-white mx-auto w-[600px]">
          <p className="text-lg text-center">Are you sure you want to delete this membership plan?</p>
          <h2 className="text-2xl font-semibold text-center my-4">{membership.name}</h2>
          <div className="flex justify-center gap-6">
            <button className="p-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-200" onClick={handleDelete}>
              confirm
            </button>
            <button className="p-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition duration-200" onClick={() => navigate('/membership/view')}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteMembershipPack;
