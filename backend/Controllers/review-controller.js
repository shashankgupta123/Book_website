import Book from "../Models/Book.js";
import Review from "../Models/Review.js";

export const AddReview = async (req, res) => {
  try {
      console.log("AddReview endpoint running");

      const { bookId, userId, username, rating, reviewText } = req.body;

      // Log the received data for debugging
      console.log('Received data:', { bookId, userId, username, rating, reviewText });

      // Check if the book exists
      const book = await Book.findById(bookId);
      if (!book) {
          console.error(`Book with ID ${bookId} not found`);
          return res.status(404).json({ message: "Book not found" });
      }

      // Create a new review object
      const newReview = new Review({
          bookId,
          userId,
          username,
          rating,
          reviewText,
      });

      // Save the new review to the database
      const savedReview = await newReview.save();
      console.log('Review saved successfully:', savedReview);

      // Return success response with the saved review object
      res.status(201).json({ message: 'Review added successfully!', review: savedReview });
  } catch (err) {
      console.error('Error adding review:', err);  // Log the error for debugging
      res.status(500).json({ message: 'Error adding review', error: err.message });
  }
};


export const getBookReviews = async (req, res) => {
    try {
      console.log("Requested book title:", req.params.title);  // Log book title for debugging
      
      // Find the book by title
      const book = await Book.findOne({ title: req.params.title });
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      console.log("Book found:", book);  // Log the book object for debugging
      
      // Find all reviews for the book
      const reviews = await Review.find({ bookId: book._id });
      
      res.status(200).json(reviews);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllReviews = async (req, res) => {
  try {
    console.log("Fetching all reviews...");

    // Populate only the `title` from `Book` and return other review details as they are
    const reviews = await Review.find()
      .populate({ path: "bookId", select: "title" }) // Fetch only `title` from Book
      .select("-__v"); // Exclude __v field from review results

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }

    // Debugging: Log fetched reviews
    console.log("Fetched Reviews:", reviews);

    const formattedReviews = reviews.map((review) => ({
      _id: review._id,
      bookTitle: review.bookId?.title || "Unknown Book",
      username: review.username,
      rating: review.rating,
      reviewText: review.reviewText,
      createdAt: review.createdAt,
    }));

    res.status(200).json(formattedReviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    console.log(`Deleting review with ID: ${reviewId}`);

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully!" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
