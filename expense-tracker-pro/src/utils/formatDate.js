// ---------------------------------------------------------------------------
// formatDate — converts ISO string or Date object to clean readable format
//
// Usage:
//   formatDate('2026-06-27T00:00:00.000Z')  →  '27 Jun 2026'
//   formatDate('2026-06-27')                 →  '27 Jun 2026'
//   formatDate(null)                         →  '—'
// ---------------------------------------------------------------------------

export function formatDate(dateInput) {
  if (!dateInput) return '—'

  const date = new Date(dateInput)

  // Guard against invalid dates
  if (isNaN(date.getTime())) return '—'

  return date.toLocaleDateString('en-GB', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  })
}

// ---------------------------------------------------------------------------
// formatDateShort — for compact spaces like transaction rows
//
// Usage:
//   formatDateShort('2026-06-27T00:00:00.000Z')  →  '27 Jun'
// ---------------------------------------------------------------------------

export function formatDateShort(dateInput) {
  if (!dateInput) return '—'

  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return '—'

  return date.toLocaleDateString('en-GB', {
    day:   '2-digit',
    month: 'short',
  })
}