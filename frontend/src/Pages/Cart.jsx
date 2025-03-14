import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/cart.css';

const Cart = ({ userId, username, email, phone }) => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');

    useEffect(() => {
        async function fetchCart() {
            try {
                const response = await axios.get('http://localhost:5000/api/cart/');
                setCartItems(response.data);
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        }
        fetchCart();
    }, []);

    const removeFromCart = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/cart/${id}`);
            setCartItems(cartItems.filter(item => item._id !== id));
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const updateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            await axios.put(`http://localhost:5000/api/cart/${id}`, { quantity: newQuantity });
            setCartItems(cartItems.map(item =>
                item._id === id ? { ...item, quantity: newQuantity } : item
            ));
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="cart-container">
            <h2 className="cart-title">Your Shopping Cart</h2>
            {error && <p className="error">{error}</p>}
            {cartItems.length === 0 ? <p className="empty-cart">Your cart is empty.</p> : (
                <ul className="cart-list">
                    {cartItems.map(item => (
                        <li key={item._id} className="cart-item">
                            <img src={item.imageUrl} alt={item.title} className="cart-item-image" />
                            <div className="cart-item-details">
                                <p className="cart-item-title">{item.title}</p>
                                <p className="cart-item-price">₹{item.price}</p>
                                <div className="quantity-control">
                                    <button className="quantity-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                                    <p>{item.quantity}</p>
                                    <button className="quantity-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                </div>
                            </div>
                            <button className="remove-btn" onClick={() => removeFromCart(item._id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}

            {cartItems.length > 0 && (
                <div className="checkout-section">
                    <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
                    <label>Select Location:</label>
                    <select className="location-select" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                        <option value="">Choose a location</option>
                        <option value="loc1">Location 1</option>
                        <option value="loc2">Location 2</option>
                    </select>
                    <br />
                    <button className="buy-now-btn">Buy Now</button>
                </div>
            )}
        </div>
    );
};

export default Cart;