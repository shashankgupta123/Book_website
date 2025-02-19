import mongoose from "mongoose";

const userEmbeddedSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
});

const purchaseSchema = new mongoose.Schema(
    {
        user: {
            type: userEmbeddedSchema,
            required: true,
        },
        userId: { 
            type: String, 
            required: true 
        },
        bookTitle: { 
            type: String, 
            required: true 
        },
        author: { 
            type: String, 
            required: true 
        },
        publisher: { 
            type: String, 
            required: true 
        },
        genre: { 
            type: String, 
            required: true 
        },
        publicationDate: { 
            type: Date, 
            required: true 
        },
        year: { 
            type: Number, 
            required: true 
        },
        price: { 
            type: Number, 
            required: true 
        },
        selectedFormat: { 
            type: String, 
            required: true 
        }, 
        description: { 
            type: String 
        },
        imageUrl: { 
            type: String, 
            required: true 
        },
        purchaseDate: { 
            type: Date, 
            default: Date.now },
    },
);

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;
