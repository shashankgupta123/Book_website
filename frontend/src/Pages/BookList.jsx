import React, { useEffect, useState } from 'react';
import { getBooks, deleteBook } from '../service/bookService'; 
import '../CSS/BookList.css';
import { FaBook, FaEdit, FaTrashAlt, FaCalendarAlt, FaUser } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import TrendingBooks from '../component/Recommendation/TrendingBook';
import SimilarBooks from '../component/Recommendation/SimilarBook';
// import MostVisitedBooks from '../component/Recommendation/MostVisted';
import LastSearches from '../component/Recommendation/LastSearch';
import FavouriteBooks from '../component/Recommendation/Favourite';

const BookList = () => {
    const [books, setBooks] = useState([]); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const bookData = await getBooks(); 
                console.log("Fetched Book Data:", bookData); 
                setBooks(bookData || []); 
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };
        fetchBooks();
    }, []);

    const handleCardClick = async (bookId, title, author, genre, description, imageUrl, price, publisher) => {
        try {
          const userId = localStorage.getItem("userId");
      
          if (!userId || !bookId || !title || !author || !genre || !description || !imageUrl ||!price ||!publisher) {
            console.error("Missing required fields:", { userId, bookId, title, author, genre, description, imageUrl,price });
            return;
          }

          const response = await fetch("http://localhost:5000/api/users/record-visit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              bookId,
              title,
              author,
              genre,
              description,
              imageUrl,
              price,
              publisher,
            }),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log("Click data saved successfully:", data);
      
          navigate(`/books/details/${title}`);
        } catch (error) {
          console.error("Error saving click data:", error.message);
        }
      };      

      return (
        <div className="book-list-container">
            <div className="background-image"></div>
            {/* <div className="book-images-top">
                {books.slice(0, 3).map((book) => (  
                    <img key={book._id} src={book.imageUrl} alt={book.title} className="book-top-image" />
                ))}
            </div> */}

                <TrendingBooks />

                <SimilarBooks/>

                {/* <MostVisitedBooks /> */}

                <LastSearches />

                <FavouriteBooks />

            <h1>Available Books</h1>
            <div className="book-grid">
                {books.length > 0 ? (
                    books.map((book) => (
                        <div
                            key={book._id}
                            className="book-card"
                            onClick={() => handleCardClick(book._id, book.title, book.author, book.genre, book.description, book.imageUrl, book.price, book.publisher)} 
                        >
                            <div className="book-header">
                                <h2>{book.title}</h2>
                                <p><FaUser /> <strong>Author:</strong> {book.author}</p>
                                <p><FaCalendarAlt /> <strong>Publication Date:</strong> {new Date(book.publicationDate).toLocaleDateString()}</p>
                            </div>
                            <div className="book-image">
                                <img src={book.imageUrl} alt={book.title} className="book-image" />
                            </div>
                            <div className="book-details">
                                <p><FaBook /> <strong>Publisher:</strong> {book.publisher}</p>
                                <p><FaBook /> <strong>Genre:</strong> {book.genre}</p>
                                <p><FaBook /> <strong>Price:</strong> ₹{book.price.toLocaleString()}</p>
                                <p><FaBook /> <strong>Year:</strong> {book.year}</p>
                                <p><FaBook /> <strong>Available Formats:</strong> {book.availableFormats.join(', ')}</p>
                                <p><FaBook /> <strong>Description:</strong> {book.description}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No books available.</p>
                )}
            </div>
        </div>
      );
};

export default BookList;