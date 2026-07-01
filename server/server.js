import express  from 'express'
import cors     from 'cors'
import dotenv   from 'dotenv'
import connectDB         from './config/db.js'
import authRoutes        from './routes/authRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
import errorHandler      from './middleware/errorHandler.js'

dotenv.config()
connectDB()

const app  = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173', // Add this explicitly for your preview
  ...process.env.CLIENT_URL.split(',').map(url => url.trim())
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman, Thunder Client, mobile apps)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Expense Tracker Pro API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error:   `Route ${req.originalUrl} not found`,
  })
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})