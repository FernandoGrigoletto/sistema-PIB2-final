import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Sidebar from './components/Sidebar'
import Oracao from './pages/Oracao'
import Eventos from './pages/Eventos'
import EventoDetalhe from './pages/EventoDetalhe'
import Login from './pages/LoginPage'
import FluxoCaixa from './pages/FluxoCaixa'  // <-- import novo
import AuthProvider from './components/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Sidebar />
          <main className="content">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/eventos' element={<Eventos />} />
              <Route path='/evento/:id' element={<EventoDetalhe />} />
              <Route path='/oracao' element={<Oracao />} />
              <Route path='/fluxo-caixa' element={<FluxoCaixa />} />  {/* <-- rota nova */}
              <Route path='/login' element={<Login />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App;

