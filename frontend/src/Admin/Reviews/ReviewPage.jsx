import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ReviewsPage.css"; // Ensure this CSS file is linked correctly

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/reviews/admin/all");
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch reviews.");
      setLoading(false);
    }
  };

  // Delete a review
  const deleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:5000/api/reviews/admin/${reviewId}`);
      setReviews(reviews.filter((review) => review._id !== reviewId)); // Update state
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) return <p className="reviews-page-loading">Loading reviews...</p>;
  if (error) return <p className="reviews-page-error">{error}</p>;

  return (
    <div className="reviews-page-container">
      <h2 className="reviews-page-title">All Reviews</h2>
      {reviews.length === 0 ? (
        <p className="reviews-page-no-reviews">No reviews found.</p>
      ) : (
        <ul className="reviews-page-list">
          {reviews.map((review) => (
            <li key={review._id} className="reviews-page-item">
              <h3 className="reviews-page-book-title">{review.bookTitle}</h3>
              <p className="reviews-page-author"><strong>By:</strong> {review.username}</p>
              <p className="reviews-page-rating"><strong>Rating:</strong> {review.rating} ⭐</p>
              <p className="reviews-page-text">{review.reviewText}</p>
              <p className="reviews-page-date"><small>{new Date(review.createdAt).toLocaleString()}</small></p>
              <button 
                onClick={() => deleteReview(review._id)} 
                className="reviews-page-delete-btn"
              >
                Delete Review
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewsPage;
