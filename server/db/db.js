import mongoose from "mongoose";

const connectToMongoDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Atlas Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        throw error;
    }
};

export default connectToMongoDb;