import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './styles/globals.css';

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('react-page');
  const root = createRoot(container);
  root.render(
    <div className="origin-top-left">
      <App />
    </div>
  );
});
