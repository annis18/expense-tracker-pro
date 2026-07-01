import { useNavigate, useLocation } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'

export default function NotFound() {
  const navigate  = useNavigate()
  const location  = useLocation()

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="text-center max-w-md">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-rose-500/10 p-5 rounded-2xl">
            <AlertTriangle size={40} className="text-rose-400" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-6xl font-black text-white mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-300 mb-3">Page Not Found</h2>

        {/* Detail */}
        <p className="text-gray-500 text-sm mb-2">
          The page you were looking for doesn&apos;t exist.
        </p>
        <p className="text-gray-700 text-xs font-mono bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 mb-8 inline-block">
          {location.pathname}
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 text-sm font-medium transition-colors"
          >
            ← Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            <Home size={16} />
            Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  )
}