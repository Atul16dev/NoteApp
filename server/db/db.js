import mongoose from "mongoose";

const connectToMongoDb = async() => {
    try{
        await mongoose.connect("mongodb://localhost:27017/note_app");
        console.log("Connected to MongoDB");
    }catch(error){
        
        console.log("Error connecting to MongoDB", error.message)
    }
};

export default connectToMongoDb; 