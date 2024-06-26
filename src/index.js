import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
const root = document.getElementById('root');

// Use createRoot instead of ReactDOM.render
const rootElement = createRoot(root);
rootElement.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);
