// src/components/Header.jsx
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-around">
        <div className="flex space-x-11">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link to="/eventViews" className="hover:text-gray-300">
            Events
          </Link>
          <Link to="/" className="hover:text-gray-300">
            Rescue
          </Link>
          <Link to="/donations/herosection" className="hover:text-gray-300">
            Donation
          </Link>
          <Link
            to="/ViewAvailablePacks/viewpacks"
            className="hover:text-gray-300"
          >
            Memberships
          </Link>
          <Link to="/productViews" className="hover:text-gray-300">
            Products
          </Link>
          <Link to="/userRefunds" className="hover:text-gray-300">
            Refund
          </Link>
          <Link to="/returns/create" className="hover:text-gray-300">
            Return
          </Link>
          <Link to="/createtickets" className="hover:text-gray-300">
            Help
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
