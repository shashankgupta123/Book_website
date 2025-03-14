import React, { useState, useEffect } from "react";
import { addBook } from "../../service/bookService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./BookForm.css";

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
        locations: [],
    });

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

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

    const addLocation = () => {
        setBookData((prevData) => ({
            ...prevData,
            locations: [...prevData.locations, { latitude: "", longitude: "", quantity: "0", placeName: "Unknown" }],
        }));
    };

    const removeLocation = (index) => {
        const updatedLocations = bookData.locations.filter((_, i) => i !== index);
        setBookData((prevData) => ({
            ...prevData,
            locations: updatedLocations,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const preparedData = {
                ...bookData,
                availableFormats: bookData.availableFormats.split(",").map((format) => format.trim()),
                locations: bookData.locations.map((loc) => ({
                    latitude: parseFloat(loc.latitude),
                    longitude: parseFloat(loc.longitude),
                    quantity: loc.quantity ? parseInt(loc.quantity, 10) : 0,
                    placeName: loc.placeName.trim() || "Unknow",
                })),
            };

            await addBook(preparedData);

            toast.success("Book added successfully!", { position: "top-center" });

            setTimeout(() => {
                navigate("/admin/books");
            }, 3000);

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
            toast.error(err.message || "An error occurred", { position: "top-center" });
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Loading Book Form...</p>
            </div>
        );
    }

    return (
        <div className="book-form-container book-form-unique">

            <form className="book-form" onSubmit={handleSubmit}>
                <h1 className="form-title">Add a New Book</h1>
                
                <label className="unique-label">Title:</label>
                <input type="text" name="title" value={bookData.title} onChange={handleChange} required />

                <label className="unique-label">Author:</label>
                <input type="text" name="author" value={bookData.author} onChange={handleChange} required />

                <label className="unique-label">Publisher:</label>
                <input type="text" name="publisher" value={bookData.publisher} onChange={handleChange} required />

                <label className="unique-label">Publication Date:</label>
                <input type="date" name="publicationDate" value={bookData.publicationDate} onChange={handleChange} required />

                <label className="unique-label">Genre:</label>
                <input type="text" name="genre" value={bookData.genre} onChange={handleChange} required />

                <label className="unique-label">Price:</label>
                <input type="number" name="price" value={bookData.price} onChange={handleChange} required />

                <label className="unique-label">Image URL:</label>
                <input type="text" name="imageUrl" value={bookData.imageUrl} onChange={handleChange} required />

                <label htmlFor="description" className="unique-label">Description:</label>
                <textarea name="description" value={bookData.description} onChange={handleChange}></textarea>

                <label htmlFor="year" className="unique-label">Year:</label>
                <input type="number" name="year" value={bookData.year} onChange={handleChange} required />

                <label className="unique-label">Available Formats (comma-separated):</label>
                <input type="text" name="availableFormats" value={bookData.availableFormats} onChange={handleChange} required />

                <h3 className="section-title">Book Locations</h3>
                {bookData.locations.map((location, index) => (
                    <div className="location-container" key={index}>
                        <label className="unique-label">Latitude:</label>
                        <input type="number" step="any" value={location.latitude} onChange={(e) => handleLocationChange(index, "latitude", e.target.value)} required />

                        <label className="unique-label">Longitude:</label>
                        <input type="number" step="any" value={location.longitude} onChange={(e) => handleLocationChange(index, "longitude", e.target.value)} required />

                        <label className="unique-label">Quantity:</label>
                        <input type="number" value={location.quantity} onChange={(e) => handleLocationChange(index, "quantity", e.target.value)} required />

                        <label className="unique-label">Place Name:</label>
                        <input type="text" value={location.placeName} onChange={(e) => handleLocationChange(index, "placeName", e.target.value)} required />

                        <button className="btn remove-btn" type="button" onClick={() => removeLocation(index)}>Remove</button>
                    </div>
                ))}

                <button className="btn add-btn" type="button" onClick={addLocation}>Add Location</button>
                <button className="btn submit-btn-1" type="submit">Add Book</button>
            </form>
        </div>
    );
};

export default BookForm;
