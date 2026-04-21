import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ConfirmProvider } from './context/ConfirmContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ToastProvider>
      <ConfirmProvider>
        <App />
      </ConfirmProvider>
    </ToastProvider>
  </AuthProvider>
);
