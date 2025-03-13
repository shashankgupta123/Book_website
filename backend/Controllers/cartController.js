import Cart from '../Models/Cart.js';
import Book from '../Models/Book.js';

// Add book to cart
export const addToCart = async (req, res) => {
    try {
        const { bookId, title, author, imageUrl, price, quantity } = req.body;

        if (!bookId || !title || !author || !imageUrl || !price || !quantity) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if book exists
        const existingBook = await Book.findById(bookId);
        if (!existingBook) {
            return res.status(404).json({ message: "Book not found." });
        }

        // Check if book is already in cart
        const existingCartItem = await Cart.findOne({ book: bookId });
        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
            return res.status(200).json(existingCartItem);
        }

        // Add new book to cart
        const newCartItem = new Cart({
            book: bookId,
            title,
            author,
            imageUrl,
            price,
            quantity,
        });

        await newCartItem.save();
        res.status(201).json(newCartItem);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get all cart items
export const getCartItems = async (req, res) => {
    try {
        const cartItems = await Cart.find().populate("book");
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Remove book from cart
export const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        await Cart.findByIdAndDelete(id);
        res.status(200).json({ message: "Item removed from cart." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Clear all cart items
export const clearCart = async (req, res) => {
    try {
        await Cart.deleteMany({});
        res.status(200).json({ message: "Cart cleared." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update quantity of cart item
export const updateQuantity = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1." });
        }

        const cartItem = await Cart.findById(id);
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found." });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
