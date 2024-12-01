import React, { useState, useEffect } from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from "axios";  
import NavBar from './Component/NavBar';
import Footer from './Component/Footer';
import AddBook from './Pages/AddBook';
import BookD from './Pages/BookD';
import Books from './Pages/Books';
import Feedback from './Pages/Feedback';
import Rate from './Pages/Rate';
import Home from './Home';

function App() {
  const [books, setBooks] = useState([]);

  // Fetch books from the backend
  const fetchBook = () => {
    axios
      .get("http://localhost:5000/api/books") 
      .then((response) => {
        setBooks(response.data.books); 
      })
      .catch((error) => console.error("Error fetching books:", error));
  };

  // Fetch books when the component mounts
  useEffect(() => {
    fetchBook();
  }, []);

  // Handle adding a new book and updating the list
  const handleBookAdded = (newBook) => {
    setBooks((prevBooks) => [...prevBooks, newBook]);
  };

  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/AddBook" element={<AddBook onBookAdded={handleBookAdded} />} />
          <Route path="/Books" element={<Books books={books} />} />
          <Route path="/BookD/:title" element={<BookD books={books} />} />
          <Route path="/Feedback" element={<Feedback />} />
          <Route path="/Rate" element={<Rate/>}/>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
  
}

export default App;
