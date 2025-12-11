import { Nav } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaCalendarAlt, 
  FaPray, 
  FaMoneyBillWave, 
  FaSignOutAlt, 
  FaUserCircle,
  FaUserPlus,
  FaQuestionCircle,
  FaListAlt
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getNavLinkClass = ({ isActive }) => {
    const baseClasses = "nav-link d-flex align-items-center gap-3 py-3 px-4 transition-all";
    const activeClasses = "bg-primary bg-opacity-10 text-primary fw-bold border-end border-4 border-primary";
    const inactiveClasses = "text-secondary hover-bg-light";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  // --- LÓGICA DE PERMISSÕES ---
  const isAdmin = user?.role === 'admin';
  const isOperador = user?.role === 'operador';
  
  // Função auxiliar para checar acesso
  const hasAccess = (permissionKey) => {
    if (!user) return false;
    if (isAdmin) return true; // Admin tem acesso total
    // Se for operador, verifica o objeto permissions (se existir)
    return user.permissions && user.permissions[permissionKey] === true;
  };

  return (
    <div className="d-flex flex-column flex-shrink-0 bg-white sidebar-container shadow-sm h-100" style={{ width: '280px' }}>
      
      {/* Cabeçalho */}
      <div className="d-flex align-items-center p-4 border-bottom bg-light bg-opacity-25">
        <img 
            src="/logo-igreja.jpg" 
            alt="Logo" 
            className="rounded-circle shadow-sm me-3"
            style={{ width: '45px', height: '45px', objectFit: 'cover' }} 
        />
        <div className="d-flex flex-column">
          <span className="fs-5 fw-bold text-primary" style={{ lineHeight: '1.1' }}>Igreja<span className="text-dark">Sys</span></span>
          <small className="text-muted" style={{ fontSize: '0.75rem' }}>Gestão Igreja </small>
        </div>
      </div>

      <Nav className="flex-column mb-auto mt-3 gap-1">
        <Nav.Item>
          <NavLink to="/" className={getNavLinkClass} end>
            <FaHome size={18} /> Início
          </NavLink>
        </Nav.Item>

        {/* Link Eventos */}
        <Nav.Item>
          <NavLink to="/eventos" className={getNavLinkClass}>
            <FaCalendarAlt size={18} /> Eventos
          </NavLink>
        </Nav.Item>

        {/* Link Oracao Publico */}
        <Nav.Item>
          <NavLink to="/oracao" className={getNavLinkClass}>
            <FaPray size={18} /> Pedir Oração
          </NavLink>
        </Nav.Item>

        {/* --- SEÇÃO ADMINISTRATIVA --- */}
        {(isAdmin || isOperador) && (
          <>
            <div className="text-uppercase text-muted fw-bold small px-4 mt-4 mb-2" style={{fontSize: '0.7rem'}}>Administração</div>
            
            {/* Lista de Orações (Admin ou Permissão Específica) */}
            {hasAccess('pedidos_oracao_admin') && (
              <Nav.Item>
                <NavLink to="/pedidos-oracao" className={getNavLinkClass}>
                  <FaListAlt size={18} /> Lista de Orações
                </NavLink>
              </Nav.Item>
            )}

            {/* Fluxo de Caixa (Admin ou Permissão Específica) */}
            {hasAccess('fluxo_caixa') && (
              <Nav.Item>
                <NavLink to="/fluxo-caixa" className={getNavLinkClass}>
                  <FaMoneyBillWave size={18} /> Fluxo de Caixa
                </NavLink>
              </Nav.Item>
            )}
          </>
        )}

        {/* Ajuda visível para internos */}
        {(isAdmin || isOperador) && (
          <Nav.Item>
            <NavLink to="/ajuda" className={getNavLinkClass}>
              <FaQuestionCircle size={18} /> Ajuda & Suporte
            </NavLink>
          </Nav.Item>
        )}

        {/* Cadastro de Usuário (Apenas Admin pode criar outros) */}
        {isAdmin && (
          /* CORREÇÃO AQUI: Adicionado <> para agrupar os itens */
          <>
            <Nav.Item>
              <NavLink to="/register" className={getNavLinkClass}>
                <FaUserPlus size={18} /> Novo Usuário
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink to="/usuarios" className={getNavLinkClass}>
                <FaUserCircle size={18} /> Usuários do Sistema
              </NavLink>
            </Nav.Item>
          </>
        )}
      </Nav>

      <div className="border-top p-3 bg-light bg-opacity-50 mt-auto">
        {user ? (
          <div className="d-flex align-items-center justify-content-between p-2 rounded hover-bg-white transition-all">
            <div className="d-flex align-items-center gap-2 overflow-hidden">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{width: '38px', height: '38px'}}>
                 <FaUserCircle size={20} />
              </div>
              <div className="d-flex flex-column" style={{lineHeight: '1.2'}}>
                <strong className="text-dark text-truncate" style={{maxWidth: '120px', fontSize: '0.9rem'}}>
                  {user.nome || user.email.split('@')[0]}
                </strong>
                <span className="text-muted" style={{fontSize: '0.7rem'}}>
                  {user.role === 'admin' ? 'Admin' : 'Equipe'}
                </span>
              </div>
            </div>
            
            <button 
              onClick={handleLogout} 
              className="btn btn-link text-danger p-2 hover-scale" 
              title="Sair do sistema"
            >
              <FaSignOutAlt size={18} />
            </button>
          </div>
        ) : (
          <NavLink to="/login" className="btn btn-primary w-100 shadow-sm fw-bold">
            Entrar
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
