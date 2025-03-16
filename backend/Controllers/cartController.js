import Cart from '../Models/Cart.js';
import Book from '../Models/Book.js';

// Add book to cart
export const addToCart = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debug log

        const { userId, bookId, title, author, imageUrl, price, quantity } = req.body;

        if (!userId || !bookId || !title || !author || !imageUrl || !price || !quantity) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingBook = await Book.findById(bookId);
        if (!existingBook) {
            return res.status(404).json({ message: "Book not found." });
        }

        const existingCartItem = await Cart.findOne({ userId, book: bookId });

        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
            return res.status(200).json(existingCartItem);
        }

        const newCartItem = new Cart({
            userId, // Ensure userId is being stored
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
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


// Get all cart items
export const getCartItems = async (req, res) => {
    const { userId } = req.params;

    try {
        const cartItems = await Cart.find({ userId }); // Fetch cart for this user only
        res.json(cartItems);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error fetching cart' });
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
