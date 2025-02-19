import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    quantity: { type: Number, required: true }, // Number of books available at this location
    placeName: { type: String, required: true }
});

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    publisher: { type: String, required: true },
    publicationDate: { type: Date, required: true },
    genre: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String },
    year: { type: Number, required: true },
    availableFormats: [{ type: String, required: true }], // Example: Paperback, E-book, Audiobook
    locations: [locationSchema],
});

export default mongoose.models.Book || mongoose.model("Book", bookSchema);
