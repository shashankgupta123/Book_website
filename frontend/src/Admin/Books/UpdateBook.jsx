import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { getBooks, updateBook } from "../../service/bookService";
import "./BookForm.css";

const UpdateBook = () => {
    const { title } = useParams();
    const[loading, setLoading]=useState(true);
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
                await new Promise((resolve) => setTimeout(resolve, 3000)); // 3-second delay
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
            } finally {
                setLoading(false); // Hide loading screen after data is fetched
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
    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Loading Book Form...</p>
            </div>
        );
    }

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            overflowY: "auto",
            padding: "20px"
        }}>
            <div style={{
                width: "50%",
                maxHeight: "90vh",
                overflowY: "auto",
                padding: "20px",
                backgroundColor: "#ADD8E6",
                borderRadius: "10px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)"
            }}>
                <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Update Book Information</h1>
                {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <label>Title:</label>
                    <input type="text" name="title" value={bookData.title} onChange={handleChange} required />

                    <label>Author:</label>
                    <input type="text" name="author" value={bookData.author} onChange={handleChange} required />

                    <label>Publisher:</label>
                    <input type="text" name="publisher" value={bookData.publisher} onChange={handleChange} required />

                    <label>Publication Date:</label>
                    <input type="date" name="publicationDate" value={bookData.publicationDate} onChange={handleChange} required />

                    <label>Genre:</label>
                    <input type="text" name="genre" value={bookData.genre} onChange={handleChange} required />

                    <label>Price:</label>
                    <input type="number" name="price" value={bookData.price} onChange={handleChange} required />

                    <label>Image URL:</label>
                    <input type="text" name="imageUrl" value={bookData.imageUrl} onChange={handleChange} required />

                    <label>Description:</label>
                    <textarea name="description" value={bookData.description} onChange={handleChange}></textarea>

                    <label>Year:</label>
                    <input type="number" name="year" value={bookData.year} onChange={handleChange} required />

                    <label>Available Formats (comma-separated):</label>
                    <input type="text" name="availableFormats" value={bookData.availableFormats} onChange={handleChange} required />

                    <h3>Book Locations</h3>
                    {bookData.locations.map((location, index) => (
                        <div key={index} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <label>Latitude:</label>
                            <input type="number" name="latitude" value={location.latitude} onChange={(e) => handleLocationChange(index, e)} required />

                            <label>Longitude:</label>
                            <input type="number" name="longitude" value={location.longitude} onChange={(e) => handleLocationChange(index, e)} required />

                            <label>Quantity:</label>
                            <input type="number" name="quantity" value={location.quantity} onChange={(e) => handleLocationChange(index, e)} required />

                            <label>Place Name:</label>
                            <input type="text" name="placeName" value={location.placeName} onChange={(e) => handleLocationChange(index, e)} required />

                            <button 
    type="button" 
    onClick={() => removeLocation(index)} 
    style={{
        background: "linear-gradient(45deg, #FF3B3B, #D63031)", // Red Gradient
        color: "white",
        padding: "5px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "0.3s"
    }}
    onMouseOver={(e) => e.target.style.background = "linear-gradient(45deg, #D63031, #FF3B3B)"}
    onMouseOut={(e) => e.target.style.background = "linear-gradient(45deg, #FF3B3B, #D63031)"}
>
    Remove
</button>
                        </div>
                    ))}
<button 
    type="button" 
    onClick={addLocation} 
    style={{
        background: "linear-gradient(45deg, #4A90E2, #1E3799)", // Blue Gradient
        color: "white",
        padding: "10px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "0.3s"
    }}
    onMouseOver={(e) => e.target.style.background = "linear-gradient(45deg, #1E3799, #4A90E2)"}
    onMouseOut={(e) => e.target.style.background = "linear-gradient(45deg, #4A90E2, #1E3799)"}
>
    Add Location
</button>
                    <button 
                                type="submit"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    marginTop: "20px",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    color: "#fff",
                                    background: "linear-gradient(45deg, #FF6B6B, #556270)",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    transition: "0.3s"
                                }}
                                onMouseOver={(e) => e.target.style.background = "linear-gradient(45deg, #556270, #FF6B6B)"}
                                onMouseOut={(e) => e.target.style.background = "linear-gradient(45deg, #FF6B6B, #556270)"}
                            >
                                Update Book
                            </button>

                </form>
            </div>
        </div>
    );
};

export default UpdateBook;
