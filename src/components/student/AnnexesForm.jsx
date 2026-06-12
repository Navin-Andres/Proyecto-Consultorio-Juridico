import { useState } from 'react';
import './PersonalInfoForm.css'

const ANNEXES = [
  {
    id: 'identidad',
    title: 'Documento de Identidad *',
    subtitle: 'Escaneo ampliado al 150% de ambas caras.',
    dropTitle: 'Arrastra tu documento aquí',
    dropSubtitle: 'Click para cargar PDF',
    inputId: 'anx-identidad',
  },
  {
    id: 'eps',
    title: 'Certificado EPS *',
    subtitle: 'Vigencia máxima de 30 días.',
    dropTitle: 'Arrastra tu certificado EPS aquí',
    dropSubtitle: 'Click para cargar PDF',
    inputId: 'anx-eps',
  },
  {
    id: 'consentimiento',
    title: 'Consentimiento Informado *',
    subtitle: 'Debe estar firmado.',
    helperLinkText: 'Descargar Plantilla',
    helperLinkUrl: '/documents/MGA-CJ-P01-F09 CONSENTIMIENTO INFORMADO PARA ACOMPAÑAMIENTO (1) (1).docx',
    dropTitle: 'Arrastra el consentimiento aquí',
    dropSubtitle: 'Click para cargar firmado',
    inputId: 'anx-consentimiento',
  },
  {
    id: 'acta',
    title: 'Acta de Compromiso *',
    subtitle: 'Cargue el acta diligenciada.',
    helperLinkText: 'Descargar Formato',
    helperLinkUrl: '/documents/MGA-CJ-P01-F03 ACTA DE COMPROMISOS ESTUDIANTES (1).docx',
    dropTitle: 'Arrastra el acta aquí',
    dropSubtitle: 'Click para cargar firmado',
    inputId: 'anx-acta-compromiso',
  },
  {
    id: 'hoja',
    title: 'Hoja de Vida *',
    subtitle: 'Formato institucional actualizado.',
    dropTitle: 'Arrastra tu hoja de vida aquí',
    dropSubtitle: 'Seleccione PDF',
    inputId: 'anx-hoja-vida',
  },
]

function AnnexesForm({ onPrev, onNext, onChangeDatos, formData = {} }) {
  const initialFiles = formData.archivosSubidos || {};
  const [fileNames, setFileNames] = useState(() => {
    const names = {};
    if (initialFiles['anx-identidad']) names['identidad'] = initialFiles['anx-identidad'].name;
    if (initialFiles['anx-eps']) names['eps'] = initialFiles['anx-eps'].name;
    if (initialFiles['anx-consentimiento']) names['consentimiento'] = initialFiles['anx-consentimiento'].name;
    if (initialFiles['anx-acta-compromiso']) names['acta'] = initialFiles['anx-acta-compromiso'].name;
    if (initialFiles['anx-hoja-vida']) names['hoja'] = initialFiles['anx-hoja-vida'].name;
    return names;
  });
  const [archivosReales, setArchivosReales] = useState(initialFiles);
  const [errors, setErrors] = useState({});

  const handleFileChange = (e, annexId, inputId) => {
    const file = e.target.files[0];
    if (file) {
      setFileNames(prev => ({ ...prev, [annexId]: file.name }));
      setArchivosReales(prev => ({ ...prev, [inputId]: file }));
      if (errors[inputId]) {
        setErrors(prev => ({ ...prev, [inputId]: null }));
      }
    }
  };

  const handleSiguiente = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!archivosReales['anx-identidad']) newErrors['anx-identidad'] = 'El documento de identidad es obligatorio';
    if (!archivosReales['anx-eps']) newErrors['anx-eps'] = 'El certificado de EPS es obligatorio';
    if (!archivosReales['anx-consentimiento']) newErrors['anx-consentimiento'] = 'El consentimiento informado es obligatorio';
    if (!archivosReales['anx-acta-compromiso']) newErrors['anx-acta-compromiso'] = 'El acta de compromiso es obligatoria';
    if (!archivosReales['anx-hoja-vida']) newErrors['anx-hoja-vida'] = 'La hoja de vida es obligatoria';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorKey = Object.keys(newErrors)[0];
      const errElement = document.getElementById(firstErrorKey);
      if (errElement) {
        const yOffset = -120; // Offset para evitar cruce con headers
        const y = errElement.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      return;
    }

    setErrors({});

    if (onChangeDatos) {
      onChangeDatos({ archivosSubidos: archivosReales });
    }
    if (onNext) onNext();
  };

  return (
    <form
      className="pif-form"
      id="form-annexes"
      style={{ gridTemplateColumns: '1fr' }}
      noValidate
      onSubmit={handleSiguiente}
    >
      <div className="anx-guide-card" style={{ marginTop: '20px' }}>
        <div className="anx-guide-icon" aria-hidden="true">i</div>
        <div>
          <h2 className="anx-guide-title">Instrucciones de Carga</h2>
          <p className="anx-guide-subtitle">
            Archivos en formato PDF (máx 10MB). Nombrar: <strong>DOCUMENTO_APELLIDO_NOMBRE.pdf</strong>
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
                {annex.helperLinkText && (
                  <a href={annex.helperLinkUrl || '#'} download target="_blank" rel="noopener noreferrer">
                    {annex.helperLinkText}
                  </a>
                )}
              </p>
            </div>

            <div className="anx-uploader-wrap">
              <label htmlFor={annex.inputId} className={`anx-upload-dropzone ${errors[annex.inputId] ? 'is-invalid' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 16V8M12 8l-3 3M12 8l3 3M5 16.5A3.5 3.5 0 0 1 5.5 9.6a5 5 0 0 1 9.7-1.2A4 4 0 1 1 18.5 16.5H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="anx-upload-text">
                  <span className="anx-upload-title">
                    {fileNames[annex.id] 
                      ? <span style={{color: '#7FB536', fontWeight: 600}}>✓ {fileNames[annex.id]}</span> 
                      : annex.dropTitle}
                  </span>
                  <span className="anx-upload-subtitle">
                    {fileNames[annex.id] ? 'Archivo cargado. Click para cambiar.' : annex.dropSubtitle}
                  </span>
                </div>
                <span className="anx-upload-button">
                  {fileNames[annex.id] ? 'Cambiar' : 'Seleccionar'}
                </span>
              </label>
              {errors[annex.inputId] && <span className="pif-error-msg">{errors[annex.inputId]}</span>}
            </div>

            <input
              id={annex.inputId}
              type="file"
              className="lif-upload-input"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, annex.id, annex.inputId)}
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
