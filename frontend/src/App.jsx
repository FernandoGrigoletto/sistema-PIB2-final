import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
// ... outros imports
import RegisterPage from './pages/RegisterPage' // Importar a nova página

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Sidebar />
          <main className="content">
            <Routes>
              {/* ... rotas existentes ... */}
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<RegisterPage />} /> {/* Nova rota */}
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}
export default App;

