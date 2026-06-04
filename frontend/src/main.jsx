import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'

const saved=

localStorage.getItem(
"theme"
);

if(
saved==="dark"
){

document.body
.classList
.add(
"dark"
);

}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
