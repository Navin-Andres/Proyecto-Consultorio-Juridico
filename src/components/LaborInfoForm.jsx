import './PersonalInfoForm.css'

function LaborInfoForm({ onPrev, onNext }) {
  return (
    <form
      className="pif-form"
      id="form-labor-info"
      style={{ gridTemplateColumns: '1fr' }}
      noValidate
      onSubmit={(e) => { e.preventDefault(); if (onNext) onNext(); }}
    >
      <div className="pif-card" style={{ margin: '12px 0 0' }}>
        <div className="pif-stripe" aria-hidden="true" />
        <div className="pif-content">
          <h2 className="pif-section-title">
            Detalles laborales
          </h2>
          <div className="pif-field">
            <label htmlFor="lif-empresa" className="pif-label">
              Empresa donde labora (En caso de no tener vinculacion vigente consignar N/A) *
            </label>
            <input
              id="lif-empresa"
              type="text"
              className="pif-input"
              placeholder="Ingrese la empresa donde labora o N/A"
              required
            />
          </div>

          <div className="pif-field">
            <label htmlFor="lif-cargo" className="pif-label">
              Cargo
            </label>
            <input
              id="lif-cargo"
              type="text"
              className="pif-input"
              placeholder="Ingrese su cargo actual"
            />
          </div>
        </div>
      </div>

      <div className="pif-card" style={{ margin: '12px 0 0' }}>
        <div className="pif-stripe" aria-hidden="true" />
        <div className="pif-content">
          <h2 className="pif-section-title">
            Certificación de funciones jurídicas (Ley 2113 de 2021)
          </h2>
          <div className="pif-field">
            <label htmlFor="lif-certificacion-funciones" className="pif-label">
              Documento de certificación
            </label>
            <p style={{ margin: '6px 0 10px', color: '#4b5563', fontSize: '14px' }}>
              Si la empresa o la entidad donde labora desempeña funciones jurídicas, suba la respectiva certificación.
            </p>
            <label htmlFor="lif-certificacion-funciones" className="lif-upload-dropzone">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 16V8M12 8l-3 3M12 8l3 3M5 16.5A3.5 3.5 0 0 1 5.5 9.6a5 5 0 0 1 9.7-1.2A4 4 0 1 1 18.5 16.5H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="lif-upload-title">Arrastra tu archivo aquí</span>
              <span className="lif-upload-subtitle">Sube 1 archivo compatible. Tamaño: 5MB</span>
            </label>
            <input
              id="lif-certificacion-funciones"
              type="file"
              className="lif-upload-input"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        </div>
      </div>

      <div className="pif-actions">
        <button type="button" onClick={onPrev} id="btn-anterior-step4" className="pif-btn-prev">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M16 10H4M9 15l-5-5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Anterior
        </button>
        <button type="submit" id="btn-siguiente-step4" className="pif-btn-next">
          Siguiente
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </form>
  )
}

export default LaborInfoForm
