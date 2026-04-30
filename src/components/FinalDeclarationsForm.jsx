import './PersonalInfoForm.css'

function FinalDeclarationsForm({ onPrev }) {
  return (
    <form
      className="pif-form"
      id="form-final-declarations"
      style={{ gridTemplateColumns: '1fr' }}
      noValidate
      onSubmit={(e) => { e.preventDefault() }}
    >
      <div className="pif-card" style={{ margin: '12px 0 0' }}>
        <div className="pif-stripe" aria-hidden="true" />
        <div className="pif-content">
          <h2 className="pif-section-title">Declaraciones y Consentimientos</h2>

          <div className="pif-field">
            <label className="pif-label" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input id="fdf-veracidad" type="checkbox" required />
                <span style={{ color: '#111827', textDecoration: 'underline', textDecorationColor: '#000000', fontWeight: 700 }}>
                  Veracidad de la información
                </span>
              </span>
              <span style={{ fontSize: '12px', color: '#4b5563', lineHeight: 1.4, marginLeft: '26px' }}>
                Declaro bajo la gravedad de juramento que toda la información suministrada en este formulario es verídica y corresponde a la realidad de mi situación actual.
              </span>
            </label>
          </div>

          <div className="pif-field" style={{ marginTop: '10px' }}>
            <label className="pif-label" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input id="fdf-datos-personales" type="checkbox" required />
                <span style={{ color: '#111827', textDecoration: 'underline', textDecorationColor: '#000000', fontWeight: 700 }}>
                  Tratamiento de datos personales
                </span>
              </span>
              <span style={{ fontSize: '12px', color: '#4b5563', lineHeight: 1.4, marginLeft: '26px' }}>
              Autorizo expresamente al Consultorio Jurídico Areandina para el tratamiento de mis datos personales sensibles y no sensibles
              según la Ley 1581 de 2012.
              </span>
            </label>
          </div>

          <div className="pif-field" style={{ marginTop: '18px' }}>
            <label htmlFor="fdf-observaciones" className="pif-label">Observaciones personales</label>
            <textarea
              id="fdf-observaciones"
              className="pif-input"
              placeholder="Escriba aquí cualquier detalle adicional relevante para su caso..."
            />
          </div>
        </div>
      </div>

      <div className="pif-actions">
        <button type="button" onClick={onPrev} id="btn-anterior-step6" className="pif-btn-prev">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M16 10H4M9 15l-5-5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Anterior
        </button>
        <button type="submit" id="btn-enviar-step6" className="pif-btn-next">
          Finalizar
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </form>
  )
}

export default FinalDeclarationsForm
