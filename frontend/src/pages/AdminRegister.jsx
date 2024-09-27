import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (username.length < 3 || password.length < 6) {
            setError(
                "Username must be at least 3 characters and password at least 6 characters"
            );
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5555/admin/register",
                { username, password }
            );
            if (response.status === 201) {
                alert("Admin registered successfully");
                navigate("/admin");
            }
        } catch (error) {
            console.error("Registration error:", error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                setError(
                    error.response.data.message || "Error registering admin"
                );
            } else if (error.request) {
                // The request was made but no response was received
                setError("No response from server. Please try again.");
            } else {
                // Something happened in setting up the request that triggered an Error
                setError("Error setting up request. Please try again.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-warm-white shadow-lg p-8 rounded-lg transform hover:scale-105 transition duration-300 ease-in-out">
                <h2 className="text-2xl font-bold mb-6">Admin Registration</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold">Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength="3"
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminRegister;
