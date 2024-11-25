import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Books.css";
import AddBook from "./AddBook";  // Import AddBook component

const Books = () => {
  const [books, setBooks] = useState([]);
  const [editBook, setEditBook] = useState(null); // Track the book being edited

  useEffect(() => {
    // Fetch all books from the backend
    axios
      .get("http://localhost:5000/api/books")
      .then((response) => {
        setBooks(response.data.books);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });
  }, []);

  const handleBookAdded = (newBook) => {
    setBooks([...books, newBook]);  // Add the newly added book to the list
  };

  const handleDeleteBook = (bookId) => {
    axios
      .delete(`http://localhost:5000/api/books/${bookId}`)
      .then(() => {
        setBooks(books.filter((book) => book._id !== bookId));  // Remove deleted book from list
      })
      .catch((error) => {
        console.error("Error deleting book:", error);
      });
  };

  const handleEditBook = (book) => {
    setEditBook(book);  // Set the book to edit
  };

  const handleUpdateBook = (updatedBook) => {
    axios
      .put(`http://localhost:5000/api/books/${updatedBook._id}`, updatedBook)
      .then((response) => {
        setBooks(books.map((book) => (book._id === updatedBook._id ? response.data.book : book)));
        setEditBook(null);  // Clear editing state after update
      })
      .catch((error) => {
        console.error("Error updating book:", error);
      });
  };

  return (
    <div className="books-container">
      <header className="books-header">
        <h1>Books</h1>
        <AddBook onBookAdded={handleBookAdded} />  {/* Display AddBook form */}
      </header>
      <div className="book-list">
        {books.map((book) => (
          <div className="book-card" key={book._id}>
            <img src={book.coverUrl} alt={book.title} className="book-cover" />
            <div className="book-details">
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <p>{book.category}</p>
              <button onClick={() => handleDeleteBook(book._id)} className="delete-button">
                Delete
              </button>
              <button onClick={() => handleEditBook(book)} className="edit-button">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
      {editBook && (
        <div className="edit-book-form">
          <h2>Edit Book</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateBook(editBook);
            }}
          >
            <input
              type="text"
              value={editBook.title}
              onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
            />
            <input
              type="text"
              value={editBook.author}
              onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
            />
            <input
              type="text"
              value={editBook.category}
              onChange={(e) => setEditBook({ ...editBook, category: e.target.value })}
            />
            <button type="submit">Update</button>
            <button onClick={() => setEditBook(null)} type="button">
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Books;
