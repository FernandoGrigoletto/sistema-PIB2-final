import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar bg-white text-dark">
      <div className="sidebar-header p-3 border-bottom border-secondary">
        <h4 className="m-0">IGREJA</h4>
      </div>

      <Nav className="flex-column mt-3">
        <Nav.Item>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link py-3 ${isActive ? "active bg-primary text-white" : ""}`
            }
          >
            HOME
          </NavLink>

          <NavLink
            to="/eventos"
            className={({ isActive }) =>
              `nav-link py-3 ${isActive ? "active bg-primary text-white" : ""}`
            }
          >
            EVENTOS
          </NavLink>

          <NavLink
            to="/oracao"
            className={({ isActive }) =>
              `nav-link py-3 ${isActive ? "active bg-primary text-white" : ""}`
            }
          >
            ORAÇÃO
          </NavLink>

          <NavLink
            to="/fluxo-caixa"
            className={({ isActive }) =>
              `nav-link py-3 ${isActive ? "active bg-primary text-white" : ""}`
            }
          >
            FLUXO DE CAIXA
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              `nav-link py-3 ${isActive ? "active bg-primary text-white" : ""}`
            }
          >
            LOGIN
          </NavLink>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default Sidebar;


