import React from "react";
import { useNavigate } from "react-router-dom";
import {FaSignOutAlt} from 'react-icons/fa'; 
function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove token from local storage
        localStorage.removeItem("Token");
        localStorage.removeItem("selectedToken");
        // Redirect to login page
        navigate('/');
        // Alternatively, you can refresh the page
        // window.location.reload();
    };

    return (
        <button onClick={handleLogout} className="btn btn-outline-light p-2 mx-2" style={{ minWidth: "unset", padding: "0", border: "none", backgroundColor: "transparent" }}>
           
            <FaSignOutAlt className="w-auto h-7  mr-2" />
            <span className="sr-only">Logout</span> {/* Accessibility */}
        </button>
    );
}

export default LogoutButton;
