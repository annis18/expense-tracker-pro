import {
  ShoppingCart,
  Zap,
  Coffee,
  Car,
  Home,
  Utensils,
  HeartPulse,
  Gamepad2,
  BookOpen,
  Plane,
  TrendingUp,
  DollarSign,
} from 'lucide-react'

export const categories = [
  { label: 'Shopping',      icon: ShoppingCart, color: 'text-orange-400',  bg: 'bg-orange-500/10'  },
  { label: 'Utilities',     icon: Zap,          color: 'text-yellow-400',  bg: 'bg-yellow-500/10'  },
  { label: 'Food & Drink',  icon: Coffee,       color: 'text-amber-400',   bg: 'bg-amber-500/10'   },
  { label: 'Transport',     icon: Car,          color: 'text-blue-400',    bg: 'bg-blue-500/10'    },
  { label: 'Housing',       icon: Home,         color: 'text-purple-400',  bg: 'bg-purple-500/10'  },
  { label: 'Dining',        icon: Utensils,     color: 'text-pink-400',    bg: 'bg-pink-500/10'    },
  { label: 'Health',        icon: HeartPulse,   color: 'text-rose-400',    bg: 'bg-rose-500/10'    },
  { label: 'Entertainment', icon: Gamepad2,     color: 'text-cyan-400',    bg: 'bg-cyan-500/10'    },
  { label: 'Education',     icon: BookOpen,     color: 'text-indigo-400',  bg: 'bg-indigo-500/10'  },
  { label: 'Travel',        icon: Plane,        color: 'text-sky-400',     bg: 'bg-sky-500/10'     },
  { label: 'Income',        icon: TrendingUp,   color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Other',         icon: DollarSign,   color: 'text-gray-400',    bg: 'bg-gray-500/10'    },
]

// Keyed version for O(1) lookups by name
export const categoryMap = Object.fromEntries(
  categories.map((c) => [c.label, c])
)