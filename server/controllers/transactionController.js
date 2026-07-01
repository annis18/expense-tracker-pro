import Transaction from '../models/Transaction.js'

// ---------------------------------------------------------------------------
// @desc    Get all transactions for the logged-in user
// @route   GET /api/transactions
// @access  Private
// ---------------------------------------------------------------------------

export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 })

    const totalIncome   = transactions.filter((t) => t.type === 'income').reduce((s, t)  => s + t.amount, 0)
    const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

    res.status(200).json({
      success:      true,
      count:        transactions.length,
      totalIncome,
      totalExpenses,
      totalBalance: totalIncome - totalExpenses,
      data:         transactions,
    })
  } catch (error) {
    next(error)
  }
}

// ---------------------------------------------------------------------------
// @desc    Get single transaction by ID (only if it belongs to the user)
// @route   GET /api/transactions/:id
// @access  Private
// ---------------------------------------------------------------------------

export const getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id:  req.params.id,
      user: req.user._id,
    })

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error:   'Transaction not found',
      })
    }

    res.status(200).json({
      success: true,
      data:    transaction,
    })
  } catch (error) {
    next(error)
  }
}

// ---------------------------------------------------------------------------
// @desc    Create a new transaction owned by the logged-in user
// @route   POST /api/transactions
// @access  Private
// ---------------------------------------------------------------------------

export const createTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date, note } = req.body

    const transaction = await Transaction.create({
      user: req.user._id,
      title,
      amount,
      type,
      category,
      date,
      note,
    })

    res.status(201).json({
      success: true,
      data:    transaction,
    })
  } catch (error) {
    next(error)
  }
}

// ---------------------------------------------------------------------------
// @desc    Update a transaction (only if it belongs to the user)
// @route   PUT /api/transactions/:id
// @access  Private
// ---------------------------------------------------------------------------

export const updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findOne({
      _id:  req.params.id,
      user: req.user._id,
    })

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error:   'Transaction not found',
      })
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new:          true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data:    transaction,
    })
  } catch (error) {
    next(error)
  }
}

// ---------------------------------------------------------------------------
// @desc    Delete a transaction (only if it belongs to the user)
// @route   DELETE /api/transactions/:id
// @access  Private
// ---------------------------------------------------------------------------

export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id:  req.params.id,
      user: req.user._id,
    })

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error:   'Transaction not found',
      })
    }

    await transaction.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      data:    {},
    })
  } catch (error) {
    next(error)
  }
}