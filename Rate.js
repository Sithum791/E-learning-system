import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Rate.css";

const Rate = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Fetch comments from the backend when the component mounts
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/comments");
        const data = await response.json();
        setComments(data); // Set comments in state
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Handle comment submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newComment && newRating > 0) {
      try {
        const response = await fetch("http://localhost:5000/api/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "User", // Replace with actual username if required
            comment: newComment,
            rating: newRating,
          }),
        });

        if (response.ok) {
          const { newComment } = await response.json(); // Get the new comment from the server
          setComments([...comments, newComment]); // Add the new comment to the comments state
          setNewComment(""); // Reset the form fields
          setNewRating(0);
          setShowModal(false); // Close the modal
          setShowSuccessMessage(true); // Show success message
          setTimeout(() => setShowSuccessMessage(false), 3000); // Hide the success message after 3 seconds
        } else {
          console.error("Error adding comment:", response.statusText);
        }
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    }
  };

  return (
    <div className="rate-container">
      <header className="rate-header">
        <button className="back-button">←</button>
        <h1 className="rate-title">Comment & Rating</h1>
        <button className="write-review-button" onClick={() => setShowModal(true)}>
          Write Review
        </button>
      </header>

      <div className="comments-section">
        {comments.map((item) => (
          <div key={item.id} className="comment-card">
            <div className="comment-profile">
              <div className="profile-image"></div>
              <div className="profile-details">
                <h3 className="profile-name">{item.name}</h3>
                <p className="profile-comment">{item.comment}</p>
              </div>
            </div>
            <div className="rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`star ${i < item.rating ? "filled" : ""}`}>
                  ★
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Write Your Review</h2>
            <div className="rating-input">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`star ${i < newRating ? "filled" : ""}`}
                  onClick={() => setNewRating(i + 1)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your review here..."
              rows="4"
            ></textarea>
            <Link to="/Feedback"><button className="submit-button" onClick={handleSubmit}>
              Send
            </button></Link>
            <button className="close-button" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {showSuccessMessage && (
        <div className="success-message">Rating and Comment submitted successfully!</div>
      )}
    </div>
  );
};

export default Rate;
