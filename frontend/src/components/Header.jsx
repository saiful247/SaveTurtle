// src/components/Header.jsx
import { Link } from "react-router-dom";
import logo from "../images/logo1.png"; // Import your logo image

const Header = () => {
    return (
        <header className="bg-gray-800 text-white p-4  text-xl">
            <nav className="container mx-auto flex justify-between items-center"> {/* Added items-center for vertical alignment */}
                <div className="flex items-center space-x-4"> {/* Added items-center for vertical alignment */}
                    <img src={logo} alt="Logo" className="h-10 w-auto mr-10" /> {/* Logo with size */}
                    <Link to="/" className="hover:text-gray-300">
                        Home
                    </Link>
                    <Link to="/eventlanding" className="hover:text-gray-300">
                        Events
                    </Link>
                    <Link to="/productViews" className="hover:text-gray-300">
                        Products
                    </Link>
                    <Link
                        to="/donations/herosection"
                        className="hover:text-gray-300"
                    >
                        Donation
                    </Link>
                    <Link to="/userRefunds" className="hover:text-gray-300">
                        Refund
                    </Link>
                    <Link to="/returns/create" className="hover:text-gray-300">
                        Return
                    </Link>
                    <Link
                        to="/ViewAvailablePacks/viewpacks"
                        className="hover:text-gray-300"
                    >
                        Premium Membership
                    </Link>
                    <Link to="/createtickets" className="hover:text-gray-300">
                        HelpDesk
                    </Link>
                    <Link to="/" className="hover:text-gray-300">
                        RescueTurtle
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
