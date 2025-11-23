import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Sidebar from './components/Sidebar'
import Oracao from './pages/Oracao'
import Eventos from './pages/Eventos'
import EventoDetalhe from './pages/EventoDetalhe'
import Login from './pages/LoginPage'
import FluxoCaixa from './pages/FluxoCaixa'
import RegisterPage from './pages/RegisterPage' // Certifique-se de importar a página de registro também
import ForgotPasswordPage from './pages/ForgotPasswordPage';
// --- O IMPORT QUE ESTÁ FALTANDO ---
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
              <Route path='/fluxo-caixa' element={<FluxoCaixa />} />
              
              {/* Rotas de Autenticação */}
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/forgot-password' element={<ForgotPasswordPage />} /> {/* Nova Rota */}
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App;

