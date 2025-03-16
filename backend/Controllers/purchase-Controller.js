import stripeModule from 'stripe';
import Purchase from '../Models/purchase.js'; 
import PDFDocument from 'pdfkit';
import fs from 'fs';
import Book from '../Models/Book.js';
import mongoose from "mongoose";
const stripe = stripeModule('sk_test_51PrMfS2MTbYGhQ4qhCdsIfs3Y0OsE50lQzu2plVcNf874DRZmzFKh8D8AuFxIvOVSM5twxfs2IsfqNc4W7dEbYLU00yk3NAIBS');

export const createCheckoutSession = async (req, res) => {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ message: 'Method Not Allowed' });
        }

        const { amount, userDetails, locationId, bookId } = req.body;

        console.log("Received checkout request for book:", bookId);

        if (!userDetails?.username || !userDetails?.email || !userDetails?.phone) {
            console.error("Missing required user details:", userDetails);
            return res.status(400).json({ message: 'Missing required user details' });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            console.error("Book not found:", bookId);
            return res.status(404).json({ message: "Book not found" });
        }

        const locationIndex = book.locations.findIndex(loc => loc._id.toString() === locationId);
        if (locationIndex === -1 || book.locations[locationIndex].quantity <= 0) {
            console.warn("No stock available at location:", locationId);
            return res.status(400).json({ message: "No stock available at the selected location" });
        }

        console.log(`Current stock at location ${locationId}: ${book.locations[locationIndex].quantity}`);

        // Reduce stock immediately
        book.locations[locationIndex].quantity -= 1;
        book.markModified("locations");

        console.log(`New stock at location ${locationId} after reduction: ${book.locations[locationIndex].quantity}`);

        await book.save();

        console.log("Stock reduced and saved successfully. Proceeding with Stripe session...");

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: { name: book.title, description: book.description },
                    unit_amount: Math.round(amount * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: 'http://localhost:5173/cancel',
            customer_email: userDetails.email,
            metadata: { bookId, locationId, userId: userDetails.userId }
        });

        console.log("Stripe session created successfully:", session.id);

        // Save purchase record immediately
        const purchase = new Purchase({
            user: {
                username: userDetails.username,
                email: userDetails.email,
                phone: userDetails.phone,
            },
            userId: userDetails.userId,
            bookTitle: book.title,
            author: book.author,
            publisher: book.publisher,
            genre: book.genre,
            publicationDate: book.publicationDate,
            year: book.year,
            price: amount,
            selectedFormat: "Unknown",
            description: book.description,
            imageUrl: book.imageUrl,
            location: book.locations[locationIndex].name,
        });

        await purchase.save();
        console.log("Purchase record saved successfully for user:", userDetails.userId);

        return res.status(201).json({ url: session.url, sessionId: session.id });
    } catch (err) {
        console.error('Error handling checkout:', err);
        return res.status(500).json({ message: 'Checkout process failed', error: err.message });
    }
};

export const createCheckoutSessionCart = async (req, res) => {
    try {
        console.log("📩 Full request body:", JSON.stringify(req.body, null, 2));

        // Correctly extracting user details
        const { userId, username, email, phone, items, totalAmount, locationId } = req.body;

        // Creating userDetails manually
        const userDetails = { userId, username, email, phone };

        // Extract bookIds from items
        const bookId = items.map(item => item.bookId);

        if (!userDetails || !userDetails.username || !userDetails.email || !userDetails.phone) {
            console.error("❌ Missing required user details:", userDetails);
            return res.status(400).json({ message: 'Missing required user details' });
        }

        if (!Array.isArray(bookId) || bookId.length === 0) {
            console.error("❌ No books selected for purchase:", bookId);
            return res.status(400).json({ message: "No books selected for purchase" });
        }
        
        let totalCost = 0;
        let lineItems = [];
        let purchasedBooks = [];
        let errors = [];

        for (const item of items) {
            const { bookId, title, quantity, price } = item;
            console.log(`🔎 Searching for book: ${title} (ID: ${bookId})`);

            if (!mongoose.Types.ObjectId.isValid(bookId)) {
                console.error(`❌ Invalid book ID format: ${bookId}`);
                errors.push(`Invalid book ID format: ${bookId}`);
                continue;
            }

            const book = await Book.findOne({ _id: book });
            if (!book) {
                console.error(`❌ Book not found: ${title}`);
                errors.push(`Book not found: ${title}`);
                continue;
            }

            const locationIndex = book.locations.findIndex(loc =>
                loc._id.toString() === locationId || loc.placeName === locationId
            );

            if (locationIndex === -1) {
                console.error(`❌ Location not found for book: ${title}`);
                errors.push(`Invalid location for ${title}`);
                continue;
            }

            if (book.locations[locationIndex].quantity < quantity) {
                console.error(`❌ Not enough stock for ${title}`);
                errors.push(`Not enough stock for ${title}`);
                continue;
            }

            // Reduce stock
            book.locations[locationIndex].quantity -= quantity;
            book.markModified("locations");
            await book.save();

            totalCost += price * quantity;
            console.log(`✅ Updated stock for ${title}, New Quantity: ${book.locations[locationIndex].quantity}`);

            lineItems.push({
                price_data: {
                    currency: 'inr',
                    product_data: { name: title, description: book.description },
                    unit_amount: Math.round(price * 100),
                },
                quantity: quantity,
            });

            purchasedBooks.push({
                userId: userDetails.userId,
                bookTitle: title,
                location: book.locations[locationIndex].placeName,
            });
        }

        if (lineItems.length === 0) {
            return res.status(400).json({ message: "No valid books available for purchase", errors });
        }

        console.log("🛠️ Creating Stripe checkout session...");
        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: 'http://localhost:5173/cancel',
            customer_email: userDetails.email,
        });

        console.log("✅ Checkout session created successfully:", session.id);
        return res.status(201).json({ sessionId: session.id, url: session.url, errors });

    } catch (err) {
        console.error('❌ Error during checkout:', err);
        return res.status(500).json({ message: 'Checkout process failed', error: err.message });
    }
};


export const showPaymentPage = async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({ message: "Missing session ID" });
        }

        console.log("🔍 Retrieving Stripe session...");
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        return res.redirect(session.url);
    } catch (err) {
        console.error("❌ Error retrieving Stripe session:", err);
        return res.status(500).json({ message: "Failed to retrieve payment session", error: err.message });
    }
};


export const generateReceipt = async (req, res) => {
    const { sessionId } = req.params;

    if (!sessionId) {
        return res.status(400).json({ message: 'Session ID is missing' });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items'],
        });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (!session.payment_intent) {
            return res.status(400).json({ message: 'Payment intent not found for the session' });
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

        const doc = new PDFDocument();
        const filePath = `receipts/receipt-${sessionId}.pdf`;

        if (!fs.existsSync('receipts')) {
            fs.mkdirSync('receipts');
        }

        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        doc.fontSize(20).text('Payment Receipt', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Receipt ID: ${sessionId}`);
        doc.text(`Customer Email: ${session.customer_email}`);
        doc.text(`Amount Paid: ₹${(paymentIntent.amount_received / 100).toFixed(2)}`);
        doc.text(`Payment Method: ${paymentIntent.payment_method_types.join(', ')}`);
        doc.text(`Status: ${paymentIntent.status}`);

        if (session.line_items && session.line_items.data.length > 0) {
            doc.text(`Book Title: ${session.line_items.data[0]?.description || 'N/A'}`);
        } else {
            doc.text('Book Title: N/A');
        }

        doc.text(`Date: ${new Date(paymentIntent.created * 1000).toLocaleString()}`);

        doc.end();

        writeStream.on('finish', () => {
            res.download(filePath, `receipt-${sessionId}.pdf`, (err) => {
                if (err) {
                    console.error("Error sending receipt:", err);
                } else {
                    console.log(`Receipt sent successfully: receipt-${sessionId}.pdf`);
                }
            });
        });
    } catch (err) {
        console.error("Error generating receipt:", err);
        res.status(500).json({ message: 'Error generating receipt', error: err.message });
    }
};

export const getAllPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find(); 
        res.status(200).json(purchases); 
    } catch (err) {
        console.error("Error fetching purchases:", err);
        res.status(500).json({ message: 'Error fetching purchases', error: err.message });
    }
};

export const getPurchaseById = async (req, res) => {
    const { id } = req.params;

    try {
        const purchase = await Purchase.findById(id); 
        if (!purchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }
        res.status(200).json(purchase); 
    } catch (err) {
        console.error("Error fetching purchase:", err);
        res.status(500).json({ message: 'Error fetching purchase', error: err.message });
    }
};
