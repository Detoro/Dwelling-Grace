import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext.tsx'
import { DesignerOptionsProvider } from './context/DesignerOptionsContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <DesignerOptionsProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </DesignerOptionsProvider>
    </BrowserRouter>
  </StrictMode>,
)