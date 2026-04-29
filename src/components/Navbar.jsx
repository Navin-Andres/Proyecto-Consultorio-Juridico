import { useState } from 'react'
import './Navbar.css'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="navbar-wrapper">
      <nav className="navbar" role="navigation" aria-label="Navegación principal">

        {/* ── Brand ── */}
        <div className="navbar-brand">
          <div className="navbar-logo" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="6" fill="white" fillOpacity="0.15"/>
              <rect x="23" y="10" width="2" height="28" rx="1" fill="white"/>
              <rect x="15" y="37" width="18" height="2.5" rx="1.25" fill="white"/>
              <rect x="12" y="11" width="24" height="2.5" rx="1.25" fill="white"/>
              <line x1="14" y1="13.5" x2="10" y2="23" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="14" y1="13.5" x2="18" y2="23" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M9 23 Q14 28 19 23" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <line x1="34" y1="13.5" x2="30" y2="23" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="34" y1="13.5" x2="38" y2="23" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M29 23 Q34 28 39 23" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="navbar-title">
            <span className="navbar-title-main">Consultorio Jurídico</span>
            <span className="navbar-title-sub">ÁREA ANDINA</span>
          </div>
        </div>

        {/* ── Desktop links ── */}
        <div className="navbar-links">
          <a href="#inscripciones" id="nav-inscripciones" className="nav-link nav-link--bold">
            Consultar inscripciones
          </a>
          <a href="#reglamento" id="nav-reglamento" className="nav-link">Reglamento</a>
          <a href="#ayuda"      id="nav-ayuda"       className="nav-link">Ayuda</a>
          <a href="#login"      id="nav-login"       className="nav-btn-login">LOGIN</a>
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
        <a href="#inscripciones" className="mobile-link mobile-link--bold" onClick={() => setMenuOpen(false)}>
          Consultar inscripciones
        </a>
        <a href="#reglamento" className="mobile-link" onClick={() => setMenuOpen(false)}>Reglamento</a>
        <a href="#ayuda"      className="mobile-link" onClick={() => setMenuOpen(false)}>Ayuda</a>
        <a href="#login"      className="mobile-link-login" onClick={() => setMenuOpen(false)}>LOGIN</a>
      </div>
    </header>
  )
}

export default Navbar
