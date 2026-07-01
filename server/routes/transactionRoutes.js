import express from 'express'
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Every transaction route now requires a valid JWT
router.use(protect)

router.route('/')
  .get(getTransactions)
  .post(createTransaction)

router.route('/:id')
  .get(getTransaction)
  .put(updateTransaction)
  .delete(deleteTransaction)

export default router