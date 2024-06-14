import { Hero } from './components';
import { Link } from "react-router-dom";
import React, { useState } from 'react';
import bgimage from "./LandingPage.jpg";
import { FaBars, FaTimes } from 'react-icons/fa';
const LandingPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div style={{
      backgroundImage: `url(${bgimage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
    }}> 

<div className='w-full h-[80px] bg-black '>
      <div className=' m-auto w-full h-full flex justify-between items-center px-0 px-4'>
        {/* Menu */}
        <div className='flex items-center'>
        <div className='md:hidden' onClick={toggleMenu}>
              {isOpen ? (
                <FaTimes className="text-white text-2xl" />
              ) : (
                <FaBars className="text-white text-2xl" />
              )}
            </div>
            <ul className={`flex-col md:flex-row md:flex gap-4 absolute md:static top-[80px] left-0 w-full md:w-auto bg-black md:bg-transparent ${isOpen ? 'flex' : 'hidden'}`}>
            <Link to="/Home" className="text-white hover:text-blue-500">Home</Link>
            <li className="text-white hover:text-blue-500">About</li>
            <li className="text-white hover:text-blue-500">Support</li>
            <li className="text-white hover:text-blue-500">Platform</li>
            <li className="text-white hover:text-blue-500">Pricing</li>
          </ul>
        </div>

        {/* Login and Sign Up buttons */}
        <div className='flex space-x-3'>
          <Link to="/login" className="px-6 py-2 rounded-md bg-blue-800 text-white font-bold hover:bg-blue-600">
            Login
          </Link>
          <Link to="/signup" className="px-6 py-2 rounded-md bg-blue-800 text-white font-bold hover:bg-blue-600">
            Sign Up 
          </Link>
        </div>

      </div>
    </div>
         <Hero />
    </div>
  )
}

export default LandingPage;
