import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './components/AuthProvider';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer'; // <--- 1. Importar o Footer

import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Eventos from './pages/Eventos';
import EventoDetalhe from './pages/EventoDetalhe';
import Oracao from './pages/Oracao';
import FluxoCaixa from './pages/FluxoCaixa';

import './App.css';

// ... importações (manter iguais)

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
                {/* REMOVIDO DAQUI: Route path="/register" ... */}
                <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
                
                {/* Eventos */}
                <Route path="/eventos" element={<Eventos />} />
                <Route path="/evento/:id" element={<EventoDetalhe />} />
                
                {/* Rota de Oração */}
                <Route path="/oracao" element={<Oracao />} />

                {/* Rotas de Admin */}
                <Route path="/fluxo-caixa" element={
                  <ProtectedRoute roles={['admin', 'operador']}>
                    <FluxoCaixa />
                  </ProtectedRoute>
                } />

                {/* ALTERAÇÃO AQUI: Adicionado Cadastro de Usuários apenas para Admin */}
                <Route path="/register" element={
                  <ProtectedRoute roles={['admin']}>
                    <RegisterPage />
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
