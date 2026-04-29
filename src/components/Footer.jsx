import './Footer.css'

function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-brand-highlight">Areandina</span> Sede Bogotá - Consultorio Jurídico
        </div>
        <div className="footer-links">
          <a href="#politica" className="footer-link">Política y privacidad</a>
          <a href="#terminos" className="footer-link">Términos y condiciones</a>
          <a href="#contacto" className="footer-link">Contacto institucional</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
