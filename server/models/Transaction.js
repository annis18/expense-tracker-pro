import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    title: {
      type:     String,
      required: [true, 'Title is required'],
      trim:     true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
      type:    Number,
      required:[true, 'Amount is required'],
      min:     [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type:     String,
      required: [true, 'Type is required'],
      enum:     {
        values:  ['income', 'expense'],
        message: 'Type must be either income or expense',
      },
    },
    category: {
      type:     String,
      required: [true, 'Category is required'],
      trim:     true,
    },
    date: {
      type:     Date,
      required: [true, 'Date is required'],
      default:  Date.now,
    },
    note: {
      type:    String,
      trim:    true,
      default: '',
      maxlength: [300, 'Note cannot exceed 300 characters'],
    },
  },
  {
    timestamps: true,
  }
)

const Transaction = mongoose.model('Transaction', transactionSchema)

export default Transaction