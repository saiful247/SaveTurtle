import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';


const ShowSaveMe = () => {
  const [saveMe, setSaveMe] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/saveMes/${id}`)
      .then((response) => {
        setSaveMe(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Show SaveMe</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4'>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Id</span>
            <span>{saveMe._id}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Name</span>
            <span>{saveMe.name}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Contact</span>
            <span>{saveMe.contact}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Location</span>
            <span>{saveMe.location}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>First Created</span>
            <span>{new Date(saveMe.createdAt).toString()}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Last Updated</span>
            <span>{new Date(saveMe.updatedAt).toString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShowSaveMe