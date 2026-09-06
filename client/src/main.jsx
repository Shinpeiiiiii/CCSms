import ReactDOM from 'react-dom/client'

import App from './App'
import './index.css'

import { ConfirmModalProvider } from './context/ConfimModalContext'
import QueryProvider from './providers/QueryProvider'

import { ToastContainer } from "react-toastify"
import "react-toastify/ReactToastify.css"
ReactDOM.createRoot(document.getElementById('root')).render(

  <QueryProvider>
    <ConfirmModalProvider>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </ConfirmModalProvider>
  </QueryProvider>
)
