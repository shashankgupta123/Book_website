import express from 'express';
import { createBook, getBooks, getBookByTitle, updateBook, deleteBook,LocationgetBooks } from '../Controllers/book-controller.js';
import { validateBook } from '../middleware/book-validation.js';

const router = express.Router();

// Create a new book
router.post('/books', validateBook, createBook);

// Get all books
router.get('/books', getBooks);

router.get('/locationbooks',LocationgetBooks);

// Get a single book by title
router.get('/books/:title', getBookByTitle);

// Update a book by title
router.put('/books/:title', validateBook, updateBook);

// Delete a book by title
router.delete('/books/:title', deleteBook);

export default router;
