import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TrendingBooks = () => {
  const [newTrends, setNewTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const email = localStorage.getItem("email");

  // Fetch the new trends
  useEffect(() => {
    const fetchNewTrends = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/recommendations/new_trends`,
          {
            params: { email },
          }
        );
        console.log("Backend Response:", response);
        if (response.data && response.data.recommendations) {
          setNewTrends(response.data.recommendations);
        } else {
          setError("No trends data available.");
        }
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNewTrends();
  }, [email]);

  if (loading) return <div>Loading new book trends...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="book-list-container">
      <h2>New Book Trends</h2>
      {newTrends && newTrends.length > 0 ? (
        <div className="book-grid">
          {newTrends.map((book, index) => (
            <div key={index} className="book-card">
              <div className="book-header">
                <h2>{book.title}</h2>
                <p className="book-price">
                  <strong>Price: </strong>₹{book.price ? book.price : 'N/A'}
                </p>
              </div>
              <div className="book-images">
                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="book-top-image"
                  />
                ) : (
                  <p>No image available</p>
                )}
              </div>
              <div className="book-details">
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Genre:</strong> {book.genre}</p>
              </div>
              <div className="book-actions">
                <Link
                  to={`/books/details/${book.title}`}
                  className="view-details-btn"
                >
                  View More Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No new book trends found.</div>
      )}
    </div>
  );
};

export default TrendingBooks;
