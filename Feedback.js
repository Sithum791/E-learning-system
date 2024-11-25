import React, { useState, useEffect } from "react";
import axios from "axios"; // For making HTTP requests
import "./Feedback.css";

const Rate = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch comments from backend on component mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/comments/1") // Assuming book ID is 1
      .then((response) => setComments(response.data))
      .catch((error) => console.error("Error fetching comments:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment && newRating > 0) {
      const commentData = {
        book_id: 1, // Replace with dynamic book ID if needed
        user_name: "User", // Replace with dynamic user name if available
        comment: newComment,
        rating: newRating,
      };

      if (editingId !== null) {
        // Update existing comment
        axios
          .put(`http://localhost:5000/api/comments/${editingId}`, commentData)
          .then(() => {
            setComments((prev) =>
              prev.map((item) =>
                item.id === editingId
                  ? { ...item, comment: newComment, rating: newRating }
                  : item
              )
            );
            resetForm();
          })
          .catch((error) =>
            console.error("Error updating comment:", error)
          );
      } else {
        // Add a new comment
        axios
          .post("http://localhost:5000/api/comments", commentData)
          .then((response) => {
            setComments([...comments, response.data.newComment]);
            resetForm();
          })
          .catch((error) => console.error("Error adding comment:", error));
      }
    }
  };

  const handleEdit = (id) => {
    const commentToEdit = comments.find((item) => item.id === id);
    setNewComment(commentToEdit.comment);
    setNewRating(commentToEdit.rating);
    setHoverRating(commentToEdit.rating);
    setEditingId(id);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/comments/${id}`)
      .then(() => {
        setComments((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((error) => console.error("Error deleting comment:", error));
  };

  const resetForm = () => {
    setNewComment("");
    setNewRating(0);
    setHoverRating(0);
    setEditingId(null);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleStarClick = (rating) => setNewRating(rating);
  const handleStarHover = (rating) => setHoverRating(rating);
  const handleStarLeave = () => setHoverRating(0);

  return (
    <div className="rate-container">
      <header className="rate-header">
        <h1 className="rate-title">Comment & Rating</h1>
      </header>

      <div className="comments-section">
        {comments.map((item) => (
          <div key={item.id} className="comment-card">
            <div className="comment-profile">
              <div className="profile-image"></div>
              <div className="profile-details">
                <h3 className="profile-name">{item.user_name}</h3>
                <p className="profile-comment">{item.comment}</p>
              </div>
            </div>
            <div className="rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`star ${i < item.rating ? "filled" : ""}`}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="actions">
              <button className="edit-button" onClick={() => handleEdit(item.id)}>
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <form className="rating-form" onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="comment-input"
          placeholder="Enter your comment"
          rows="4"
        ></textarea>

        <div className="rating-input-section">
          <label>Rate: </label>
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`star ${
                i < (hoverRating || newRating) ? "filled interactive" : "interactive"
              }`}
              onClick={() => handleStarClick(i + 1)}
              onMouseEnter={() => handleStarHover(i + 1)}
              onMouseLeave={handleStarLeave}
            >
              ★
            </span>
          ))}
        </div>

        <button type="submit" className="submit-button">
          {editingId !== null ? "Update" : "Submit"}
        </button>
      </form>

      {showPopup && (
        <div className="popup-message">
          <p>
            {editingId !== null
              ? "Rating and Comment updated successfully!"
              : "Rating and Comment submitted successfully!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Rate;
