import React, { useState } from "react";
import axios from "axios";
import "./AddBook.css";

const AddBook = ({ onBookAdded }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverUrl(file);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title || !author || !category || !coverUrl) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("category", category);
    formData.append("coverUrl", coverUrl);

    axios
      .post("http://localhost:5000/api/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Book added successfully!");
        onBookAdded(response.data.book); // Notify parent about new book
        setTitle("");
        setAuthor("");
        setCategory("");
        setCoverUrl("");
        setImagePreview("");
      })
      .catch((error) => {
        console.error("Error adding book:", error);
      });
  };

  const triggerFileInput = () => {
    document.getElementById("coverImageInput").click();
  };

  return (
    <div className="add-book-container">
      <header className="add-book-header">
        <button className="back-button">←</button>
        <h1>Add Book</h1>
      </header>
      <div className="form-container">
        <div className="cover-container">
          <div className="cover-placeholder">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="cover-preview" />
            ) : (
              <button
                className="add-cover-button"
                onClick={triggerFileInput}
              >
                Add Cover
              </button>
            )}
          </div>
          <input
            type="file"
            id="coverImageInput"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>
        <form onSubmit={handleSubmit} className="book-form">
          <label>Author Name</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author name"
          />
          <label>Book Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter book title"
          />
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Thriller">Thriller</option>
            <option value="Romance Novel">Romance Novel</option>
            <option value="Horror">Horror</option>
          </select>
          <button type="submit" className="submit-button">
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
