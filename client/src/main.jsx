import ReactDOM from 'react-dom/client'

import App from './App'
import './index.css'

import { Provider } from 'react-redux'

import { store } from './app/store'
import { ConfirmModalProvider } from './context/ConfimModalContext'
import QueryProvider from './providers/QueryProvider'

import { ToastContainer } from "react-toastify"
import "react-toastify/ReactToastify.css"
ReactDOM.createRoot(document.getElementById('root')).render(

  <Provider store={store}>
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
  </Provider>
)
