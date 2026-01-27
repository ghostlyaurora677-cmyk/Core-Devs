import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(<App />);
  } catch (error) {
    console.error("Mounting error:", error);
    container.innerHTML = `
      <div style="color:white; background:black; height:100vh; display:flex; align-items:center; justify-content:center; padding:20px; text-align:center;">
        <div>
          <h2 style="color:#ff4444;">Initialization Error</h2>
          <pre style="background:#111; padding:15px; border-radius:8px; font-size:12px; margin-top:10px;">${error}</pre>
        </div>
      </div>
    `;
  }
}