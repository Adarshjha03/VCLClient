import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://cyberrange-backend-dev.ap-south-1.elasticbeanstalk.com/login', { "username": username, "password": password });
            if (response.data.token) {
                localStorage.setItem("Token", response.data.token);
                navigate('/Home');
            } else {
                alert("Invalid credentials");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(315deg, #2234ae 0%, #191714 74%)" }}>
            <div className="bg-white p-4 rounded shadow" style={{ maxWidth: "400px" }}>
                <h2 className="mb-4 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter Username"
                            className="form-control"
                            style={{ backgroundColor: "#fff", color: "#000" }} // Changed background to white and text color to black
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            className="form-control"
                            style={{ backgroundColor: "#fff", color: "#000" }} // Changed background to white and text color to black
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100" style={{ background: "linear-gradient(315deg, #2234ae 0%, #191714 120%)", color: "#fff", border: "none" }}>Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;