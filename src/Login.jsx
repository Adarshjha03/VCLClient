import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import animation from "./assets/GIF.json";
import Lottie from "lottie-react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const backendUrl = "https://api.virtualcyberlabs.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/login`, {
        username: username,
        password: password,
      });
      if (response.data.token) {
        localStorage.setItem("Token", response.data.token);
        localStorage.setItem("selectedTopic", 0);
        navigate("/Home");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(315deg, #2234ae 0%, #191714 74%)" }}
    >
      {/* Lottie animation */}
      <div className="w-50 pr-4">
        <Lottie animationData={animation} style={{ width: "80%", height: "80%" }} />
      </div>

      {/* Login box */}
      <div className="bg-white p-4 rounded shadow w-49" style={{ maxWidth: "400px" }}>
        <h2 className="mb-4 text-center text-xl">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              className="form-control"
              style={{ backgroundColor: "#fff", color: "#000" }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              className="form-control"
              style={{ backgroundColor: "#fff", color: "#000" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-success w-100 mb-3"
            style={{
              background:
                "linear-gradient(315deg, #2234ae 0%, #191714 74%)",
              color: "#fff",
              border: "none",
              transition: "color 0.3s, background-color 0.3s",
              animation: "none",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#F0DB4F";
              e.target.style.backgroundColor = "#0D6EFD";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#fff";
              e.target.style.background =
                "linear-gradient(315deg, #2234ae 0%, #191714 74%)";
            }}
          >
            Login
          </button>
        </form>
        <p className="text-center">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="btn btn-success w-100 mt-1"
            style={{
              background:
                "linear-gradient(315deg, #2234ae 0%, #191714 74%)",
              color: "#fff",
              border: "none",
              transition: "color 0.3s, background-color 0.3s",
              animation: "none",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#F0DB4F";
              e.target.style.backgroundColor = "#0D6EFD";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#fff";
              e.target.style.background =
                "linear-gradient(315deg, #2234ae 0%, #191714 74%)";
            }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
