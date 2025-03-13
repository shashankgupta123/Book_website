import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import "../../CSS/purchaseBook.css"; // Make sure the path to the CSS is correct

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
        return <div className="container">Loading...</div>;
    }

    if (error) {
        return <div className="container">{error}</div>;
    }

    return (
        <div className="container">
            <h1>Books List</h1>
            {books.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Publisher</th>
                            <th>Genre</th>
                            <th>Purchase Date</th>
                            <th>Price (₹)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book._id}>
                                <td>{book.bookTitle}</td>
                                <td>{book.author}</td>
                                <td>{book.publisher}</td>
                                <td>{book.genre}</td>
                                <td>{new Date(book.purchaseDate).toLocaleDateString()}</td>
                                <td>{book.price}</td>
                                <td>
                                    <button onClick={() => handleFetchBook(book._id)}>
                                        Fetch Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No books found</p>
            )}
        </div>
    );
};

export default Books;
