import { useState, useEffect } from 'react'
import { X, Loader2, Save } from 'lucide-react'
import { categories } from '../../constants/categories'

export default function EditTransactionModal({ transaction, onClose, onSave }) {
  const [form, setForm]             = useState(null)
  const [errors, setErrors]         = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError]     = useState('')

  // Pre-fill the form whenever a transaction is passed in
  useEffect(() => {
    if (transaction) {
      setForm({
        title:    transaction.title,
        amount:   transaction.amount,
        category: transaction.category,
        type:     transaction.type,
        date:     transaction.date?.split('T')[0] ?? new Date().toISOString().split('T')[0],
        note:     transaction.note || '',
      })
      setErrors({})
      setApiError('')
    }
  }, [transaction])

  // Don't render anything if no transaction is being edited
  if (!transaction || !form) return null

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.title.trim())           e.title    = 'Title is required.'
    if (!form.amount)                 e.amount   = 'Amount is required.'
    if (parseFloat(form.amount) <= 0) e.amount   = 'Amount must be greater than 0.'
    if (!form.category)               e.category = 'Please select a category.'
    if (!form.date)                   e.date     = 'Date is required.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setSubmitting(true)
      setApiError('')
      await onSave(transaction._id, {
        ...form,
        amount: parseFloat(form.amount),
      })
      onClose()
    } catch (err) {
      setApiError(err.response?.data?.error || 'Failed to update transaction.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Edit Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Type Toggle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-400">Type</label>
            <div className="flex rounded-lg overflow-hidden border border-gray-700">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, type: 'expense' }))}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  form.type === 'expense'
                    ? 'bg-rose-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, type: 'income' }))}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  form.type === 'income'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-400">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none border transition-colors ${
                errors.title ? 'border-rose-500' : 'border-gray-700 focus:border-indigo-500'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-400">{errors.title}</p>}
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-400">Amount ($)</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none border transition-colors ${
                errors.amount ? 'border-rose-500' : 'border-gray-700 focus:border-indigo-500'
              }`}
            />
            {errors.amount && <p className="text-xs text-rose-400">{errors.amount}</p>}
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-400">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none border transition-colors ${
                errors.category ? 'border-rose-500' : 'border-gray-700 focus:border-indigo-500'
              }`}
            >
              {categories.map((c) => (
                <option key={c.label} value={c.label}>{c.label}</option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-rose-400">{errors.category}</p>}
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-400">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={`bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none border transition-colors ${
                errors.date ? 'border-rose-500' : 'border-gray-700 focus:border-indigo-500'
              }`}
            />
            {errors.date && <p className="text-xs text-rose-400">{errors.date}</p>}
          </div>

          {/* Note */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-400">Note (optional)</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={2}
              className="bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none border border-gray-700 focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* API error */}
          {apiError && (
            <p className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
              {apiError}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}