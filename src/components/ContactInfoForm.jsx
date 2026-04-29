import './PersonalInfoForm.css' // Reusing the same CSS for identical design

function ContactInfoForm({ onPrev, onNext }) {
  return (
    <div className="pif-card">
      {/* ── Franja verde izquierda ── */}
      <div className="pif-stripe" aria-hidden="true" />

      <div className="pif-content">

        {/* ── Título con barra verde ── */}
        <h2 className="pif-section-title">
          Datos de contactos y disponibilidad
        </h2>

        {/* ── Formulario en grid ── */}
        <form className="pif-form" id="form-contact-info" noValidate onSubmit={(e) => { e.preventDefault(); if (onNext) onNext(); }}>

          {/* Fila 1 */}
          <div className="pif-field">
            <label htmlFor="cif-departamento" className="pif-label">Departamento</label>
            <input
              id="cif-departamento"
              type="text"
              className="pif-input"
              placeholder="Ej. Cundinamarca"
            />
          </div>

          <div className="pif-field">
            <label htmlFor="cif-municipio" className="pif-label">Municipio</label>
            <input
              id="cif-municipio"
              type="text"
              className="pif-input"
              placeholder="Ej. Bogotá D.C."
            />
          </div>

          {/* Fila 2 */}
          <div className="pif-field">
            <label htmlFor="cif-direccion" className="pif-label">Dirección de residencia</label>
            <input
              id="cif-direccion"
              type="text"
              className="pif-input"
              placeholder="Ej. Calle 123 # 45-67"
            />
          </div>

          <div className="pif-field">
            <label htmlFor="cif-telefono" className="pif-label">Teléfono Celular actualizado</label>
            <input
              id="cif-telefono"
              type="tel"
              className="pif-input"
              placeholder="Ej. 300 123 4567"
            />
          </div>

          {/* Fila 3 */}
          <div className="pif-field">
            <label htmlFor="cif-correo" className="pif-label">Correo institucional</label>
            <input
              id="cif-correo"
              type="email"
              className="pif-input"
              placeholder="usuario@areandina.edu.co"
            />
          </div>

          {/* Celda vacía para mantener el grid */}
          <div className="pif-field pif-field--empty" aria-hidden="true" />

          {/* ── Botones de acción ── */}
          <div className="pif-actions">
            <button type="button" onClick={onPrev} id="btn-anterior-step2" className="pif-btn-prev">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M16 10H4M9 15l-5-5 5-5" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Anterior
            </button>
            <button type="submit" id="btn-siguiente-step2" className="pif-btn-next">
              Siguiente
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default ContactInfoForm
