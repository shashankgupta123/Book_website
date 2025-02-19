import  mongoose from 'mongoose'

const URI = "mongodb+srv://shashank0078:shashank123@cluster0.3dowa.mongodb.net/SEM_6?retryWrites=true&w=majority&appName=Cluster0";

const connectDb = async () => {
    try{
        await mongoose.connect(URI);
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Not Connected");
        process.exit(1);
    }
};

export default connectDb;