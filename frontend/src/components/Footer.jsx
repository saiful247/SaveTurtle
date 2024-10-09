import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          {/* INFO */}
          <div>
            <h3 className="text-base font-semibold mb-2">INFO</h3>
            <p>SAVETURTLE.LK</p>
            <p>(123) 456-7890</p>
            <p>info@saveturtle.lk</p>
            <p>123 Sea Turtle St.</p>
            <p>Colombo, Sri Lanka 00100</p>
          </div>

          {/* COMPANY INFORMATION */}
          <div>
            <h3 className="text-base font-semibold mb-2">COMPANY INFORMATION</h3>
            <ul className="space-y-1">
              <li><a href="/about" className="hover:text-gray-300">About Us</a></li>
              <li><a href="/mission" className="hover:text-gray-300">Our Mission</a></li>
              <li><a href="/news" className="hover:text-gray-300">News & Education</a></li>
              <li><a href="/contact" className="hover:text-gray-300">Contact Us</a></li>
              <li><a href="/search" className="hover:text-gray-300">Search</a></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-base font-semibold mb-2">SUPPORT</h3>
            <ul className="space-y-1">
              <li><a href="/shipping" className="hover:text-gray-300">Shipping & Returns</a></li>
              <li><a href="/terms" className="hover:text-gray-300">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-gray-300">Privacy Policy</a></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="text-base font-semibold mb-2">NEWSLETTER</h3>
            <p className="mb-2">Sign up for news and updates.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your e-mail"
                className="bg-gray-800 text-white px-3 py-1 rounded-l-md w-full text-sm"
              />
              <button className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-r-md">
                →
              </button>
            </div>
          </div>
        </div>

        {/* FOLLOW US */}
        <div className="mt-4 flex justify-between items-center">
          <div>
            <h3 className="text-base font-semibold mb-2">FOLLOW US</h3>
            <div className="flex space-x-3">
              <a href="#" className="hover:text-gray-300"><Facebook size={20} /></a>
              <a href="#" className="hover:text-gray-300"><Twitter size={20} /></a>
              <a href="#" className="hover:text-gray-300"><Instagram size={20} /></a>
              <a href="#" className="hover:text-gray-300"><Youtube size={20} /></a>
            </div>
          </div>
          
          {/* CURRENCY SELECTOR */}
          <div>
            <select className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm">
              <option>Sri Lanka (LKR Rs)</option>
              {/* Add more currency options as needed */}
            </select>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-4 pt-4 border-t border-gray-800 text-center text-xs">
          <p>Web Design by Acorn Strategy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;