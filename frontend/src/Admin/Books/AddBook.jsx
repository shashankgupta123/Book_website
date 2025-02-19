import React, { useState } from "react";
import { addBook } from "../../service/bookService"; // Replace with actual service
import { useNavigate } from "react-router-dom";

const BookForm = () => {
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
        locations: [], // Array of location objects
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLocationChange = (index, field, value) => {
        const updatedLocations = [...bookData.locations];
        updatedLocations[index][field] = value;
        setBookData((prevData) => ({
            ...prevData,
            locations: updatedLocations,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const preparedData = {
                ...bookData,
                availableFormats: bookData.availableFormats
                    .split(",")
                    .map((format) => format.trim()),
                locations: bookData.locations.map((loc) => ({
                    latitude: parseFloat(loc.latitude),
                    longitude: parseFloat(loc.longitude),
                    quantity: parseInt(loc.quantity, 10),
                    placeName: loc.placeName,
                })),
            };

            const result = await addBook(preparedData);
            setMessage(result.message);
            setBookData({
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
        } catch (err) {
            setError(err.message || "An error occurred");
        }
    };

    return (
        <div>
            <h1>Add a New Book</h1>
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

                {/* Locations Section */}
                <h3>Book Locations</h3>
                {bookData.locations.map((location, index) => (
                    <div key={index} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                        <div>
                            <label>Latitude:</label>
                            <input
                                type="number"
                                step="any"
                                value={location.latitude}
                                onChange={(e) => handleLocationChange(index, "latitude", e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Longitude:</label>
                            <input
                                type="number"
                                step="any"
                                value={location.longitude}
                                onChange={(e) => handleLocationChange(index, "longitude", e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Quantity:</label>
                            <input
                                type="number"
                                value={location.quantity}
                                onChange={(e) => handleLocationChange(index, "quantity", e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Place Name:</label>
                            <input
                                type="text"
                                value={location.placeName}
                                onChange={(e) => handleLocationChange(index, "placeName", e.target.value)}
                                required
                            />
                        </div>
                        <button type="button" onClick={() => removeLocation(index)}>Remove Location</button>
                    </div>
                ))}
                <button type="button" onClick={addLocation}>Add Location</button>

                <button type="submit">Add Book</button>
            </form>
        </div>
    );
};

export default BookForm;
