import { useAuth }     from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'
import { formatCurrency, formatCurrencyWithSign } from '../utils/formatCurrency'
import { categoryMap } from '../constants/categories'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SummaryCard({ label, value, change, positive, icon: Icon, borderColor, iconBg, iconColor }) {
  const { currencyCode } = useCurrency()

  return (
    <div className={`bg-gray-900 rounded-2xl p-5 border ${borderColor} flex flex-col gap-4`}>
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm font-medium">{label}</p>
        <div className={`${iconBg} p-2 rounded-lg`}>
          <Icon size={18} className={iconColor} />
        </div>
      </div>
      <div>
        <p className="text-white text-2xl font-bold tracking-tight">
          {formatCurrency(value, currencyCode)}
        </p>
        <div className="flex items-center gap-1 mt-1">
          {positive ? (
            <ArrowUpRight size={14} className="text-emerald-400" />
          ) : (
            <ArrowDownRight size={14} className="text-rose-400" />
          )}
          <p className={`text-xs font-medium ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {change}
          </p>
        </div>
      </div>
    </div>
  )
}

function TransactionRow({ tx }) {
  const { currencyCode } = useCurrency()
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
        <p className="text-xs text-gray-600">{tx.category}</p>
      </div>
      <p className="text-xs text-gray-600 hidden sm:block">{tx.date}</p>
      <p className={`text-sm font-semibold flex-shrink-0 ${
        isExpense ? 'text-rose-400' : 'text-emerald-400'
      }`}>
        {formatCurrencyWithSign(isExpense ? -tx.amount : tx.amount, currencyCode)}
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Dashboard({
  transactions  = [],
  totalIncome   = 0,
  totalExpenses = 0,
  totalBalance  = 0,
}) {
  const { user }       = useAuth()
  const { currencyCode, currency, toggleCurrency } = useCurrency()
  const recent = transactions.slice(0, 5)

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, {user?.name ?? 'there'}. Here&apos;s your financial summary.
          </p>
        </div>

        {/* Currency Toggle Button */}
        <button
          onClick={toggleCurrency}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition-all flex-shrink-0"
        >
          <span className="text-base">{currency.symbol}</span>
          <span>{currencyCode}</span>
          <span className="text-gray-600 text-xs">↕</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <SummaryCard
          label="Total Balance"
          value={totalBalance}
          change={totalBalance >= 0 ? 'Positive balance' : 'Negative balance'}
          positive={totalBalance >= 0}
          icon={DollarSign}
          borderColor="border-indigo-500/20"
          iconBg="bg-indigo-500/10"
          iconColor="text-indigo-400"
        />
        <SummaryCard
          label="Total Income"
          value={totalIncome}
          change={`${transactions.filter(t => t.type === 'income').length} income entries`}
          positive={true}
          icon={TrendingUp}
          borderColor="border-emerald-500/20"
          iconBg="bg-emerald-500/10"
          iconColor="text-emerald-400"
        />
        <SummaryCard
          label="Total Expenses"
          value={totalExpenses}
          change={`${transactions.filter(t => t.type === 'expense').length} expense entries`}
          positive={false}
          icon={TrendingDown}
          borderColor="border-rose-500/20"
          iconBg="bg-rose-500/10"
          iconColor="text-rose-400"
        />
      </div>

      {/* Recent Transactions */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Recent Transactions</h2>
          <span className="text-xs text-gray-600 bg-gray-800 px-2.5 py-1 rounded-full">
            {transactions.length} total
          </span>
        </div>
        {recent.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-10">
            No transactions yet. Add one to get started.
          </p>
        ) : (
          <div>
            {recent.map((tx) => (
              <TransactionRow key={tx._id} tx={tx} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}