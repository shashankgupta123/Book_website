import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../CSS/purchaseBook.css"; // Updated CSS file name

const Books = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/purchases');
                setBooks(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching books');
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleFetchBook = (id) => {
        navigate(`/purchase-details/${id}`);
    };

    if (loading) {
        return <div className="book-list-container">Loading...</div>;
    }

    if (error) {
        return <div className="book-list-container">{error}</div>;
    }

    return (
        <div className="book-list-container">
            <h1 className="book-list-title">Books List</h1>
            {books.length > 0 ? (
                <table className="book-list-table">
                    <thead>
                        <tr>
                            <th className="book-list-header">Title</th>
                            <th className="book-list-header">Author</th>
                            <th className="book-list-header">Publisher</th>
                            <th className="book-list-header">Genre</th>
                            <th className="book-list-header">Purchase Date</th>
                            <th className="book-list-header">Price (₹)</th>
                            <th className="book-list-header">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book._id} className="book-list-row">
                                <td className="book-list-cell">{book.bookTitle}</td>
                                <td className="book-list-cell">{book.author}</td>
                                <td className="book-list-cell">{book.publisher}</td>
                                <td className="book-list-cell">{book.genre}</td>
                                <td className="book-list-cell">{new Date(book.purchaseDate).toLocaleDateString()}</td>
                                <td className="book-list-cell">{book.price}</td>
                                <td className="book-list-cell">
                                    <button className="book-list-button" onClick={() => handleFetchBook(book._id)}>
                                        Fetch Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="book-list-empty">No books found</p>
            )}
        </div>
    );
};

export default Books;
