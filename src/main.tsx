// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Global spin keyframe (used across components)
const style = document.createElement('style')
style.textContent = `
  @keyframes spin { to { transform: rotate(360deg); } }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f8fafc; color: #0f172a; }
  :focus-visible { outline: 2px solid #38bdf8; outline-offset: 2px; border-radius: 4px; }
`
document.head.appendChild(style)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
