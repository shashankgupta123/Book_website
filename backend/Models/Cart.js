import mongoose from "mongoose";
import Book from '../Models/Book.js'

const cartSchema = new mongoose.Schema({
        
            book: { 
                type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true }, // Reference to Book model
            title: { 
                type: String, 
                required: true 
            }, // Book title
            author: { 
                type: String, 
                required: true 
            }, // Book author
            imageUrl: { 
                type: String, 
                required: true 
            }, // Book image
            price: { 
                type: Number, 
                required: true 
            }, // Book price
            quantity: { 
                type: Number, 
                required: true, 
                min: 1 
            }, // Quantity of the book
});

// Enable getters when converting documents to JSON
const Cart = mongoose.model("Cart", cartSchema)
export default Cart;