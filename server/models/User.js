import mongoose from 'mongoose'
import bcrypt   from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type:     String,
      required: [true, 'Email is required'],
      unique:   true,
      lowercase: true,
      trim:     true,
      match:    [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type:     String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select:   false, // never return password in queries by default
    },
  },
  {
    timestamps: true,
  }
)

// ---------------------------------------------------------------------------
// Hash the password BEFORE saving — runs automatically on every .save()
// ---------------------------------------------------------------------------

userSchema.pre('save', async function (next) {
  // Only hash if the password field was actually modified
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// ---------------------------------------------------------------------------
// Instance method — compare a plain-text login password to the hashed one
// ---------------------------------------------------------------------------

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User