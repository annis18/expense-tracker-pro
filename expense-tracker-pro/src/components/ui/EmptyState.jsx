import { PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// ---------------------------------------------------------------------------
// EmptyState — reusable across Dashboard, History, Reports
//
// Usage:
//   <EmptyState />
//   <EmptyState title="No results" message="Try clearing your filters" showButton={false} />
// ---------------------------------------------------------------------------

export default function EmptyState({
  icon:    Icon    = PlusCircle,
  title            = 'No transactions yet',
  message          = 'Add your first expense to get started.',
  buttonLabel      = 'Add Transaction',
  showButton       = true,
  onButtonClick    = null,
}) {
  const navigate = useNavigate()

  function handleClick() {
    if (onButtonClick) {
      onButtonClick()
    } else {
      navigate('/add')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="bg-gray-800 p-5 rounded-2xl">
        <Icon size={32} className="text-gray-600" />
      </div>
      <div className="text-center">
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-gray-600 text-xs mt-1 max-w-xs">{message}</p>
      </div>
      {showButton && (
        <button
          onClick={handleClick}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors mt-1"
        >
          <PlusCircle size={16} />
          {buttonLabel}
        </button>
      )}
    </div>
  )
}