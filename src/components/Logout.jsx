import React from "react";
import { useNavigate } from "react-router-dom";
import logoutImage from '../assets/logout.png';

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
            <img src={logoutImage} alt="Logout" style={{ width: "auto", height: "1.5em" }} />
            <span className="sr-only">Logout</span> {/* Accessibility */}
        </button>
    );
}

export default LogoutButton;
