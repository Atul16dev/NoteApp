import "dotenv/config";
import express from 'express'
import cors from 'cors'
import connectToMongoDb from './db/db.js'
//cors - middleware so that frontend send request to backend


import authRouter from './routes/auth.js'
import noteRouter from './routes/note.js'

for (const variable of ["JWT_SECRET", "MONGO_URI"]) {
    if (!process.env[variable]) {
        throw new Error(`Missing required environment variable: ${variable}`);
    }
}

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/note', noteRouter)


app.listen(5000, () => {
    connectToMongoDb()
    console.log("Server is running")
})