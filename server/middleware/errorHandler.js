const errorHandler = (err, req, res, next) => {
  // Log full error in development only
  if (process.env.NODE_ENV === 'development') {
    console.error('🔴 Error:', err.stack)
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({
      success: false,
      error:   'Validation failed',
      details: messages,
    })
  }

  // Mongoose bad ObjectId (e.g. /api/transactions/not-a-valid-id)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error:   'Invalid ID format',
    })
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error:   'Duplicate entry detected',
    })
  }

  // Default fallback
  res.status(err.statusCode || 500).json({
    success: false,
    error:   err.message || 'Internal Server Error',
  })
}

export default errorHandler