import { useState } from 'react'
import { PlusCircle, Trash2, Loader2 } from 'lucide-react'
import { categories, categoryMap } from '../constants/categories'

const emptyForm = {
  title:    '',
  amount:   '',
  category: '',
  type:     'expense',
  date:     new Date().toISOString().split('T')[0],
  note:     '',
}

function InputField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-400">{label}</label>
      {children}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  )
}

function TransactionItem({ tx, onDelete }) {
  const cat = categoryMap[tx.category] ?? categoryMap['Other']
  const Icon = cat.icon
  const isExpense = tx.type === 'expense'

  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-800 last:border-0">
      <div className={`${cat.bg} p-2.5 rounded-xl flex-shrink-0`}>
        <Icon size={18} className={cat.color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-200 truncate">{tx.title}</p>
        <p className="text-xs text-gray-600">{tx.category} · {tx.date}</p>
      </div>
      {tx.note && (
        <p className="text-xs text-gray-600 hidden sm:block max-w-32 truncate">{tx.note}</p>
      )}
      <p className={`text-sm font-semibold flex-shrink-0 ${isExpense ? 'text-rose-400' : 'text-emerald-400'}`}>
        {isExpense ? '-' : '+'}${parseFloat(tx.amount).toFixed(2)}
      </p>
      <button
        onClick={() => onDelete(tx.id)}
        className="text-gray-700 hover:text-rose-400 transition-colors flex-shrink-0"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

export default function AddExpense({ onAdd }) {
  const [form, setForm]           = useState(emptyForm)
  const [errors, setErrors]       = useState({})
  const [localList, setLocalList] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError]   = useState('')

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
    setApiError('')
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    try {
      setSubmitting(true)
      await onAdd(form)

      // Local preview only — purely visual, resets on page leave
      setLocalList((prev) => [
        { ...form, id: Date.now(), amount: parseFloat(form.amount) },
        ...prev,
      ])
      setForm(emptyForm)
      setErrors({})
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      setApiError(err.response?.data?.error || 'Failed to add transaction. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleLocalDelete(id) {
    setLocalList((prev) => prev.filter((tx) => tx.id !== id))
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Add Transaction</h1>
        <p className="text-gray-500 text-sm mt-1">Record a new expense or income entry.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Form ── */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h2 className="text-base font-semibold text-white mb-6">Transaction Details</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            <InputField label="Type">
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
            </InputField>

            <InputField label="Title" error={errors.title}>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Grocery run, Netflix subscription"
                className={`bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none placeholder-gray-600 border transition-colors ${
                  errors.title ? 'border-rose-500' : 'border-gray-700 focus:border-indigo-500'
                }`}
              />
            </InputField>

            <InputField label="Amount ($)" error={errors.amount}>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={`bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none placeholder-gray-600 border transition-colors ${
                  errors.amount ? 'border-rose-500' : 'border-gray-700 focus:border-indigo-500'
                }`}
              />
            </InputField>

            <InputField label="Category" error={errors.category}>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none border transition-colors ${
                  errors.category ? 'border-rose-500' : 'border-gray-700 focus:border-indigo-500'
                }`}
              >
                <option value="" disabled>Select a category</option>
                {categories.map((c) => (
                  <option key={c.label} value={c.label}>{c.label}</option>
                ))}
              </select>
            </InputField>

            <InputField label="Date" error={errors.date}>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className={`bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none border transition-colors ${
                  errors.date ? 'border-rose-500' : 'border-gray-700 focus:border-indigo-500'
                }`}
              />
            </InputField>

            <InputField label="Note (optional)">
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Any extra details..."
                rows={3}
                className="bg-gray-800 text-white text-sm rounded-lg px-4 py-2.5 outline-none placeholder-gray-600 border border-gray-700 focus:border-indigo-500 transition-colors resize-none"
              />
            </InputField>

            {apiError && (
              <p className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                {apiError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-lg transition-colors mt-1"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} />}
              {submitting ? 'Adding...' : 'Add Transaction'}
            </button>

            {submitted && (
              <div className="text-center text-sm text-emerald-400 font-medium animate-pulse">
                ✅ Transaction added! Check Dashboard and History.
              </div>
            )}

          </form>
        </div>

        {/* ── Local Preview List ── */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-white">Added This Session</h2>
            <span className="text-xs text-gray-600 bg-gray-800 px-2.5 py-1 rounded-full">
              {localList.length} added
            </span>
          </div>

          {localList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="bg-gray-800 p-4 rounded-2xl">
                <PlusCircle size={28} className="text-gray-600" />
              </div>
              <p className="text-gray-600 text-sm">No transactions yet.</p>
              <p className="text-gray-700 text-xs">Fill the form and hit Add Transaction.</p>
            </div>
          ) : (
            <div>
              {localList.map((tx) => (
                <TransactionItem key={tx.id} tx={tx} onDelete={handleLocalDelete} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}