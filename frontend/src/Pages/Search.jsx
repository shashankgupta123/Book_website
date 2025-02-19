import React from "react";
import { useLocation, Link } from "react-router-dom";
import '../CSS/Search.css'; 

const Search = () => {
  const location = useLocation();
  const { response } = location.state || {}; 

  if (!response || !Array.isArray(response.books)) {
    return <div className="no-results">No valid results found.</div>;
  }

  return (
    <div className="search-results">
      <h2 className="results-title">Search Results</h2>
      <div className="books-list">
        {response.books.length === 0 ? (
          <p className="no-results">No results found.</p>
        ) : (
          <ul className="book-items">
            {response.books.map((book, index) => (
              <li key={index} className="book-item">
                <div className="book-details">
                  <h3 className="book-title">{book.title}</h3>
                  <div className="book-image">
                                <img src={book.imageUrl} alt={book.title} className="book-image" />
                            </div>
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>Publisher:</strong> {book.publisher}</p>
                  <p><strong>Price:</strong> ₹{book.price.toLocaleString()}</p>
                  <p><strong>Genre:</strong> {book.genre}</p>
                  <p><strong>Description:</strong> {book.description}</p>
                  <p><strong>Available Formats:</strong> {book.availableFormats.join(", ")}</p>
                 

                  <Link to={`/books/details/${book.title}`} className="view-details-btn">
                    View More Details
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
