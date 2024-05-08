import { Hero, Navbar, Companies, Courses, Achievement, Categories, Feedback, CTA, Footer } from './components';
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from 'react';

const LandingPage = () => {

  return (
    <div style={{
      backgroundImage: `url('src/LandingPage.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
    }}>

<div className='w-full h-[80px] bg-black border-b'>
      <div className='md:max-w-[1480px] max-w-[600px] m-auto w-full h-full flex justify-between items-center md:px-0 px-4'>

        {/* Logo */}
        <div>
          <img src='logo.png' alt="Logo" className="h-12" />
        </div>

        {/* Menu */}
        <div className='md:flex items-center'>
          <ul className='flex gap-4'>
            <Link to="/Home" className="text-white hover:text-blue-500">Home</Link>
            <li className="text-white hover:text-blue-500">About</li>
            <li className="text-white hover:text-blue-500">Support</li>
            <li className="text-white hover:text-blue-500">Platform</li>
            <li className="text-white hover:text-blue-500">Pricing</li>
          </ul>
        </div>

        {/* Login and Sign Up buttons */}
        <div className='hidden md:flex'>
          <Link to="/login" className="flex justify-between items-center bg-transparent px-6 gap-2 text-white hover:text-blue-500">
            Login
          </Link>
          <Link to="/signup" className="px-8 py-3 rounded-md bg-[#20B486] text-white font-bold hover:bg-[#178e6b]">
            Sign Up For Free
          </Link>
        </div>

      </div>
    </div>
      {/* <Navbar />
        <Hero />
        <Feedback />
        <CTA />
        <Footer /> */}
    </div>
  )
}

export default LandingPage;
