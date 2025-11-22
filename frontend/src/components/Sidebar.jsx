import { Nav } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaCalendarAlt, 
  FaPray, 
  FaMoneyBillWave, 
  FaSignOutAlt, 
  FaUserCircle 
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Função auxiliar para estilizar os links (agora com tema claro)
  const getNavLinkClass = ({ isActive }) => {
    return `nav-link d-flex align-items-center gap-2 py-3 px-3 rounded-0 transition-all ${
      isActive 
        ? "active-nav-link" 
        : "text-secondary hover-nav-link"
    }`;
  };

  return (
    <div className="d-flex flex-column flex-shrink-0 bg-white sidebar-container border-end">
      {/* Cabeçalho da Sidebar */}
      <div className="d-flex align-items-center p-3 border-bottom">
        <span className="fs-4 fw-bold text-primary text-decoration-none">
          ⛪ Igreja<span className="text-dark">Sys</span>
        </span>
      </div>

      {/* Links de Navegação */}
      <Nav className="flex-column mb-auto mt-2">
        <Nav.Item>
          <NavLink to="/" className={getNavLinkClass}>
            <FaHome /> Home
          </NavLink>
        </Nav.Item>

        <Nav.Item>
          <NavLink to="/eventos" className={getNavLinkClass}>
            <FaCalendarAlt /> Eventos
          </NavLink>
        </Nav.Item>

        <Nav.Item>
          <NavLink to="/oracao" className={getNavLinkClass}>
            <FaPray /> Oração
          </NavLink>
        </Nav.Item>

        <Nav.Item>
          <NavLink to="/fluxo-caixa" className={getNavLinkClass}>
            <FaMoneyBillWave /> Fluxo de Caixa
          </NavLink>
        </Nav.Item>
      </Nav>

      {/* Rodapé da Sidebar (Usuário e Logout) */}
      <div className="border-top p-3 bg-light mt-auto">
        {user ? (
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2 overflow-hidden">
              <div className="bg-white p-1 rounded-circle border d-flex align-items-center justify-content-center" style={{width: '35px', height: '35px'}}>
                 <FaUserCircle size={24} className="text-secondary" />
              </div>
              <div className="d-flex flex-column" style={{lineHeight: '1.2'}}>
                <strong className="text-dark small text-truncate" style={{maxWidth: '120px'}}>
                  {user.email.split('@')[0]}
                </strong>
                <span className="text-muted x-small" style={{fontSize: '0.75rem'}}>
                  {user.role}
                </span>
              </div>
            </div>
            
            <button 
              onClick={handleLogout} 
              className="btn btn-sm btn-outline-danger border-0 rounded-circle p-2 d-flex align-items-center justify-content-center" 
              title="Sair"
              style={{width: '32px', height: '32px'}}
            >
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="btn btn-primary w-100 btn-sm">
            Entrar
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

