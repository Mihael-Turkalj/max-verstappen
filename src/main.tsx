import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/big-shoulders/500.css'
import '@fontsource/big-shoulders/800.css'
import '@fontsource/big-shoulders/900.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fontsource/jetbrains-mono/700.css'
import './styles/site.css'
import { punch } from './lib/motion'
import App from './App'

// The film's slam spring as a CSS easing, for the CSS animations that carry it
document.documentElement.style.setProperty('--punch', punch.css)
document.documentElement.style.setProperty('--punch-ms', `${punch.ms}ms`)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
