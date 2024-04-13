import React from 'react';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import LogoutButton from "./Logout";
const Navbar = () => {
  return (
    <div
      className="flex justify-between items-center p-4"
      style={{
        background: 'linear-gradient(315deg, #2234ae 0%, #191714 80%)',
      }}
    >
      <div className="text-xl font-bold text-white flex items-center">
        Navigation
      </div>
      <div className="flex items-center ">
            {/* Place LogoutButton component here */}
            <Link to="/Profile">
              <FaUser className="text-2xl text-white cursor-pointer" />
            </Link>
            <LogoutButton /> 
          </div>
    </div>
  );
};

export default Navbar;