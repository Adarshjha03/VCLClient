import React from "react";
import { FaGithub, FaLinkedin, FaBriefcase } from "react-icons/fa";

const DataCard = ({ icon, title, content }) => (
  <div className="card">
    {icon}
    <h2>{title}</h2>
    <p>{content}</p>
  </div>
);

export default DataCard;
