import "dotenv/config";
import express from "express";
import cors from "cors";
import connectToMongoDb from "./db/db.js";

import authRouter from "./routes/auth.js";
import noteRouter from "./routes/note.js";

// Check required environment variables
for (const variable of ["JWT_SECRET", "MONGO_URI"]) {
    if (!process.env[variable]) {
        throw new Error(`Missing required environment variable: ${variable}`);
    }
}

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/note", noteRouter);

// Port
const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
    try {
        await connectToMongoDb();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
    }
};

startServer();