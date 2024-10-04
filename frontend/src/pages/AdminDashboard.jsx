import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const buttons = [
        { label: "Events", path: "/events" },
        { label: "Products", path: "/products" },
        { label: "Membership", path: "/membership/view" },
        { label: "Tickets", path: "/tickets" },
        { label: "FAQ", path: "/faqdashboard" },
        { label: "Orders", path: "/orders" },
        { label: "Reports", path: "/reports" },
        { label: "Settings", path: "/settings" },
        { label: "Analytics", path: "/analytics" },
    ];

    const handleButtonClick = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin");
    };

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="flex flex-wrap gap-4">
                {buttons.map((button, index) => (
                    <button
                        key={index}
                        onClick={() => handleButtonClick(button.path)}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md transform hover:scale-110 hover:bg-blue-600 transition duration-300"
                    >
                        {button.label}
                    </button>
                ))}
                <button
                    onClick={handleLogout}
                    className="bg-red-300 text-white px-6 py-3 rounded-lg shadow-md transform hover:scale-110 hover:bg-red-400 transition duration-300"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
