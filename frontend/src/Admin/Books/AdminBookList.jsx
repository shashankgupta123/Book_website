import React, { useEffect, useState } from 'react';
import { getBooks, deleteBook } from '../../service/bookService'; 
import { Link } from 'react-router-dom';
import '../../CSS/AdminBookList.css';

const AdminBookList = () => {
    const [books, setBooks] = useState([]); 

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

    const handleDelete = async (title) => {
        try {
            const result = await deleteBook(title); 
            if (result.success) {
                setBooks((prevBooks) => prevBooks.filter((book) => book.title !== title)); 
                alert("Book deleted successfully");
            } else {
                alert("Failed to delete the book");
            }
        } catch (error) {
            console.error("Error deleting book:", error);
            alert("Error deleting the book");
        }
    };

    return (
        <div>
            <h1>Books</h1>
            <Link to="/books/add" className="add-new-book-btn">Add New Book</Link>
            <div className="book-grid">
                {Array.isArray(books) && books.length > 0 ? (
                    books.map((book) => (
                        <div key={book._id} className="book-card">
                            <div className="book-header">
                                <h2>{book.title}</h2>
                                <p><strong>Price:</strong> ₹{book.price?.toLocaleString() || 'N/A'}</p>
                            </div>
                            <div className="book-images">
                                <img src={book.imageUrl} alt={book.title} />
                            </div>
                            <div className="book-details">
                                <p><strong>Author:</strong> {book.author}</p>
                                <p><strong>Publisher:</strong> {book.publisher}</p>
                                <p><strong>Publication Date:</strong> {new Date(book.publicationDate).toLocaleDateString()}</p>
                                <p><strong>Genre:</strong> {book.genre}</p>
                                <p><strong>Description:</strong> {book.description}</p>
                                <p><strong>Available Formats:</strong> {book.availableFormats.join(', ')}</p>
                                <div className="book-locations">
                                    <h3>Available Locations:</h3>
                                    {book.locations && book.locations.length > 0 ? (
                                        <ul>
                                            {book.locations.map((location, index) => (
                                                <li key={index}>
                                                    <p><strong>Place:</strong> {location.placeName}</p>
                                                    <p><strong>Latitude:</strong> {location.latitude}</p>
                                                    <p><strong>Longitude:</strong> {location.longitude}</p>
                                                    <p><strong>Quantity:</strong> {location.quantity}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No locations available</p>
                                    )}
                                </div>
                            </div>
                            <div className="book-actions">
                                <Link to={`/books/update/${book.title}`}>Edit</Link>
                                <button onClick={() => handleDelete(book.title)}>Delete</button>
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

export default AdminBookList;