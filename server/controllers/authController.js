import User from '../models/User.js'
import { generateToken } from '../middleware/authMiddleware.js'

// ---------------------------------------------------------------------------
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// ---------------------------------------------------------------------------

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // Check if a user with this email already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({
        success: false,
        error:   'A user with this email already exists',
      })
    }

    // Create user — password gets hashed automatically by the pre-save hook
    const user = await User.create({ name, email, password })

    res.status(201).json({
      success: true,
      data: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        token: generateToken(user._id),
      },
    })
  } catch (error) {
    next(error)
  }
}

// ---------------------------------------------------------------------------
// @desc    Authenticate user & return token
// @route   POST /api/auth/login
// @access  Public
// ---------------------------------------------------------------------------

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error:   'Please provide both email and password',
      })
    }

    // Explicitly include password since schema sets select: false by default
    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        error:   'Invalid email or password',
      })
    }

    res.status(200).json({
      success: true,
      data: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        token: generateToken(user._id),
      },
    })
  } catch (error) {
    next(error)
  }
}

// ---------------------------------------------------------------------------
// @desc    Get the currently logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
// ---------------------------------------------------------------------------

export const getMe = async (req, res, next) => {
  try {
    // req.user was already attached by the protect middleware
    res.status(200).json({
      success: true,
      data: req.user,
    })
  } catch (error) {
    next(error)
  }
}