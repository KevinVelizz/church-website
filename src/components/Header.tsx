import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { enlacesNavegacion, iglesia } from '../data/site'
import './Header.css'

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  function alternarMenu() {
    setMenuAbierto(!menuAbierto)
  }

  function cerrarMenu() {
    setMenuAbierto(false)
  }

  return (
    <header className="header">
      <div className="header-contenido">
        <Link to="/" className="header-marca" onClick={cerrarMenu}>
          {iglesia.nombre}
        </Link>

        <button
          type="button"
          className="header-boton-menu"
          aria-expanded={menuAbierto}
          aria-controls="menu-principal"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          onClick={alternarMenu}
        >
          <span className="header-boton-linea"></span>
          <span className="header-boton-linea"></span>
          <span className="header-boton-linea"></span>
        </button>

        <nav
          id="menu-principal"
          className={menuAbierto ? 'header-nav header-nav-abierto' : 'header-nav'}
          aria-label="Principal"
        >
          <ul className="header-lista">
            {enlacesNavegacion.map((enlace) => (
              <li key={enlace.ruta}>
                <NavLink
                  to={enlace.ruta}
                  className="header-enlace"
                  onClick={cerrarMenu}
                >
                  {enlace.texto}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
