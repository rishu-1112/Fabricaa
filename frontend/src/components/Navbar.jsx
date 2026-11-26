import React, { useState } from "react";
import { Menu, X } from "react-feather";
import { Link } from "react-router-dom";
import logo from "../assets/newLOGO-Photoroom.png"; // use your logo path here
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
        {/* Logo + Name */}
        <div className="flex items-center space-x-4">
          <div className="transform transition-transform duration-300 hover:scale-410">
            <img src={logo} alt="FABRICAA Logo" className="h-14 w-auto object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-wide">FABRICAA</h1>
            <p className="text-sm text-gray-500 -mt-1">Innovating Textiles</p>
          </div>
        </div>

        {/* Desktop Navbar Links */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <li className="hover:text-blue-600 cursor-pointer border-b-2 border-transparent hover:border-blue-600 transition">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-blue-600 cursor-pointer border-b-2 border-transparent hover:border-blue-600 transition">
            <Link to="/products">Products</Link>
          </li>
          <li className="hover:text-blue-600 cursor-pointer border-b-2 border-transparent hover:border-blue-600 transition">
            <Link to="/about">About</Link>
          </li>
          <li className="hover:text-blue-600 cursor-pointer border-b-2 border-transparent hover:border-blue-600 transition">
            <Link to="/contact">Contact</Link>
          </li>
          <li className="hover:text-blue-600 cursor-pointer border-b-2 border-transparent hover:border-blue-600 transition">
            <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                {totalItems}
              </span>
            )}
            </Link>
          </li>
        </ul>

        {/* Hamburger Menu Button */}
        <button onClick={toggleMenu} className="md:hidden text-gray-700">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden bg-white px-6 pb-4 space-y-3 text-gray-700 font-medium border-t">
          <li>
            <Link to="/" onClick={() => setIsOpen(false)} className="block hover:text-blue-600 py-2">Home</Link>
          </li>
          <li>
            <Link to="/products" onClick={() => setIsOpen(false)} className="block hover:text-blue-600 py-2">Products</Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block hover:text-blue-600 py-2">About</Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block hover:text-blue-600 py-2">Contact</Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
