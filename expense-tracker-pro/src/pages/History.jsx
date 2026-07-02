import { useState, useMemo } from 'react'
import { Search, Filter, Trash2, Pencil } from 'lucide-react'
import { categoryMap } from '../constants/categories'
import EditTransactionModal from '../components/transactions/EditTransactionModal'
import { formatDate } from '../utils/formatDate'
import { formatCurrencyWithSign } from '../utils/formatCurrency'
import { useCurrency } from '../context/CurrencyContext'
import EmptyState from '../components/ui/EmptyState'

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SummaryPill({ label, value, positive }) {
  const { currencyCode } = useCurrency()

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex flex-col gap-1">
      <p className="text-gray-500 text-xs font-medium">{label}</p>
      <p className={`text-lg font-bold ${
        positive === true  ? 'text-emerald-400' :
        positive === false ? 'text-rose-400'    :
        'text-white'
      }`}>
        {formatCurrencyWithSign(value, currencyCode)}
      </p>
    </div>
  )
}

function TransactionRow({ tx, onDelete, onEdit }) {
  const cat = categoryMap[tx.category] ?? categoryMap['Other']
  const Icon = cat.icon
  const isExpense = tx.type === 'expense'
  const { currencyCode } = useCurrency()

  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-gray-800 last:border-0 group">
      <div className={`${cat.bg} p-2.5 rounded-xl flex-shrink-0`}>
        <Icon size={18} className={cat.color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-200 truncate">{tx.title}</p>
        <p className="text-xs text-gray-600">{tx.category}</p>
      </div>
      {tx.note && (
        <p className="text-xs text-gray-600 hidden md:block max-w-40 truncate italic">{tx.note}</p>
      )}
      <p className="text-xs text-gray-600 hidden sm:block flex-shrink-0">
        {formatDate(tx.date)}
      </p>
      <p className={`text-sm font-semibold flex-shrink-0 w-24 text-right ${
        isExpense ? 'text-rose-400' : 'text-emerald-400'
      }`}>
        {formatCurrencyWithSign(isExpense ? -tx.amount : tx.amount, currencyCode)}
      </p>

      {/* Edit + Delete actions */}
      <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(tx)}
          className="text-gray-600 hover:text-indigo-400 transition-colors"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => onDelete(tx._id)}
          className="text-gray-600 hover:text-rose-400 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function History({ transactions = [], onDelete, onUpdate }) {
  const [search, setSearch]                 = useState('')
  const [typeFilter, setTypeFilter]         = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortOrder, setSortOrder]           = useState('newest')
  const [editingTx, setEditingTx]           = useState(null)

  const filtered = useMemo(() => {
    let result = [...transactions]
    if (search.trim()) {
      result = result.filter((tx) =>
        tx.title.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (typeFilter !== 'all')     result = result.filter((tx) => tx.type === typeFilter)
    if (categoryFilter !== 'all') result = result.filter((tx) => tx.category === categoryFilter)
    result.sort((a, b) => {
      if (sortOrder === 'newest')  return new Date(b.date) - new Date(a.date)
      if (sortOrder === 'oldest')  return new Date(a.date) - new Date(b.date)
      if (sortOrder === 'highest') return b.amount - a.amount
      if (sortOrder === 'lowest')  return a.amount - b.amount
      return 0
    })
    return result
  }, [transactions, search, typeFilter, categoryFilter, sortOrder])

  const summary = useMemo(() => {
    const income   = filtered.filter((t) => t.type === 'income').reduce((s, t)  => s + t.amount, 0)
    const expenses = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return { income, expenses, net: income - expenses }
  }, [filtered])

  const allCategories = [...new Set(transactions.map((t) => t.category))]

  async function handleSaveEdit(id, updatedData) {
    await onUpdate(id, updatedData)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Transaction History</h1>
        <p className="text-gray-500 text-sm mt-1">
          Search, filter, and manage all your transactions.
        </p>
      </div>

      {/* Summary Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryPill label="Total Income"   value={summary.income}   positive={true}  />
        <SummaryPill label="Total Expenses" value={summary.expenses} positive={false} />
        <SummaryPill label="Net Balance"    value={summary.net}      positive={summary.net >= 0} />
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2 flex-1 min-w-48">
            <Search size={15} className="text-gray-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
            <Filter size={15} className="text-gray-500" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-sm text-gray-300 outline-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-sm text-gray-300 outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent text-sm text-gray-300 outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Transactions</h2>
          <span className="text-xs text-gray-600 bg-gray-800 px-2.5 py-1 rounded-full">
            {filtered.length} of {transactions.length} shown
          </span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No transactions found"
            message="Try adjusting your search or filters."
            buttonLabel="Clear Filters"
            onButtonClick={() => {
              setSearch('')
              setTypeFilter('all')
              setCategoryFilter('all')
            }}
          />
        ) : (
          <div>
            {filtered.map((tx) => (
              <TransactionRow
                key={tx._id}
                tx={tx}
                onDelete={onDelete}
                onEdit={setEditingTx}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal — only renders when editingTx is set */}
      <EditTransactionModal
        transaction={editingTx}
        onClose={() => setEditingTx(null)}
        onSave={handleSaveEdit}
      />
    </div>
  )
}