import express from 'express';
import { addToCart, getCartItems, removeFromCart, clearCart, updateQuantity } from '../Controllers/cartController.js';

const router = express.Router();

router.post('/', addToCart); // Add book to cart
router.get('/', getCartItems);
router.put('/:id', updateQuantity); // Get cart items
router.delete('/:id', removeFromCart); // Remove book from cart
router.delete('/', clearCart); // Clear entire cart

export default router;
