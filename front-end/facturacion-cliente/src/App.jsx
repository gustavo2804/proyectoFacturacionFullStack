
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './routes/AppRouter'
import Layout from './components/Layout'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Layout>
        <AppRouter />
      </Layout>
    </BrowserRouter>
  )
}

export default App
