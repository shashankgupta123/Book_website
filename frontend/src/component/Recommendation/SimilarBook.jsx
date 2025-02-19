import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SimilarBooks = () => {
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const email = localStorage.getItem("email");

  // Fetch the similar books
  useEffect(() => {
    const fetchSimilarBooks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/recommendations/similar_books`,
          {
            params: { email },
          }
        );
        console.log("Backend Response:", response);
        if (response.data && response.data.recommendations) {
          setSimilarBooks(response.data.recommendations);
        } else {
          setError("No similar books data available.");
        }
      } catch (err) {
        setError(
          err.response ? err.response.data.message : "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarBooks();
  }, [email]);

  if (loading) return <div>Loading similar books...</div>;
  if (error) return <div>Error: {error}</div>;

  const containerStyle = {
    width: '100%',
    padding: '20px',
    textAlign: 'center',
  };

  const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',  
    justifyContent: 'space-between',  
    gap: '20px',  
    marginTop: '20px',
  };

  const cardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '30%',  
    padding: '20px',
    transition: 'transform 0.3s ease-in-out',
    marginBottom: '20px',
  };

  const linkStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '4px',
    textDecoration: 'none',
    transition: 'background-color 0.3s',
  };

  return (
    <div style={containerStyle}>
      <h2>Similar Books</h2>
      {similarBooks && similarBooks.length > 0 ? (
        <div style={gridStyle}>
          {similarBooks.map((book, index) => (
            <div key={index} style={cardStyle} className="book-card">
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
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                  />
                ) : (
                  <p>No image available</p>
                )}
              </div>
              <div className="book-details">
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Description:</strong> {book.description}</p>
                <p><strong>Similarity Score:</strong> {book.similarityScore}%</p>
              </div>
              <div className="book-actions">
                <Link
                  to={`/books/details/${book.title}`}
                  style={linkStyle}
                >
                  View More Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No similar books found.</div>
      )}
    </div>
  );
};

export default SimilarBooks;
