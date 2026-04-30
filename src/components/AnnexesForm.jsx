import './PersonalInfoForm.css'

const ANNEXES = [
  {
    id: 'identidad',
    title: 'Documento de Identidad',
    subtitle: 'Escaneo ampliado al 150% de ambas caras.',
    dropTitle: 'Arrastra tu documento aquí',
    dropSubtitle: 'Click para cargar PDF',
    inputId: 'anx-identidad',
  },
  {
    id: 'consentimiento',
    title: 'Consentimiento Informado',
    subtitle: 'Debe estar firmado.',
    helperLinkText: 'Descargar Plantilla',
    dropTitle: 'Arrastra el consentimiento aquí',
    dropSubtitle: 'Click para cargar firmado',
    inputId: 'anx-consentimiento',
  },
  {
    id: 'acta',
    title: 'Acta de Compromiso',
    subtitle: 'Cargue el acta diligenciada.',
    helperLinkText: 'Descargar Formato',
    dropTitle: 'Arrastra el acta aquí',
    dropSubtitle: 'Click para cargar firmado',
    inputId: 'anx-acta-compromiso',
  },
  {
    id: 'hoja',
    title: 'Hoja de Vida',
    subtitle: 'Formato institucional actualizado.',
    dropTitle: 'Arrastra tu hoja de vida aquí',
    dropSubtitle: 'Seleccione PDF',
    inputId: 'anx-hoja-vida',
  },
]

function AnnexesForm({ onPrev, onNext }) {
  return (
    <form
      className="pif-form"
      id="form-annexes"
      style={{ gridTemplateColumns: '1fr' }}
      noValidate
      onSubmit={(e) => { e.preventDefault(); if (onNext) onNext() }}
    >
      <div className="anx-guide-card">
        <div className="anx-guide-icon" aria-hidden="true">i</div>
        <div>
          <h2 className="anx-guide-title">Instrucciones de Carga</h2>
          <p className="anx-guide-subtitle">
            Archivos en formato PDF (máx 5MB). Nombrar: <strong>DOCUMENTO_APELLIDO_NOMBRE.pdf</strong>
          </p>
        </div>
      </div>

      {ANNEXES.map((annex) => (
        <div key={annex.id} className="pif-card anx-card">
          <div className="pif-stripe" aria-hidden="true" />
          <div className="pif-content anx-content">
            <div className="anx-meta">
              <h2 className="anx-title">{annex.title}</h2>
              <p className="anx-subtitle">
                {annex.subtitle}
                {annex.helperLinkText && <a href="#">{annex.helperLinkText}</a>}
              </p>
            </div>

            <div className="anx-uploader-wrap">
              <label htmlFor={annex.inputId} className="anx-upload-dropzone">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 16V8M12 8l-3 3M12 8l3 3M5 16.5A3.5 3.5 0 0 1 5.5 9.6a5 5 0 0 1 9.7-1.2A4 4 0 1 1 18.5 16.5H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="anx-upload-text">
                  <span className="anx-upload-title">{annex.dropTitle}</span>
                  <span className="anx-upload-subtitle">{annex.dropSubtitle}</span>
                </div>
                <span className="anx-upload-button">Seleccionar</span>
              </label>
            </div>

            <input
              id={annex.inputId}
              type="file"
              className="lif-upload-input"
              accept=".pdf"
            />
          </div>
        </div>
      ))}

      <div className="pif-actions">
        <button type="button" onClick={onPrev} id="btn-anterior-step5" className="pif-btn-prev">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M16 10H4M9 15l-5-5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Anterior
        </button>
        <button type="submit" id="btn-siguiente-step5" className="pif-btn-next">
          Siguiente
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </form>
  )
}

export default AnnexesForm
