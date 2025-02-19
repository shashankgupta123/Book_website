import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { getBooks, updateBook } from "../../service/bookService";

const UpdateBook = () => {
    const { title } = useParams();
    const [bookData, setBookData] = useState({
        title: "",
        author: "",
        publisher: "",
        publicationDate: "",
        genre: "",
        price: "",
        imageUrl: "",
        description: "",
        year: "",
        availableFormats: "",
        locations: [],
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const books = await getBooks();
                const book = books.find((book) => book.title === title);
                if (book) {
                    setBookData({
                        ...book,
                        availableFormats: book.availableFormats.join(", "),
                    });
                } else {
                    setError("Book not found");
                }
            } catch (err) {
                setError(err.message || "Failed to load book details");
            }
        };

        fetchBookData();
    }, [title]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLocationChange = (index, e) => {
        const { name, value } = e.target;
        const updatedLocations = [...bookData.locations];
        updatedLocations[index][name] = value;
        setBookData({ ...bookData, locations: updatedLocations });
    };

    const addLocation = () => {
        setBookData((prevData) => ({
            ...prevData,
            locations: [...prevData.locations, { latitude: "", longitude: "", quantity: "", placeName: "" }],
        }));
    };

    const removeLocation = (index) => {
        const updatedLocations = [...bookData.locations];
        updatedLocations.splice(index, 1);
        setBookData({ ...bookData, locations: updatedLocations });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const preparedData = {
                ...bookData,
                availableFormats: bookData.availableFormats.split(",").map((format) => format.trim()),
            };
            
            await updateBook(title, preparedData);
            setMessage("Book details updated successfully!");
            toast.success("Book details updated successfully!");
            navigate('/admin/books');
        } catch (err) {
            setError(err.message || "Failed to update book details");
        }
    };

    return (
        <div>
            <h1>Update Book Information</h1>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" name="title" value={bookData.title} onChange={handleChange} required />
                </div>
                <div>
                    <label>Author:</label>
                    <input type="text" name="author" value={bookData.author} onChange={handleChange} required />
                </div>
                <div>
                    <label>Publisher:</label>
                    <input type="text" name="publisher" value={bookData.publisher} onChange={handleChange} required />
                </div>
                <div>
                    <label>Publication Date:</label>
                    <input type="date" name="publicationDate" value={bookData.publicationDate} onChange={handleChange} required />
                </div>
                <div>
                    <label>Genre:</label>
                    <input type="text" name="genre" value={bookData.genre} onChange={handleChange} required />
                </div>
                <div>
                    <label>Price:</label>
                    <input type="number" name="price" value={bookData.price} onChange={handleChange} required />
                </div>
                <div>
                    <label>Image URL:</label>
                    <input type="text" name="imageUrl" value={bookData.imageUrl} onChange={handleChange} required />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea name="description" value={bookData.description} onChange={handleChange}></textarea>
                </div>
                <div>
                    <label>Year:</label>
                    <input type="number" name="year" value={bookData.year} onChange={handleChange} required />
                </div>
                <div>
                    <label>Available Formats (comma-separated):</label>
                    <input type="text" name="availableFormats" value={bookData.availableFormats} onChange={handleChange} required />
                </div>
                <div>
                    <h3>Book Locations</h3>
                    {bookData.locations.map((location, index) => (
                        <div key={index}>
                            <label>Latitude:</label>
                            <input type="number" name="latitude" value={location.latitude} onChange={(e) => handleLocationChange(index, e)} required />
                            <label>Longitude:</label>
                            <input type="number" name="longitude" value={location.longitude} onChange={(e) => handleLocationChange(index, e)} required />
                            <label>Quantity:</label>
                            <input type="number" name="quantity" value={location.quantity} onChange={(e) => handleLocationChange(index, e)} required />
                            <label>Place Name:</label>
                            <input type="text" name="placeName" value={location.placeName} onChange={(e) => handleLocationChange(index, e)} required />
                            <button type="button" onClick={() => removeLocation(index)}>Remove</button>
                        </div>
                    ))}
                    <button type="button" onClick={addLocation}>Add Location</button>
                </div>
                <button type="submit">Update Book</button>
            </form>
        </div>
    );
};

export default UpdateBook;
