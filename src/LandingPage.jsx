import { Hero, Navbar, Companies, Courses, Achievement, Categories, Feedback, CTA, Footer } from './components';
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import bgimage from "./LandingPage.jpg";
const LandingPage = () => {

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
          <ul className='flex gap-4'>
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
      {/* <Navbar />
        <Hero />
        <Feedback />
        <CTA />
        <Footer /> */}
         <Hero />
    </div>
  )
}

export default LandingPage;
