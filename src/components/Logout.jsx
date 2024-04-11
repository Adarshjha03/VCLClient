import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove token from local storage
        localStorage.removeItem("Token");
        // Redirect to login page
        navigate('/');
        // Alternatively, you can refresh the page
        // window.location.reload();
    };

    return (
        <button onClick={handleLogout} className="btn btn-outline-light">Logout</button>
    );
}

export default LogoutButton