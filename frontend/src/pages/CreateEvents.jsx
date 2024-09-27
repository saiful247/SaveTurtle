import React, { useState } from "react";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateEvents = () => {
    const [eventName, setEventName] = useState("");
    const [vanue, setVanue] = useState("");
    const [date, setEventDate] = useState("");
    const [time, setEventTime] = useState("");
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSaveEvent = () => {
        // Explicitly format the date as YYYY-MM-DD
        const formattedDate = date; // The date input already gives us YYYY-MM-DD

        const data = {
            eventName,
            vanue,
            date: formattedDate,
            time,
            price,
        };

        setLoading(true);
        axios
            .post("http://localhost:5555/events", data)
            .then(() => {
                setLoading(false);
                navigate("/events");
            })
            .catch((error) => {
                setLoading(false);
                alert("An error happened. Please check console");
                console.log(error);
            });
    };

    return (
        <div className="p-4">
            <BackButton />
            <h1 className="text-3xl my-4">Create Event</h1>
            {loading ? <Spinner /> : ""}
            <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500">
                        Event Name
                    </label>
                    <input
                        type="text"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        className="border-2 border-gray-500 px-4 py-2 w-full"
                    />
                </div>
                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500">Vanue</label>
                    <input
                        type="text"
                        value={vanue}
                        onChange={(e) => setVanue(e.target.value)}
                        className="border-2 border-gray-500 px-4 py-2 w-full"
                    />
                </div>
                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="border-2 border-gray-500 px-4 py-2 w-full"
                    />
                </div>
                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500">Time</label>
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="border-2 border-gray-500 px-4 py-2 w-full"
                    />
                </div>
                <div className="my-4">
                    <label className="text-xl mr-4 text-gray-500">Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="border-2 border-gray-500 px-4 py-2 w-full"
                    />
                </div>
                <button
                    className="p-2 bg-sky-300 m-8"
                    onClick={handleSaveEvent}
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default CreateEvents;
