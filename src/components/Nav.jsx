import { Link } from "react-router-dom";
import "../styles/Nav.css";

export const Nav = ({ estado }) => {
  return (
    <ul className="nav-ul">
      <li className="nav-li">
        <Link to="/" className={estado === "venta" ? "nav-icon-active" : "nav-icon-link"}>
          <img src="/icons/user.png" alt="Usuario" className="nav-icon-img"/>
        </Link>
      </li>
      <li className="nav-li">
        <Link to="/totales" className={estado === "totales" ? "nav-icon-active" : "nav-icon-link"}>
          <img src="/icons/totales.png" alt="Totales" className="nav-icon-img" />
        </Link>
      </li>
      <li className="nav-li">
        <Link to="/lista" className={estado === "lista" ? "nav-icon-active" : "nav-icon-link"}>
          <img src="/icons/lista.png" alt="lista" className="nav-icon-img" />
        </Link>
      </li>
    </ul>
  );
};
