import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './AuthContext';
const root = document.getElementById('root');

// Use createRoot instead of ReactDOM.render
const rootElement = createRoot(root);
rootElement.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
