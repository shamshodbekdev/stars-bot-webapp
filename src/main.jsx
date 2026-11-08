import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { initTelegram } from './lib/telegram';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider } from './contexts/UserContext';
import { ToastProvider } from './components/ui/Toast';
import './index.css';

initTelegram();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
