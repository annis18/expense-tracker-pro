// ---------------------------------------------------------------------------
// Supported currencies — add more here in future without changing anything else
// ---------------------------------------------------------------------------

export const CURRENCIES = {
  USD: { symbol: '$', locale: 'en-US', code: 'USD' },
  INR: { symbol: '₹', locale: 'en-IN', code: 'INR' },
}

// ---------------------------------------------------------------------------
// formatCurrency — pure function, safe to call anywhere
//
// Usage:
//   formatCurrency(1234.5, 'USD')  →  "$1,234.50"
//   formatCurrency(1234.5, 'INR')  →  "₹1,234.50"
// ---------------------------------------------------------------------------

export function formatCurrency(amount, currencyCode = 'USD') {
  const currency = CURRENCIES[currencyCode] ?? CURRENCIES.USD
  const absAmount = Math.abs(amount ?? 0)

  return `${currency.symbol}${absAmount.toLocaleString(currency.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

// ---------------------------------------------------------------------------
// formatCurrencyWithSign — includes +/- prefix for transaction rows
//
// Usage:
//   formatCurrencyWithSign(-124.5, 'USD')  →  "-$124.50"
//   formatCurrencyWithSign(1500,   'INR')  →  "+₹1,500.00"
// ---------------------------------------------------------------------------

export function formatCurrencyWithSign(amount, currencyCode = 'USD') {
  const sign = amount < 0 ? '-' : '+'
  return `${sign}${formatCurrency(amount, currencyCode)}`
}