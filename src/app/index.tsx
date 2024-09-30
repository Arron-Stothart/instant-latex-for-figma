import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './styles/globals.css';

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('react-page');
  const root = createRoot(container);
  root.render(
    <div className="scale-[0.6] origin-top-left w-[167%] h-[167%]">
      <App />
    </div>
  );
});
