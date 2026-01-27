
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
  } catch (err) {
    console.error("Mounting error:", err);
    rootElement.innerHTML = `<div style="color:white; text-align:center; margin-top:50px;">Rendering Error: ${err}</div>`;
  }
}
