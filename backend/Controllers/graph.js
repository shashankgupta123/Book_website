import Purchase from '../Models/purchase.js'
import Review from '../Models/Review.js'

export const getWeeklyIncome = async (req, res) => {
  try {
    const data = await Purchase.aggregate([
      {
        $project: {
          purchaseDate: 1, // Include the purchaseDate field
          price: 1,
          month: { $month: "$purchaseDate" }, // Extract the month from purchaseDate
          dayOfMonth: { $dayOfMonth: "$purchaseDate" }, // Extract the day of the month
        },
      },
      {
        $addFields: {
          weekOfMonth: { $ceil: { $divide: ["$dayOfMonth", 7] } }, // Calculate the week of the month
        },
      },
      {
        $group: {
          _id: { month: "$month", week: "$weekOfMonth" }, // Group by month and week
          purchases: { $push: { price: "$price", purchaseDate: "$purchaseDate" } }, // Collect purchases in that group
        },
      },
      {
        $sort: { "_id.month": 1, "_id.week": 1 }, // Sort by month and week
      },
    ]);

    res.json(data); // Return the grouped data
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTotalIncome = async (req, res) => {
  try {
    const data = await Purchase.aggregate([
      {
        $project: {
          bookTitle: 1,  // Include bookTitle field
          price: 1,      // Include price field
          purchaseDate: 1,  // Include purchaseDate field
        },
      },
      {
        $group: {
          _id: { bookTitle: "$bookTitle" },  // Group by bookTitle
          totalPurchases: { $push: { price: "$price", purchaseDate: "$purchaseDate" } },  // Collect all prices and purchase dates for the same book
          count: { $sum: 1 },  // Count the number of times this book is purchased
          totalIncome: { $sum: "$price" },  // Calculate total income for this book
        },
      },
      {
        $sort: { "_id.bookTitle": 1 },  // Sort by bookTitle
      },
    ]);
    
    res.json(data);  // Return the grouped data
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSalesByGenre = async (req, res) => {
  try {
    const data = await Purchase.aggregate([
      {
        $group: {
          _id: "$genre",
          totalIncome: { $sum: "$price" },
          count: { $sum: 1 }, // Total number of purchases
          uniqueBooksCount: { $addToSet: "$bookTitle" }, // Unique book titles in this genre
          booksSold: { 
            $push: { title: "$bookTitle", price: "$price", purchaseDate: "$purchaseDate" }
          },
        },
      },
      {
        $addFields: {
          uniqueBooksCount: { $size: "$uniqueBooksCount" }, // Get count of unique books
        },
      },
      {
        $sort: { "_id": 1 },
      },
    ]);

    res.json(data);
  } catch (err) {
    console.error("Error fetching sales by genre:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getReviewBycategory = async (req,res) =>{
  try {
    const reviews = await Review.aggregate([
        {
            $lookup: {
                from: 'books', // Collection name of books
                localField: 'bookId',
                foreignField: '_id',
                as: 'bookDetails'
            }
        },
        {
            $unwind: '$bookDetails'
        },
        {
            $group: {
                _id: '$bookDetails.genre',
                averageRating: { $avg: '$rating' },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { averageRating: -1 }
        }
    ]);

    res.status(200).json(reviews);
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
}
};


