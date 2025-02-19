import Book from "../Models/Book.js";

// Create a new book
export const createBook = async (req, res) => {
    try {
        console.log("Request body: ", req.body);
        const book = new Book(req.body);
        await book.save();
        res.status(201).json({ message: "Book created successfully", book });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Book name must be unique" });
        }
        console.error("Error creating book: ", error.message);
        res.status(400).json({ message: error.message });
    }
};

// Get all books
export const getBooks = async (req, res) => {
    try {
        const books = await Book.find({});
        // Check if any books were found
        if (books.length === 0) {
            return res.status(404).json({ message: "No books found" });
        }
        res.status(200).json(books);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Get a single book by title
export const getBookByTitle = async (req, res) => {
    try {
        const { title } = req.params;
        const book = await Book.findOne({ title }); 
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a book by title
export const updateBook = async (req, res) => {
    try {
        const { title } = req.params; 
        const updatedBook = await Book.findOneAndUpdate(
            { title },               
            req.body,               
            { new: true, runValidators: true } 
        );
        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book updated successfully", updatedBook });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a book by title
export const deleteBook = async (req, res) => {
    const { title } = req.params; 
    if (!title) {
        return res.status(400).json({ message: "Book title is required" });
    }

    try {
        const deletedBook = await Book.findOneAndDelete({ title });
        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const LocationgetBooks = async (req, res) => {
    try {
        const books = await Book.find().populate("locations"); // Populates the locations field
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
};