import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './components/AuthProvider';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import Membros from './pages/Membros';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Eventos from './pages/Eventos';
import EventoDetalhe from './pages/EventoDetalhe';
import Oracao from './pages/Oracao';
import FluxoCaixa from './pages/FluxoCaixa';
import Help from './pages/Help';
import Usuarios from './pages/Usuarios';
import PedidosOracao from './pages/PedidosOracao';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Sidebar />
          <div className="content d-flex flex-column min-vh-100">
            <div className="flex-grow-1">
              <Routes>
                {/* Rotas Públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
                
                {/* Eventos */}
                <Route path="/eventos" element={<Eventos />} />
                <Route path="/evento/:id" element={<EventoDetalhe />} />
                
                {/* Rota de Oração (Mural Público) */}
                <Route path="/oracao" element={<Oracao />} />

                {/* 2. NOVA ROTA DE GESTÃO DE ORAÇÃO (Protegida) */}
                <Route path="/pedidos-oracao" element={
                  <ProtectedRoute roles={['admin', 'operador']}>
                    <PedidosOracao />
                  </ProtectedRoute>
                } />

                {/* Nova Rota de Ajuda */}
                <Route path="/ajuda" element={
                  <ProtectedRoute roles={['admin', 'operador']}>
                    <Help />
                  </ProtectedRoute>
                  } />
                {/* Rota de Usuários apenas para Admin */}
                  <Route path="/usuarios" element={
                  <ProtectedRoute roles={['admin']}>
                   <Usuarios />
                   </ProtectedRoute>
                  } />

                {/* Rotas de Admin */}
                <Route path="/fluxo-caixa" element={
                  <ProtectedRoute roles={['admin', 'operador']}>
                    <FluxoCaixa />
                  </ProtectedRoute>
                } />

                {/* Rota de Cadastro apenas para Admin */}
                <Route path="/register" element={
                  <ProtectedRoute roles={['admin']}>
                    <RegisterPage />
                  </ProtectedRoute>
                } />
                 {/* Rota de Cadastro apenas para Admin */}
                <Route path="/membros" element={
                  <ProtectedRoute roles={['admin']}>
                    <Membros />
                  </ProtectedRoute>
                } />

              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;