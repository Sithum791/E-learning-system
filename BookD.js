import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./BookD.css";

const BookD = () => {
  const { state } = useLocation();

  // Fallback dummy data in case no state is passed
  const dummyBook = {
    title: "Gone Girl",
    author: "Malshan Sithum",
    language: "English",
    rating: 4.8,
    description:
      "This is a sample description of the book. It includes details about the storyline, genre, and notable information. Gone Girl is a suspenseful thriller that explores the complexities of relationships.",
    downloadUrl: "https://example.com/gone-girl.pdf", // URL for the download
  };

  const book = state?.book || dummyBook;

  const [message, setMessage] = useState("");

  // Simulate book download
  const handleDownload = () => {
    // Simulate a download process
    try {
      // Assuming a successful download
      if (book.downloadUrl) {
        // Redirect to the download URL
        window.location.href = book.downloadUrl;
        setMessage("Download started successfully!");
      } else {
        throw new Error("Download link is not available.");
      }
    } catch (error) {
      setMessage("Failed to start the download. Please try again.");
    }
  };

  return (
    <div className="book-details-container">
      {/* Header Section */}
      <div className="book-details-header">
        <Link to="/" className="back-link">
          ← Back to Books
        </Link>
        <h1>Book Details</h1>
      </div>

      {/* Main Details Section */}
      <div className="book-details-card">
        <div className="book-cover-placeholder"></div>

        <div className="book-info">
          <p>
            <strong>Title:</strong> {book.title}
          </p>
          <p>
            <strong>Author:</strong> {book.author}
          </p>
          <p>
            <strong>Language:</strong> {book.language || "Not specified"}
          </p>
          <div className="rating">
            <strong>Rating:</strong>
            {"⭐".repeat(Math.floor(book.rating))} {book.rating}/5
          </div>
          <div className="review">
            <p>
              <strong>Malshan Sithum:</strong> A press release is a news story. It is written...
            </p>
            <Link to="/Feedback">
              <button className="more-btn">More</button>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="view-btn">View</button>
            <button className="download-btn" onClick={handleDownload}>
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="book-description">
        <h2>Description</h2>
        <p>{book.description}</p>
      </div>

      {/* Message Section */}
      {message && (
        <div className="message-container">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default BookD;
