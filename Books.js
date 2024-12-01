import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Books.css";

const ViewBooks = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [updatedBook, setUpdatedBook] = useState({ title: "", author: "", category: "" });
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    axios
      .get("http://localhost:5000/api/books")
      .then((response) => setBooks(response.data))
      .catch((error) => console.error("Error fetching books:", error));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/books/${id}`)
      .then(() => {
        setPopupMessage("Book deleted successfully!");
        setShowPopup(true);
        fetchBooks();
      })
      .catch((error) => {
        setPopupMessage("Error deleting book!");
        setShowPopup(true);
        console.error("Error deleting book:", error);
      });
  };

  const handleEdit = (book) => {
    setEditingBook(book.id);
    setUpdatedBook({ title: book.title, author: book.author, category: book.category });
  };

  const handleUpdate = (id) => {
    const formData = new FormData();
    formData.append("title", updatedBook.title);
    formData.append("author", updatedBook.author);
    formData.append("category", updatedBook.category);
    if (updatedBook.coverUrl) {
      formData.append("coverUrl", updatedBook.coverUrl);
    }

    axios
      .put(`http://localhost:5000/api/books/${id}`, formData)
      .then(() => {
        console.log("Update successful");
        setPopupMessage("Book updated successfully!");
        setShowPopup(true);
        setEditingBook(null);
        fetchBooks();
      })
      .catch((error) => {
        console.error("Error updating book:", error);
        setPopupMessage("Error updating book!");
        setShowPopup(true);
      });
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage("");
  };

  return (
    <div className="view-books">
      <h1>Book List</h1>
      {showPopup && (
        <div className="popup">
          <p>{popupMessage}</p>
          <button onClick={closePopup}>Close</button>
        </div>
      )}
      <ul>
        {books.map((book) => (
          <li key={book.id} className="book-item">
            {editingBook === book.id ? (
              <div>
                <input
                  type="text"
                  value={updatedBook.title}
                  onChange={(e) => setUpdatedBook({ ...updatedBook, title: e.target.value })}
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={updatedBook.author}
                  onChange={(e) => setUpdatedBook({ ...updatedBook, author: e.target.value })}
                  placeholder="Author"
                />
                <input
                  type="text"
                  value={updatedBook.category}
                  onChange={(e) => setUpdatedBook({ ...updatedBook, category: e.target.value })}
                  placeholder="Category"
                />
                <input
                  type="file"
                  onChange={(e) => setUpdatedBook({ ...updatedBook, coverUrl: e.target.files[0] })}
                />
                <button onClick={() => handleUpdate(book.id)}>Save</button>
                <button onClick={() => setEditingBook(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <h2>{book.title}</h2>
                <p>{book.author}</p>
                <p>{book.category}</p>
                {book.cover_url && (
                  <img src={`http://localhost:5000/${book.cover_url}`} alt={book.title} />
                )}
                <button onClick={() => handleEdit(book)}>Edit</button>
                <button onClick={() => handleDelete(book.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewBooks;
