import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import animation from "./assets/GIF.json";
import Lottie from "lottie-react";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const backendUrl = "https://api.virtualcyberlabs.com";

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${backendUrl}/signup`, {
        email: email,
        username: username,
        password: password,
        first_name: firstName,
        last_name: lastName
      })
      .then((result) => {
        console.log(result.data);
        if (result.data.message === "User created successfully") {
          navigate("/login");
        } else {
          alert("Invalid credentials");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Invalid credentials");
      });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(315deg, #2234ae 0%, #191714 74%)",
      }}
    >
      {/* Animation on the right */}
      <div className="hidden md:block w-1/2 pl-4">
        <Lottie
          animationData={animation}
          className="w-4/5 h-4/5"
        />
      </div>

      {/* Signup form on the left */}
      <div
        className="bg-white p-4 rounded shadow"
        style={{ maxWidth: "440px" }} // Increase width by 10%
      >
        <h2 className="mb-4 text-center font-weight-bold text-xl">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 flex flex-col md:flex-row">
            <div className="w-full md:pr-2 mb-3 md:mb-0">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter First Name"
                className="form-control  w-full border-gray-300 rounded"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="w-full md:pl-2">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter Last Name"
                className="form-control w-full border-gray-300 rounded"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
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
            <label htmlFor="password" className="form-label">
              Password
            </label>
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
            Register
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link
            to="/login"
            className="btn btn-success w-100"
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
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
