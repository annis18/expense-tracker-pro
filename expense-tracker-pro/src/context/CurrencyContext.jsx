import { createContext, useContext, useState } from 'react'
import { CURRENCIES } from '../utils/formatCurrency'

const CurrencyContext = createContext(null)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function CurrencyProvider({ children }) {
  // Read from localStorage on first mount, default to USD
  const [currencyCode, setCurrencyCode] = useState(
    () => localStorage.getItem('currencyCode') ?? 'USD'
  )

  function toggleCurrency() {
    const next = currencyCode === 'USD' ? 'INR' : 'USD'
    localStorage.setItem('currencyCode', next)
    setCurrencyCode(next)
  }

  function setCurrency(code) {
    if (!CURRENCIES[code]) return
    localStorage.setItem('currencyCode', code)
    setCurrencyCode(code)
  }

  const value = {
    currencyCode,
    currency: CURRENCIES[currencyCode],
    toggleCurrency,
    setCurrency,
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Custom hook
// ---------------------------------------------------------------------------

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}