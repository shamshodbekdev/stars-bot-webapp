import React from 'react'
import ReactDOM from 'react-dom/client'
import WebApp from '@twa-dev/sdk'
import App from './App.jsx'
import { LanguageProvider } from './contexts/LanguageContext'
import { ToastProvider } from './components/ui/Toast'
import './index.css'

WebApp.ready()
WebApp.expand()
WebApp.setHeaderColor('secondary_bg_color')

if (WebApp.colorScheme === 'dark') {
  document.documentElement.classList.add('dark')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
