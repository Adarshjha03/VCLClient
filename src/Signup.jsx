import animation from "./assets/GIF.json";
import Lottie from "lottie-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const backendUrl = "https://api.virtualcyberlabs.com";
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${backendUrl}/signup`, {
            "email": email,
            "username": name,
            "password": password
        })
        .then(result => {
            console.log(result.data);
            if (result.data.message === "User created successfully") {
                navigate('/login');
            } else {
                alert("Invalid credentials");
            }
        })
        .catch(err => {
            console.log(err);
            alert("Invalid credentials");
        });
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "linear-gradient(315deg, #2234ae 0%, #191714 74%)" }}>
            <div className="bg-white p-4 rounded shadow" style={{ maxWidth: "400px" }}>
                <h2 className="mb-4 text-center font-weight-bold">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input 
                            type="text"
                            name="name"
                            autoComplete="off"
                            placeholder="Enter Name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-success w-100" 
                        style={{ 
                            background: "linear-gradient(315deg, #2234ae 0%, #191714 74%)", 
                            color: "#fff", 
                            border: "none",
                            transition: "color 0.3s, background-color 0.3s", // Add transition effect for color and background-color
                            animation: "none" // Initially set animation to none
                        }}
                        onMouseEnter={(e) => { 
                            e.target.style.color = "#F0DB4F"; // Change text color on hover
                            e.target.style.backgroundColor = "#0D6EFD"; // Add animation effect on hover
                        }}
                        onMouseLeave={(e) => { 
                            e.target.style.color = "#fff"; // Restore text color when not hovered
                            e.target.style.backgroundColor = "linear-gradient(315deg, #2234ae 0%, #191714 74%)"; // Restore background color when not hovered
                        }}
                    >
                        Register
                    </button>
                </form>
                <p className="text-center mt-3">Already have an account? <Link to="/login" className="btn btn-success w-100" style={{ background: "linear-gradient(315deg, #2234ae 0%, #191714 74%)", color: "#fff", border: "none" }}>Login</Link></p>
            </div>
            
        </div>
    );
}

export default Signup;
