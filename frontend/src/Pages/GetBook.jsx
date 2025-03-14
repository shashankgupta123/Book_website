import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookByTitle } from '../service/bookService'; 
import '../CSS/BookDetails.css';
import axios from 'axios';

const BookDetails = () => {
    const { title } = useParams();
    const [book, setBook] = useState(null);
    const [selectedFormat, setSelectedFormat] = useState(null); 
    const [error, setError] = useState('');
    const [userId, setUserId] = useState('');
    const [email, setEmail] = useState(''); 
    const [username, setUsername] = useState(''); 
    const [phone, setPhone] = useState('');
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const bookTitleRef = useRef(null);  
    const [selectedLocation, setSelectedLocation] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedEmail = localStorage.getItem('email');
        const storedUsername = localStorage.getItem('username');
        const storedPhone = localStorage.getItem('phone');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            setError('User is not logged in.');
        }
        if (storedEmail) setEmail(storedEmail);
        if (storedUsername) setUsername(storedUsername);
        if (storedPhone) setPhone(storedPhone);
    }, []);

    useEffect(() => {
        async function fetchBookDetails() {
            if (!title) {
                setError("Book title is undefined.");
                return;
            }
            try {
                const response = await getBookByTitle(title);
                if (response) {
                    setBook(response);
                    setSelectedFormat(response.availableFormats[0]); 
                } else {
                    setError("Book details not found.");
                }
            } catch (err) {
                setError("Error fetching book details: " + err.message);
            }
        }

        async function fetchReviews() {
            try {
                const response = await axios.get(`http://localhost:5000/api/reviews/${title}`);
                if (response.status === 200) {
                    setReviews(response.data);
                }
            } catch (err) {
                console.log('Error fetching reviews:', err);
                setError('Error fetching reviews');
            }
        }

        fetchBookDetails();
        fetchReviews();
    }, [title]);

    useEffect(() => {
        if (book && bookTitleRef.current) {
            const bookTitle = book.title;
            const numberOfSteps = bookTitle.length;
            const animationDuration = numberOfSteps * 0.5;
            bookTitleRef.current.style.animation = `typing ${animationDuration}s steps(${numberOfSteps}) 1, blink 0.5s step-end infinite`;
        }
    }, [book]);

    const handleFormatChange = (format) => {
        const selected = book.availableFormats.find(f => f === format);
        setSelectedFormat(selected);
    };

    const handleAddReview = async () => {
        if (!userId) {
            setError("You need to be logged in to add a review.");
            return;
        }

        const reviewData = {
            bookId: book._id,
            userId,
            username,
            rating,
            reviewText,
        };

        try {
            const response = await axios.post('http://localhost:5000/api/reviews/add-review', reviewData);
            console.log('Review added:', response.data);
            if (response.status === 201) {
                alert('Review added successfully!');
                setReviewText('');
                setRating(0);
                fetchReviews();  // Refresh reviews after adding one
            }
        } catch (err) {
            console.log("Error:",err.response.data);
            
            console.log('Error adding review:', err);
        }
    };

    const addToFavorites = async () => {
        if (!userId) {
            setError("You need to be logged in to add a book to your favorites.");
            return;
        }

        const bookDetails = {
            userId,
            bookDetails: {
                title: book.title,
                author: book.author,
                publisher: book.publisher,
                price: book.price,
                description: book.description,
                genre: book.genre,
                availableFormats: [selectedFormat],
                imageUrl: book.imageUrl,
            },
        };

        console.log("Sending bookDetails:", bookDetails); 

        try {
            const response = await fetch('http://localhost:5000/api/users/add-favourite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookDetails),
            });

            const result = await response.json();

            if (response.status === 200) {
                alert('Book added to your favorites!');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("Error adding to favorites: " + err.message);
        }
    };

    const buyNow = async () => {
        if (!userId) {
            setError('You need to be logged in to proceed with the purchase.');
            return;
        }

        const userDetails = {
            userId,
            username, 
            email,
            phone,
            bookTitle: book.title,
            author: book.author,
            publisher: book.publisher,
            genre: book.genre,
            publicationDate: book.publicationDate,
            year: book.year,
            price: book.price,
            selectedFormat,
            description: book.description,
            imageUrl: book.imageUrl,
        };

        try {
            const response = await fetch('http://localhost:5000/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: book.price, 
                    bookId: book._id,
                    locationId: selectedLocation,
                    userDetails,       
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url; 
            } else {
                setError('Error redirecting to payment gateway.');
            }
        } catch (err) {
            setError(`Error during payment process: ${err.message}`);
        }
    };

    const addToCart = async () =>{
        try{
            const cartItem = {
                bookId: book._id,
                title: book.title,
                author: book.author,
                imageUrl: book.imageUrl,
                price: book.price,
                quantity: 1,
            };

            const response = await axios.post('http://localhost:5000/api/cart/', cartItem);
            if (response.status === 201) {
                alert("Book added to cart!");
                navigate('/cart'); // Redirect to cart page
            } else {
                alert("Failed to add book to cart.");
            }
        }catch (err) {
            console.error("Error:", err);
            alert("Error adding to cart.");
        }
    };

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!book) {
        return <p>Loading book details...</p>;
    }  

    return (
        <div className="book-details-container">
            <div className="book-image-container">
                <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="book-detail-image"
                />
            </div>
            <div className="book-details">
                <h1 ref={bookTitleRef}>{book.title}</h1>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Publisher:</strong> {book.publisher}</p>
                <p><strong>Genre:</strong> {book.genre}</p>
                <p><strong>Price:</strong> ₹{book.price.toLocaleString()}</p>
                <p><strong>Description:</strong> {book.description}</p>
                {/* Location Selection Dropdown */}
                <p><strong>Available Locations:</strong></p>
                <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="location-dropdown"
                >
                    <option value="">Select a Location</option>
                    {book.locations.map((location, index) => (
                        <option key={index} value={location._id}>
                            {location.name} {location.placeName}
                        </option>
                    ))}
                </select>
                <p><strong>Available Formats:</strong></p>
                <div className="format-selection-container">
                    {book.availableFormats.map((format, index) => (
                        <button
                            key={index}
                            className="format-button"
                            style={{
                                border: selectedFormat === format ? '2px solid black' : 'none',
                            }}
                            onClick={() => handleFormatChange(format)}
                        >
                            {format}
                        </button>
                    ))}
                </div>
                <div className="button-container">
                <button onClick={addToCart} className="add-to-cart-button">
                    Add to Cart
                </button>

                <button onClick={addToFavorites} className="add-favorite-button">
                    Add to Favorites
                </button>
                <button onClick={buyNow} className="buy-now-button">
                    Buy Now
                </button>
                </div>
            </div>
            
        <div className="book-reviews-section">
            <h3>Reviews</h3>
            {reviews.length === 0 ? (
                <p className="no-reviews">No reviews yet. Be the first to review this book!</p>
            ) : (
                <div className="book-reviews-list">
                    {reviews.map((review, index) => (
                        <div key={index} className="book-review-item">
                            <p>
                                <strong>{review.username}</strong> - 
                                <span className="book-review-rating"> {"⭐".repeat(review.rating)}</span>
                            </p>
                            <p className="book-review-text">{review.reviewText}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Review Form */}
            <div className="book-add-review-container">
                <h4>Write a Review</h4>
                <div className="book-rating-container">
                    <label>Rating: </label>
                    <select
                        id="rating-select"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                    >
                        <option value={0}>Select Rating</option>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <option key={star} value={star}>
                            {"⭐".repeat(star)}
                        </option>
                        ))}
                    </select>
                </div>
                <textarea
                    className="book-review-textarea"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your review here..."
                ></textarea>
                <button
                    onClick={handleAddReview}
                    className="book-submit-review-button"
                    disabled={rating === 0 || reviewText.trim() === ""}
                >
                    Submit Review
                </button>
            </div>
        </div>
        </div>
    );
};

export default BookDetails;
