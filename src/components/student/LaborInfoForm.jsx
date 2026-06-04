import { useState } from 'react';
import './PersonalInfoForm.css'

function LaborInfoForm({ onPrev, onNext, onChangeDatos, formData = {} }) {
  const initialFile = formData.archivosSubidos?.['lif-certificacion-funciones'] || null;
  const [fileName, setFileName] = useState(initialFile ? initialFile.name : '');
  const [fileObject, setFileObject] = useState(initialFile);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFileObject(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileObject(file);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const empresaValue = document.getElementById('lif-empresa')?.value || '';
    const cargoValue = document.getElementById('lif-cargo')?.value || '';
    
    const newErrors = {};
    if (!empresaValue.trim()) {
      newErrors.empresa = 'La empresa es obligatoria (ingrese N/A si no labora)';
    }

    const works = (empresaValue.trim().toLowerCase() !== 'n/a' && empresaValue.trim() !== '');

    if (works && !cargoValue.trim()) {
      newErrors.cargo = 'El cargo es obligatorio si está laborando';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorKey = Object.keys(newErrors)[0];
      const errElement = document.getElementById(`lif-${firstErrorKey}`);
      if (errElement) {
        const yOffset = -120; // Offset para evitar cruce con headers
        const y = errElement.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      return;
    }

    setErrors({});

    const updatedArchivosSubidos = { ...(formData.archivosSubidos || {}) };
    if (fileObject) {
      updatedArchivosSubidos['lif-certificacion-funciones'] = fileObject;
    } else {
      delete updatedArchivosSubidos['lif-certificacion-funciones'];
    }

    if (onChangeDatos) {
      onChangeDatos({
        trabaja: works,
        empresa: empresaValue,
        cargo: cargoValue,
        archivosSubidos: updatedArchivosSubidos
      });
    }
    if (onNext) onNext();
  };

  return (
    <form
      className="pif-form"
      id="form-labor-info"
      style={{ gridTemplateColumns: '1fr' }}
      noValidate
      onSubmit={handleFormSubmit}
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
              className={`pif-input ${errors.empresa ? 'is-invalid' : ''}`}
              placeholder="Ingrese la empresa donde labora o N/A"
              defaultValue={formData.empresa || ''}
            />
            {errors.empresa && <span className="pif-error-msg">{errors.empresa}</span>}
          </div>

          <div className="pif-field" style={{ marginTop: '20px' }}>
            <label htmlFor="lif-cargo" className="pif-label">
              Cargo (Obligatorio si labora)
            </label>
            <input
              id="lif-cargo"
              type="text"
              className={`pif-input ${errors.cargo ? 'is-invalid' : ''}`}
              placeholder="Cargo que desempeña en la empresa "
              defaultValue={formData.cargo || ''}
            />
            {errors.cargo && <span className="pif-error-msg">{errors.cargo}</span>}
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

            <p style={{ margin: '6px 0 10px', color: '#4b5563', fontSize: '14px' }}>
              Si la empresa o la entidad donde labora desempeña funciones jurídicas, suba la respectiva certificación.
            </p>
            <label 
              htmlFor="lif-certificacion-funciones" 
              className={`lif-upload-dropzone${isDragging ? ' is-dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={isDragging ? { borderColor: '#7FB536', backgroundColor: '#f4f9ec' } : {}}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 16V8M12 8l-3 3M12 8l3 3M5 16.5A3.5 3.5 0 0 1 5.5 9.6a5 5 0 0 1 9.7-1.2A4 4 0 1 1 18.5 16.5H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="lif-upload-title">
                {fileName ? <span style={{color: '#7FB536', fontWeight: 600}}>✓ {fileName}</span> : 'Arrastra tu archivo aquí'}
              </span>
              <span className="lif-upload-subtitle">
                {fileName ? 'Archivo cargado. Click para cambiar.' : 'Sube 1 archivo compatible. Tamaño: 10MB'}
              </span>
            </label>
            <input
              id="lif-certificacion-funciones"
              type="file"
              className="lif-upload-input"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
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
