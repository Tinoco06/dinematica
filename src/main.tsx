import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Fuentes — Cooper Hewitt (body/títulos) + Silkscreen (display/disruptivo, placeholder de Offbit)
import '@fontsource/cooper-hewitt/300.css'
import '@fontsource/cooper-hewitt/400.css'
import '@fontsource/cooper-hewitt/500.css'
import '@fontsource/cooper-hewitt/700.css'
import '@fontsource/silkscreen/400.css'
import '@fontsource/silkscreen/700.css'

// Estilos globales
import '@/styles/globals.css'

import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
