import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://cyberrange-backend-dev.ap-south-1.elasticbeanstalk.com/signup', {
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
        <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
            <div className="bg-white p-4 rounded shadow" style={{ maxWidth: "400px" }}>
                <h2 className="mb-4 text-center">Register</h2>
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
                    <button type="submit" className="btn btn-success w-100" style={{ backgroundColor: "#198754", borderColor: "#198754" }}>Register</button>
                </form>
                <p className="text-center mt-3">Already have an account? <Link to="/login" className="btn btn-success w-100" style={{ backgroundColor: "#198754", borderColor: "#198754" }}>Login</Link></p>
            </div>
        </div>
    );
}

export default Signup;