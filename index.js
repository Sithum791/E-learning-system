const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (for uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Your MySQL username
  password: "1234", // Your MySQL password
  database: "book_store", // Ensure this matches your actual database name
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1); // Exit the application if the connection fails
  }
  console.log("Connected to MySQL database.");
});

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads')); // Use __dirname to set path relative to the current file
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});


const upload = multer({ storage });

// Existing routes for comments
app.get("/api/comments/:bookId", (req, res) => {
  const { bookId } = req.params;
  const query = "SELECT * FROM comments WHERE book_id = ?";

  db.query(query, [bookId], (err, results) => {
    if (err) {
      console.error("Error fetching comments:", err.message);
      return res.status(500).json({ message: "Database query error", error: err.message });
    }
    res.status(200).json(results);
  });
});

app.post("/api/comments", (req, res) => {
  const { book_id, user_name, comment, rating } = req.body;

  if (!book_id || !user_name || !comment || !rating) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const query = "INSERT INTO comments (book_id, user_name, comment, rating) VALUES (?, ?, ?, ?)";
  db.query(query, [book_id, user_name, comment, rating], (err, result) => {
    if (err) {
      console.error("Error adding comment:", err.message);
      return res.status(500).json({ message: "Error adding comment", error: err.message });
    }

    res.status(201).json({
      message: "Comment added successfully!",
      newComment: {
        id: result.insertId,
        book_id,
        user_name,
        comment,
        rating,
      },
    });
  });
});

app.put("/api/comments/:id", (req, res) => {
  const { id } = req.params;
  const { comment, rating } = req.body;

  if (!comment || !rating) {
    return res.status(400).json({ message: "Comment and rating are required!" });
  }

  const query = "UPDATE comments SET comment = ?, rating = ? WHERE id = ?";
  db.query(query, [comment, rating, id], (err, result) => {
    if (err) {
      console.error("Error updating comment:", err.message);
      return res.status(500).json({ message: "Error updating comment", error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Comment not found!" });
    }

    res.status(200).json({ message: "Comment updated successfully!" });
  });
});

app.delete("/api/comments/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM comments WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting comment:", err.message);
      return res.status(500).json({ message: "Error deleting comment", error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Comment not found!" });
    }

    res.status(200).json({ message: "Comment deleted successfully!" });
  });
});

// New Features

// POST route to add a new book with image upload
app.post("/api/books", upload.single("coverUrl"), (req, res) => {
  const { title, author, category } = req.body;
  const coverUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !author || !category || !coverUrl) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const query = "INSERT INTO books (title, author, category, cover_url) VALUES (?, ?, ?, ?)";
  db.query(query, [title, author, category, coverUrl], (err, result) => {
    if (err) {
      console.error("Error adding book:", err.message);
      return res.status(500).json({ message: "Error adding book", error: err.message });
    }

    res.status(201).json({
      message: "Book added successfully!",
      newBook: {
        id: result.insertId,
        title,
        author,
        category,
        coverUrl,
      },
    });
  });
});

// GET route to fetch all books
app.get("/api/books", (req, res) => {
  const query = "SELECT * FROM books";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching books:", err.message);
      return res.status(500).json({ message: "Error fetching books", error: err.message });
    }
    res.status(200).json(results);
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:5000`);
});
