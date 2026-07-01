import jwt  from 'jsonwebtoken'
import User from '../models/User.js'

// ---------------------------------------------------------------------------
// Generates a signed JWT containing the user's ID
// ---------------------------------------------------------------------------

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// ---------------------------------------------------------------------------
// Protects routes — verifies the token and attaches the user to req.user
// ---------------------------------------------------------------------------

export const protect = async (req, res, next) => {
  let token

  // Token is expected as: Authorization: Bearer <token>
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]

      // Verify signature and expiry
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Attach the user (minus password) to the request object
      req.user = await User.findById(decoded.id).select('-password')

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error:   'User belonging to this token no longer exists',
        })
      }

      return next()
    } catch (error) {
      return res.status(401).json({
        success: false,
        error:   'Not authorized, token failed or expired',
      })
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error:   'Not authorized, no token provided',
    })
  }
}