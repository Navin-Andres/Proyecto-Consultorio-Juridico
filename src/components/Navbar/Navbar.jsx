import { useState } from 'react'
import logoAreandina from '../../assets/logo_area andina.png'
import './Navbar.css'

function Navbar({ showInscripciones = false }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="navbar-wrapper">
      <nav className="navbar" role="navigation" aria-label="Navegación principal">

        {/* ── Brand ── */}
        <a href="/" className="navbar-brand" aria-label="Inicio — Consultorio Jurídico Areandina">
          <div className="navbar-logo">
            <img
              src={logoAreandina}
              alt="Logo Fundación Universitaria del Área Andina"
              className="navbar-logo-img"
            />
          </div>
          <div className="navbar-title">
            <span className="navbar-title-main">
              Consultorio Jurídico y Centro de Conciliación
            </span>
            <span className="navbar-title-quote">“Julio Eastman Díaz”</span>
            <span className="navbar-title-sub">Areandina Seccional Pereira</span>
          </div>
        </a>

        {/* ── Desktop links ── */}
        <div className="navbar-links">
          <a href="/" id="nav-inicio" className="nav-link">Inicio</a>
          <a href="/consultar-inscripciones" id="nav-inscripciones" className="nav-link nav-link--bold">
            Consultar inscripciones
          </a>
          <a href="/reglamento" id="nav-reglamento" className="nav-link">Reglamento</a>
          <a href="/ayuda" id="nav-ayuda" className="nav-link">Ayuda</a>
        </div>

        {/* ── Hamburger (mobile only) ── */}
        <button
          id="nav-hamburger"
          className={`hamburger${menuOpen ? ' is-open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* ── Rainbow stripe ── */}
      <div className="navbar-rainbow" aria-hidden="true" />

      {/* ── Mobile drawer ── */}
      <div className={`mobile-menu${menuOpen ? ' is-open' : ''}`} id="mobile-menu">
        <a href="/" className="mobile-link" onClick={() => setMenuOpen(false)}>Inicio</a>
        <a href="/consultar-inscripciones" className="mobile-link mobile-link--bold" onClick={() => setMenuOpen(false)}>
          Consultar inscripciones
        </a>
        <a href="/reglamento" className="mobile-link" onClick={() => setMenuOpen(false)}>Reglamento</a>
        <a href="/ayuda" className="mobile-link" onClick={() => setMenuOpen(false)}>Ayuda</a>
      </div>
    </header>
  )
}

export default Navbar
