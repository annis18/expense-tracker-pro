import { useState, useEffect } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
//import { Loader2 } from 'lucide-react'
import Navbar    from './components/layout/Navbar'
import Sidebar   from './components/layout/Sidebar'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Dashboard  from './pages/Dashboard'
import AddExpense from './pages/AddExpense'
import History    from './pages/History'
import Reports    from './pages/Reports'
import Settings   from './pages/Settings'
import Login      from './pages/Login'
import Register   from './pages/Register'
import NotFound   from './pages/NotFound'
import { SkeletonDashboard } from './components/ui/SkeletonCard'
import {
  getTransactions,
  createTransaction,
  updateTransaction as updateTransactionApi,
  deleteTransaction as deleteTransactionApi,
} from './services/api'

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

function Layout() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="pt-16 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="ml-64 pt-16">
        <SkeletonDashboard />
      </div>
    </div>
  )
}

function ErrorScreen({ message, onRetry }) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 px-6">
      <p className="text-rose-400 font-semibold">Could not load data</p>
      <p className="text-gray-500 text-sm text-center max-w-sm">{message}</p>
      <button
        onClick={onRetry}
        className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
      >
        Retry
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// TransactionsLayer — fetches data ONLY once the user is authenticated.
// This sits inside ProtectedRoute so it never runs for logged-out users.
// ---------------------------------------------------------------------------

function TransactionsLayer() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  async function fetchTransactions() {
    try {
      setLoading(true)
      setError(null)
      const result = await getTransactions()
      setTransactions(result.data)
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
      setError(
        err.response?.data?.error ||
        'Unable to connect to the server. Is your backend running on port 5000?'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  async function handleAdd(formData) {
    await createTransaction(formData)
    await fetchTransactions()
  }

  async function handleDelete(id) {
    try {
      await deleteTransactionApi(id)
      setTransactions((prev) => prev.filter((tx) => tx._id !== id))
    } catch (err) {
      console.error('Failed to delete transaction:', err)
    }
  }
  
  async function handleUpdate(id, updatedData) {
    const result = await updateTransactionApi(id, updatedData)
    setTransactions((prev) =>
      prev.map((tx) => (tx._id === id ? result.data : tx))
    )
  }

  if (loading) return <LoadingScreen />
  if (error)   return <ErrorScreen message={error} onRetry={fetchTransactions} />

  const totalIncome   = transactions.filter((t) => t.type === 'income').reduce((s, t)  => s + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const totalBalance  = totalIncome - totalExpenses

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <Dashboard
              transactions={transactions}
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              totalBalance={totalBalance}
            />
          }
        />
        <Route path="/add"      element={<AddExpense onAdd={handleAdd} />} />
        <Route path="/history"  element={<History transactions={transactions} onDelete={handleDelete} onUpdate={handleUpdate} />} />
        <Route path="/reports"  element={<Reports />}  />
        <Route path="/settings" element={<Settings />} />
        <Route path="*"         element={<NotFound />} />
      </Route>
    </Routes>
  )
}

// ---------------------------------------------------------------------------
// App — top-level route table: public auth routes vs protected app routes
// ---------------------------------------------------------------------------

export default function App() {
  return (
    <Routes>
      {/* Public routes — no token needed */}
      <Route path="/login"    element={<Login />}    />
      <Route path="/register" element={<Register />} />

      {/* Everything else requires authentication */}
      <Route element={<ProtectedRoute />}>
        <Route path="/*" element={<TransactionsLayer />} />
      </Route>
    </Routes>
  )
}