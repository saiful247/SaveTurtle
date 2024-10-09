import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";

const ShowEvent = () => {
  const [eventProgram, setEvent] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/events/${id}`)
      .then((response) => {
        setEvent(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4">Show Event</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4">
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Id</span>
            <span>{eventProgram._id}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Event Name</span>
            <span>{eventProgram.eventName}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Vanue</span>
            <span>{eventProgram.vanue}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Date</span>
            <span>{eventProgram.date}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Time</span>
            <span>{eventProgram.time}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">
              Total Allocated Seats
            </span>
            <span>{eventProgram.allocatedPersonCount}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Price</span>
            <span>{eventProgram.price}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Create Time</span>
            <span>{new Date(eventProgram.createdAt).toString()}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Last Update Time</span>
            <span>{new Date(eventProgram.updatedAt).toString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowEvent;
