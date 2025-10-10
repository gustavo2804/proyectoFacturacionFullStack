
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './routes/AppRouter'
import Layout from './components/Layout'
import { AuthProvider } from './contexts/AuthContext'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <AppRouter />
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
