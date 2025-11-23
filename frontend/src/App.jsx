import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Páginas
import Home from './pages/Home';
import Eventos from './pages/Eventos';
import EventoDetalhe from './pages/EventoDetalhe';
import Oracao from './pages/Oracao';
import FluxoCaixa from './pages/FluxoCaixa';
import Login from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Componentes
import Sidebar from './components/Sidebar';
import AuthProvider from './components/AuthProvider'; // Importado apenas uma vez agora
import ProtectedRoute from './components/ProtectedRoute'; // Importado caso queira proteger rotas

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Sidebar />
          <main className="content">
            <Routes>
              {/* Rotas do Sistema */}
              <Route path='/' element={<Home />} />
              <Route path='/eventos' element={<Eventos />} />
              <Route path='/evento/:id' element={<EventoDetalhe />} />
              <Route path='/oracao' element={<Oracao />} />
              <Route path='/fluxo-caixa' element={<FluxoCaixa />} />
              
              {/* Rotas de Autenticação */}
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/forgot-password' element={<ForgotPasswordPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App;
