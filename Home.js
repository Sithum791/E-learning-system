import React from 'react';
import './Home.css';  // Import the CSS file
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      <div className="background-image"></div>  {/* Background image container */}
      <div className="content">
        <h1>Welcome to Libravese</h1>
        <h2>Your Online Book Haven</h2>
        <p>Read, Download, and Publish Your Favorite Books</p>
        <Link to="/AddBook"><button className="sign-up-button">Sign Up</button></Link>
        <p className="sign-in-link">If you have an account: <a href="#">Sign In</a></p>
      </div>
    </div>
  );
}

export default Home;