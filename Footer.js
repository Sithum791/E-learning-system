import React from "react";
import "./Footer.css";
import { FaFacebook, FaLinkedin, FaYoutube } from "react-icons/fa"; // Importing necessary icons

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2024 Libravese. All Rights Reserved.</p>
      <div className="social-icons">
        <i className="icon">
        <FaFacebook />
        </i>
        <i className="icon">
          <FaLinkedin />
        </i>
        <i className="icon">
          <FaYoutube />
        </i>
      </div>
    </footer>
  );
};

export default Footer;
