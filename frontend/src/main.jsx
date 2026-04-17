import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Reset de estilos globales mínimo
const globalStyle = document.createElement('style');
globalStyle.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f5f7ff; color: #222; -webkit-font-smoothing: antialiased; }
  textarea, input, button { font-family: inherit; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #f0f0f0; }
  ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
`;
document.head.appendChild(globalStyle);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
