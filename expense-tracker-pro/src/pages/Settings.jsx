import { Settings as SettingsIcon } from 'lucide-react'

export default function Settings() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          App preferences and account configuration.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center gap-4">
        <div className="bg-gray-800 p-5 rounded-2xl">
          <SettingsIcon size={36} className="text-gray-600" />
        </div>
        <p className="text-gray-500 text-sm font-medium">Settings coming in Phase 3</p>
        <p className="text-gray-700 text-xs text-center max-w-sm">
          JWT authentication, user profile, currency preferences, and theme
          switching will live here after we wire up the backend.
        </p>
      </div>
    </div>
  )
}