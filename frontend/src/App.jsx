import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './components/AuthProvider';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Eventos from './pages/Eventos';
import EventoDetalhe from './pages/EventoDetalhe';
import Oracao from './pages/Oracao';
import FluxoCaixa from './pages/FluxoCaixa';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Sidebar />
          <div className="content">
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
              
              {/* Eventos */}
              <Route path="/eventos" element={<Eventos />} />
              {/* CORREÇÃO AQUI: Mudado de /eventos/:id para /evento/:id (singular) */}
              <Route path="/evento/:id" element={<EventoDetalhe />} />
              
              {/* Rotas Protegidas */}
              <Route path="/oracoes" element={
                <ProtectedRoute>
                  <Oracao />
                </ProtectedRoute>
              } />

              {/* Rota de Admin */}
              <Route path="/fluxo-caixa" element={
                <ProtectedRoute roles={['admin', 'operador']}>
                  <FluxoCaixa />
                </ProtectedRoute>
              } />

            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
