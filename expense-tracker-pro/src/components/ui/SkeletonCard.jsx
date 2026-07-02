// ---------------------------------------------------------------------------
// SkeletonCard — animated placeholder shown while transactions are loading
// ---------------------------------------------------------------------------

function SkeletonBlock({ className }) {
  return (
    <div className={`bg-gray-800 rounded-lg animate-pulse ${className}`} />
  )
}

export function SkeletonSummaryCard() {
  return (
    <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-8 w-8 rounded-lg" />
      </div>
      <div className="flex flex-col gap-2">
        <SkeletonBlock className="h-7 w-32" />
        <SkeletonBlock className="h-3 w-20" />
      </div>
    </div>
  )
}

export function SkeletonTransactionRow() {
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-gray-800 last:border-0">
      <SkeletonBlock className="h-10 w-10 rounded-xl flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <SkeletonBlock className="h-3.5 w-40" />
        <SkeletonBlock className="h-3 w-24" />
      </div>
      <SkeletonBlock className="h-3 w-16 hidden sm:block" />
      <SkeletonBlock className="h-4 w-20" />
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="bg-gray-800 rounded-lg animate-pulse h-7 w-32" />
          <div className="bg-gray-800 rounded-lg animate-pulse h-4 w-56" />
        </div>
        <div className="bg-gray-800 rounded-lg animate-pulse h-9 w-24" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <SkeletonSummaryCard />
        <SkeletonSummaryCard />
        <SkeletonSummaryCard />
      </div>

      {/* Recent Transactions */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-gray-800 rounded-lg animate-pulse h-5 w-40" />
          <div className="bg-gray-800 rounded-lg animate-pulse h-5 w-16 rounded-full" />
        </div>
        {[...Array(5)].map((_, i) => (
          <SkeletonTransactionRow key={i} />
        ))}
      </div>
    </div>
  )
}
