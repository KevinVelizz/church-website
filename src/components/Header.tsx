import { useState } from 'react'
import { enlacesNavegacion, iglesia } from '../data/site'
import './Header.css'

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  function alternarMenu() {
    setMenuAbierto(!menuAbierto)
  }

  return (
    <header className="header">
      <div className="header-contenido">
        <a href="/" className="header-marca">
          {iglesia.nombre}
        </a>

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
                <a href={enlace.ruta} className="header-enlace">
                  {enlace.texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
