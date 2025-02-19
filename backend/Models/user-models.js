import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const bookVisitedSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    publisher: { 
        type: String, 
        required: true 
    },
    genre: {
        type: String,
        required: true,
    },
    price: { 
        type: Number, 
        required: true 
    },
    visitCount: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
});

const favouriteBookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    publisher: { 
        type: String, 
        required: true 
    },
    genre: {
        type: String,
        required: true,
    },
    price: { 
        type: Number, 
        required: true 
    },
    description: {
        type: String,
        required :true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
});

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    admin:{
        type:Boolean,
        default:false,
    },
    searchhistory:{
        type:[String],
        default:[],
    },
    booksVisited: {
        type: [bookVisitedSchema],
        default: [],
    },
    favourites: {
        type: [favouriteBookSchema],
        default: [],
    },
});

// Secure the password with the bcrypt
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// Creating Json Web Token
userSchema.methods.generateToken = async function (){
    try{
        return jwt.sign({
            userId: this._id.toString(),
            email:this.email,
            admin:this.admin,
        },
        "purwasuryarao",
        {
            expiresIn: "30d",
        }
    );
    } catch(error){
        console.log(error);
    }
};

// Compare Password
userSchema.methods.comparePassword = async function (password) {
    try{
        return bcrypt.compare(password, this.password);
    } catch(error){
        console.log(error);
    }
};

const User = mongoose.model("User",userSchema);
export default User;