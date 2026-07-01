import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon } from 'lucide-react'

// ---------------------------------------------------------------------------
// Dummy data — replaced by real API data in Phase 3
// ---------------------------------------------------------------------------

const categoryData = [
  { name: 'Housing',       value: 800,  color: '#a855f7' },
  { name: 'Travel',        value: 320,  color: '#38bdf8' },
  { name: 'Shopping',      value: 124,  color: '#fb923c' },
  { name: 'Health',        value: 49,   color: '#fb7185' },
  { name: 'Dining',        value: 67,   color: '#f472b6' },
  { name: 'Utilities',     value: 89,   color: '#facc15' },
  { name: 'Entertainment', value: 16,   color: '#22d3ee' },
  { name: 'Education',     value: 15,   color: '#818cf8' },
  { name: 'Transport',     value: 18,   color: '#60a5fa' },
  { name: 'Food & Drink',  value: 7,    color: '#fbbf24' },
]

const monthlyData = [
  { month: 'Jan', income: 4200, expenses: 3100 },
  { month: 'Feb', income: 3800, expenses: 2900 },
  { month: 'Mar', income: 5100, expenses: 3400 },
  { month: 'Apr', income: 4700, expenses: 3800 },
  { month: 'May', income: 5300, expenses: 4100 },
  { month: 'Jun', income: 5240, expenses: 3890 },
]

const balanceTrendData = [
  { month: 'Jan', balance: 8200  },
  { month: 'Feb', balance: 9100  },
  { month: 'Mar', balance: 10800 },
  { month: 'Apr', balance: 11700 },
  { month: 'May', balance: 12900 },
  { month: 'Jun', balance: 12450 },
]

const totalExpenses = categoryData.reduce((s, c) => s + c.value, 0)
const totalIncome   = monthlyData.reduce((s, m) => s + m.income, 0)
const avgMonthly    = Math.round(totalExpenses / monthlyData.length)

// ---------------------------------------------------------------------------
// Custom Tooltip for PieChart
// ---------------------------------------------------------------------------

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0].payload
  const pct = ((value / totalExpenses) * 100).toFixed(1)
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-white font-semibold">{name}</p>
      <p className="text-gray-400">${value.toLocaleString()} · {pct}%</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Custom Tooltip for Bar / Area charts
// ---------------------------------------------------------------------------

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: ${p.value.toLocaleString()}
        </p>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

function StatCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-start gap-4">
      <div className={`${color} p-2.5 rounded-xl flex-shrink-0`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-gray-500 text-xs font-medium">{label}</p>
        <p className="text-white text-xl font-bold mt-0.5">{value}</p>
        {sub && <p className="text-gray-600 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Reports() {
  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Reports</h1>
        <p className="text-gray-500 text-sm mt-1">
          Visual breakdown of your income, expenses, and balance trend.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="6-Month Income"
          value={`$${totalIncome.toLocaleString()}`}
          sub="Jan – Jun 2026"
          icon={TrendingUp}
          color="bg-emerald-600"
        />
        <StatCard
          label="6-Month Expenses"
          value={`$${totalExpenses.toLocaleString()}`}
          sub="Jan – Jun 2026"
          icon={TrendingDown}
          color="bg-rose-600"
        />
        <StatCard
          label="Avg Monthly Spend"
          value={`$${avgMonthly.toLocaleString()}`}
          sub="Across all categories"
          icon={DollarSign}
          color="bg-indigo-600"
        />
        <StatCard
          label="Top Category"
          value="Housing"
          sub="$800 · 34% of expenses"
          icon={PieIcon}
          color="bg-purple-600"
        />
      </div>

      {/* Row 1: Pie + Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Pie Chart — spending by category */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="text-base font-semibold text-white mb-1">Spending by Category</h2>
          <p className="text-gray-600 text-xs mb-5">June 2026</p>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: c.color }}
                />
                <span className="text-xs text-gray-400 truncate">{c.name}</span>
                <span className="text-xs text-gray-600 ml-auto">${c.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart — income vs expenses */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="text-base font-semibold text-white mb-1">Income vs Expenses</h2>
          <p className="text-gray-600 text-xs mb-5">Jan – Jun 2026</p>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthlyData} barCategoryGap="30%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              />
              <Tooltip content={<BarTooltip />} cursor={{ fill: '#1f2937' }} />
              <Legend
                wrapperStyle={{ fontSize: '12px', color: '#9ca3af', paddingTop: '16px' }}
              />
              <Bar dataKey="income"   name="Income"   fill="#34d399" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Area Chart — balance trend */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h2 className="text-base font-semibold text-white mb-1">Balance Trend</h2>
        <p className="text-gray-600 text-xs mb-5">Running balance · Jan – Jun 2026</p>

        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={balanceTrendData}>
            <defs>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<BarTooltip />} />
            <Area
              type="monotone"
              dataKey="balance"
              name="Balance"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#balanceGrad)"
              dot={{ fill: '#6366f1', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: '#818cf8' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}