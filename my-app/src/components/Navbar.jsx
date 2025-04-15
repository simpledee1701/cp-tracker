import React from 'react';

const Navbar = () => {
  return (
    <div className="navbar bg-black bg-opacity-50 backdrop-blur-md p-4 flex justify-between items-center border-b border-white border-opacity-20">
      <div className="logo text-2xl font-bold text-white">MySite</div>
      <div className="nav-links flex space-x-6">
        <a href="#" className="text-white text-lg hover:text-pink-500 transition-colors">Home</a>
        <a href="#" className="text-white text-lg hover:text-pink-500 transition-colors">About</a>
        <a href="#" className="text-white text-lg hover:text-pink-500 transition-colors">Services</a>
        <a href="#" className="text-white text-lg hover:text-pink-500 transition-colors">Contact</a>
      </div>
    </div>
  );
};

export default Navbar;
