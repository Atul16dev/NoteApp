import express from 'express'
import cors from 'cors'
import connectToMongoDb from './db/db.js'
//cors - middleware so that frontend send request to backend


import authRouter from './routes/auth.js'
import noteRouter from './routes/note.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/note', noteRouter)


app.listen(5000, () => {
    connectToMongoDb()
    console.log("Server is running")
})