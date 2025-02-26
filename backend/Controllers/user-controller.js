import User from "../Models/user-models.js";
import { signupSchema,loginSchema} from "../middleware/user-validation.js"
import { z, ZodError } from "zod";
import Book from "../Models/Book.js";

const register = async (req, res, next) => {
    try {
        const { username, email, phone, password } = signupSchema.parse(req.body);

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "Email already registered" });  // Change req to res
        }

        const userCreated = await User.create({
            username,
            email,
            phone,
            password,
        });

        res.status(201).json({
            message: "User created successfully",
            token: await userCreated.generateToken(),
            userId: userCreated._id.toString(),
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: error.errors[0].message,  // Send the first error message from Zod validation
            });
        }
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const userExist = await User.findOne({ email: email.trim().toLowerCase() });
        if (!userExist) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isPasswordValid = await userExist.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Email and Password" });
        }

        const token = await userExist.generateToken();
        console.log("Token generated", token);
        return res.status(200).json({
            message: "Login Successful",
            token: token,
            userId: userExist._id.toString(),
            username: userExist.username,
            email: userExist.email,
            admin:userExist.admin,
            phone:userExist.phone,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: error.errors[0].message,  // Send the first error message from Zod validation
            });
        }
        console.log("Login Error", error);
        next(error);
    }
};

const resetPassword = async (req, res) => {
    try {
      const { email, newPassword } = req.body;
  
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      console.log("Old Password Hash:", user.password);
  
      // Use the same hashing method as during registration
      user.password = newPassword; // Assuming pre-save middleware handles hashing
  
      // Save the updated user object
      await user.save();
  
      console.log("Updated Password Hash in DB:", user.password);
  
      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        if (!users) {
            return res.status(404).json({ message: "No users found" });
        }
        res.status(200).json({
            message: "Users fetched successfully",
            users: users,
        });
    } catch (error) {
        console.log("Fetch All Users Error", error);
        next(error);
    }
};

const logout = async (req, res) => {
    try {
      res.clearCookie("authToken");
      res.status(200).json({ success: true, message: "Successfully logged out" });
    } catch (error) {
      console.log("Error while logging out", error.message);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

const adminlogout = async (req, res) => {
    try {
      const { userId } = req.body; // Pass the userId in the request body
  
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      // Assuming you are using MongoDB/Mongoose to fetch user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Perform any logout actions like clearing session, token, etc.
      res.clearCookie('auth_token'); // Clearing the token (if you use cookies)
  
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.log("Error while logging out", error.message);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

const searchData = async (req, res) => {
    try {
      const { query, email } = req.body;
      
      if (!query || query.trim() === "") {
        return res.status(400).json({ message: "Search query cannot be empty" });
      }
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const books = await Book.find({
        title: { $regex: query, $options: "i" }, 
      });
  
      user.searchhistory.push(query);
      const updatedUser = await user.save();
      
      console.log("Books found:", books);
      
      return res.status(200).json({
        message: "Search results found",
        books,
        user: updatedUser,
      });
    
    } catch (error) {
      console.error("Error in search:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  const recordBookVisit = async (req, res) => {
    try {
        const { userId, title, author, genre, description, imageUrl, price, publisher } = req.body;
        console.log("Request body:", req.body);

        if (!userId || !title || !author || !genre || !description || !imageUrl || !price || !publisher) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            console.error(`User with ID ${userId} not found.`);
            return res.status(404).json({ message: "User not found." });
        }

        const bookIndex = user.booksVisited.findIndex((book) => book.title === title);
        if (bookIndex >= 0) {
            user.booksVisited[bookIndex].visitCount += 1;
        } else {
            user.booksVisited.push({
                title,
                author,
                genre,
                description,
                imageUrl,
                price,
                publisher,
                visitCount: 1,
            });
        }

        const result = await user.save();
        console.log("User saved:", result);

        res.status(200).json({ message: "Book visit recorded successfully.", booksVisited: user.booksVisited });
    } catch (error) {
        console.error("Error recording book visit:", error.message);
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};
  
const addFavouriteBook = async (req, res) => {
    const { userId, bookDetails } = req.body;
    console.log("Received bookDetails:", bookDetails);

    try {
        if (!bookDetails || !bookDetails.title || !bookDetails.author || !bookDetails.genre || !bookDetails.price || !bookDetails.publisher) {
            return res.status(400).json({ message: 'Invalid book data. Publisher is required.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const bookAlreadyInFavorites = user.favourites.some(book => book.title === bookDetails.title);
        if (bookAlreadyInFavorites) {
            return res.status(400).json({ message: 'Book is already in your favorites' });
        }

        const bookToAdd = {
            title: bookDetails.title,
            author: bookDetails.author,
            genre: bookDetails.genre,
            publisher: bookDetails.publisher, 
            description: bookDetails.description,
            imageUrl: bookDetails.imageUrl,
            price: bookDetails.price,
        };

        user.favourites.push(bookToAdd);
        await user.save();

        return res.status(200).json({ message: 'Book added to favorites successfully' });
    } catch (error) {
        console.error('Error adding book to favorites:', error);
        return res.status(500).json({ message: 'Error adding book to favorites' });
    }
};
  
export default { 
    register, 
    login, 
    getAllUsers,
    searchData,
    recordBookVisit,
    addFavouriteBook,
    logout,
    adminlogout,
    resetPassword,
 };