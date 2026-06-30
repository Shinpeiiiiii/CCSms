import ReactDOM from 'react-dom/client'

import App from './App'
import './index.css'

import { Provider } from 'react-redux'

import { store } from './app/store'
import { ConfirmModalProvider } from './context/ConfimModalContext'
import QueryProvider from './providers/QueryProvider'

ReactDOM.createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <QueryProvider>
      <ConfirmModalProvider>
        <App />
      </ConfirmModalProvider>
    </QueryProvider>
  </Provider>
)
