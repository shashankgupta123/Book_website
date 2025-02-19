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

    const handleBack = () => {
        navigate(-1); 
    };

    return (
        <div>
            <h1>Book Details</h1>
            <button onClick={handleBack} className="back-button">Back</button> {/* Back button */}
            {book && (
                <div>
                    <p><strong>Username:</strong> {book.user.username}</p>
                    <p><strong>Email:</strong> {book.user.email}</p>
                    <p><strong>Phone:</strong> {book.user.phone}</p>
                    <p><strong>Book Title:</strong> {book.bookTitle}</p>
                    <p><strong>Author:</strong> {book.author}</p>
                    <p><strong>Publisher:</strong> {book.publisher}</p>
                    <p><strong>Genre:</strong> {book.genre}</p>
                    <p><strong>Publication Date:</strong> {new Date(book.publicationDate).toLocaleDateString()}</p>
                    <p><strong>Selected Format:</strong> {book.selectedFormat}</p>
                    <p><strong>Price:</strong> {book.price}</p>
                </div>
            )}
        </div>
    );
};

export default BookDetails;
