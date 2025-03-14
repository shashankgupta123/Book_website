import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 
// import "../../CSS/BookDetails.css";

const BookDetails = () => {
    const { id } = useParams(); 
    const navigate = useNavigate(); 
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/purchase/${id}`); // Updated endpoint for books
                setBook(response.data);
                setLoading(false);
            } catch (err) {
                setError('Book not found with the provided ID.');
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="book-details-container">
            {book && (
                <div className="book-details-info">
                    <h1>Books Details</h1>
                    <p><span className="book-details-label">Username:</span> {book.user.username}</p>
                    <p><span className="book-details-label">Email:</span> {book.user.email}</p>
                    <p><span className="book-details-label">Phone:</span> {book.user.phone}</p>
                    <p><span className="book-details-label">Book Title:</span> {book.bookTitle}</p>
                    <p><span className="book-details-label">Author:</span> {book.author}</p>
                    <p><span className="book-details-label">Publisher:</span> {book.publisher}</p>
                    <p><span className="book-details-label">Genre:</span> {book.genre}</p>
                    <p><span className="book-details-label">Publication Date:</span> {new Date(book.publicationDate).toLocaleDateString()}</p>
                    <p><span className="book-details-label">Selected Format:</span> {book.selectedFormat}</p>
                    <p><span className="book-details-label">Price:</span> {book.price}</p>
                </div>
            )}
        </div>
    );
};

export default BookDetails;
