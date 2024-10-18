// src/components/Header.jsx
import { Link } from "react-router-dom";
import logo from "../images/logo1.png"; // Import your logo image

const Header = () => {
  return (
    <header className="bg-primary text-white p-4 text-xl">
      <nav className="container mx-auto flex justify-center items-center space-x-7">
        {/* Use space-x-4 for consistent spacing between all elements */}
        <img src={logo} alt="Logo" className="h-10 w-auto mr-5" />
        <Link to="/" className="hover:text-gray-300">
          Home
        </Link>
        <Link to="/eventlanding" className="hover:text-gray-300">
          Events
        </Link>
        <Link to="/saveMes/create" className="hover:text-gray-300">
          Rescue
        </Link>
        <Link
          to="/ViewAvailablePacks/viewpacks"
          className="hover:text-gray-300"
        >
          Membership
        </Link>
        <Link to="/shop" className="hover:text-gray-300">
          Shop
        </Link>
        <Link to="/donations/herosection" className="hover:text-gray-300">
          Donation
        </Link>
        <Link to="/refundLanding" className="hover:text-gray-300">
          Refund
        </Link>
        <Link to="/returns/create" className="hover:text-gray-300">
          Return
        </Link>
        <Link to="/game" className="hover:text-gray-300">
          Puzzle
        </Link>
        <Link to="/createtickets" className="hover:text-gray-300">
          Help
        </Link>
      </nav>
    </header>
  );
};

export default Header;
