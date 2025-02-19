import axios from "axios";

// Get all Books
export const getBooks = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/books`);
        return response.data;
    } catch (error) {
        console.error("Error fetching books:", error);
        return []; 
    }
};

// Function to add a book
export const addBook = async (bookData) => {
    try {
        const response = await axios.post(`http://localhost:5000/api/books/add`, bookData);
        return response.data; 
    } catch (error) {
        throw error.response?.data || { message: "An error occurred" };
    }
};

// Update a Book by title
export const updateBook = async (bookTitle, bookData) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/books/${bookTitle}`, bookData); 
        return response.data;
    } catch (error) {
        console.error("Error updating book:", error);
        throw error.response?.data || { message: "An error occurred while updating the book" };
    }
};

// Delete Book by title
export const deleteBook = async (title) => {
    if (!title) {
        console.error("No title provided for deleting book");
        return { success: false };
    }

    try {
        const response = await axios.delete(`http://localhost:5000/api/books/${title}`);
        return { success: response.status === 200 }; 
    } catch (error) {
        console.error("Error deleting book:", error);
        return { success: false, error: error.message }; 
    }
};

export const getBookByTitle = async (title) => {  // Ensure 'title' is used as the parameter
    console.log("BookTitle:", title);  // Log the title to check

    try {
        const response = await axios.get(`http://localhost:5000/api/books/${title}`);
        return response.data;
    } catch (error) {
        console.error("Error Getting book:", error);
        throw error.response?.data || { message: "An error occurred while fetching the book details" };
    }
};
