import { StrictMode }    from 'react'
import { createRoot }    from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider }     from './context/AuthContext'
import { CurrencyProvider } from './context/CurrencyContext'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CurrencyProvider>
        <AuthProvider>
          <App />
          {/* Single ToastContainer for the whole app — sits outside App
              so toasts appear even during route transitions             */}
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss={false}
            pauseOnHover
            draggable
            theme="dark"
            toastStyle={{
              backgroundColor: '#111827',
              border:          '1px solid #1f2937',
              borderRadius:    '12px',
              fontSize:        '14px',
              color:           '#f3f4f6',
            }}
          />
        </AuthProvider>
      </CurrencyProvider>
    </BrowserRouter>
  </StrictMode>,
)