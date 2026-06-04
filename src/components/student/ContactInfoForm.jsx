import { useState } from 'react'
import './PersonalInfoForm.css' // Reusing the same CSS for identical design

function ContactInfoForm({ onPrev, onNext, onChangeDatos, formData = {} }) {
  const [errors, setErrors] = useState({})

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const depto = document.getElementById('cif-departamento')?.value || '';
    const muni = document.getElementById('cif-municipio')?.value || '';
    const dir = document.getElementById('cif-direccion')?.value || '';
    const tel = document.getElementById('cif-telefono')?.value || '';
    const emailInst = document.getElementById('cif-correo')?.value || '';
    const epsVal = document.getElementById('cif-eps')?.value || '';

    const newErrors = {};
    if (!depto.trim()) newErrors.departamento = 'El departamento es obligatorio';
    if (!muni.trim()) newErrors.municipio = 'El municipio es obligatorio';
    if (!dir.trim()) newErrors.direccion = 'La dirección de residencia es obligatoria';
    
    if (!tel.trim()) {
      newErrors.telefono = 'El teléfono celular es obligatorio';
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(tel.trim().replace(/[\s-]/g, ''))) {
      newErrors.telefono = 'El número de teléfono no es válido';
    }

    if (!emailInst.trim()) {
      newErrors.correoInstitucional = 'El correo institucional es obligatorio';
    } else if (!emailInst.trim().toLowerCase().endsWith('@areandina.edu.co')) {
      newErrors.correoInstitucional = 'Debe ser un correo @areandina.edu.co';
    }
    
    if (!epsVal.trim()) newErrors.eps = 'La EPS es obligatoria';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorKey = Object.keys(newErrors)[0];
      const htmlId = firstErrorKey === 'correoInstitucional' ? 'cif-correo' : `cif-${firstErrorKey}`;
      const errElement = document.getElementById(htmlId);
      if (errElement) {
        const yOffset = -120; // Offset para evitar cruce con headers
        const y = errElement.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      return;
    }

    setErrors({});

    if (onChangeDatos) {
      onChangeDatos({
        departamento: depto,
        municipio: muni,
        direccion: dir,
        telefono: tel,
        correoInstitucional: emailInst,
        eps: epsVal,
      });
    }
    if (onNext) onNext();
  };

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
        <form className="pif-form" id="form-contact-info" noValidate onSubmit={handleFormSubmit}>

          {/* Fila 1 */}
          <div className="pif-field">
            <label htmlFor="cif-departamento" className="pif-label">Departamento *</label>
            <input
              id="cif-departamento"
              type="text"
              className={`pif-input ${errors.departamento ? 'is-invalid' : ''}`}
              placeholder="Ej. Cundinamarca"
              defaultValue={formData.departamento || ''}
            />
            {errors.departamento && <span className="pif-error-msg">{errors.departamento}</span>}
          </div>

          <div className="pif-field">
            <label htmlFor="cif-municipio" className="pif-label">Municipio *</label>
            <input
              id="cif-municipio"
              type="text"
              className={`pif-input ${errors.municipio ? 'is-invalid' : ''}`}
              placeholder="Ej. Bogotá D.C."
              defaultValue={formData.municipio || ''}
            />
            {errors.municipio && <span className="pif-error-msg">{errors.municipio}</span>}
          </div>

          {/* Fila 2 */}
          <div className="pif-field">
            <label htmlFor="cif-direccion" className="pif-label">Dirección de residencia *</label>
            <input
              id="cif-direccion"
              type="text"
              className={`pif-input ${errors.direccion ? 'is-invalid' : ''}`}
              placeholder="Ej. Calle 123 # 45-67"
              defaultValue={formData.direccion || ''}
            />
            {errors.direccion && <span className="pif-error-msg">{errors.direccion}</span>}
          </div>

          <div className="pif-field">
            <label htmlFor="cif-telefono" className="pif-label">Teléfono Celular actualizado *</label>
            <input
              id="cif-telefono"
              type="tel"
              className={`pif-input ${errors.telefono ? 'is-invalid' : ''}`}
              placeholder="Ej. 300 123 4567"
              defaultValue={formData.telefono || ''}
            />
            {errors.telefono && <span className="pif-error-msg">{errors.telefono}</span>}
          </div>

          {/* Fila 3 */}
          <div className="pif-field">
            <label htmlFor="cif-correo" className="pif-label">Correo institucional *</label>
            <input
              id="cif-correo"
              type="email"
              className={`pif-input ${errors.correoInstitucional ? 'is-invalid' : ''}`}
              placeholder="usuario@areandina.edu.co"
              defaultValue={formData.correoInstitucional || ''}
            />
            {errors.correoInstitucional && <span className="pif-error-msg">{errors.correoInstitucional}</span>}
          </div>

          <div className="pif-field">
            <label htmlFor="cif-eps" className="pif-label">EPS actualizada *</label>
            <input
              id="cif-eps"
              type="text"
              className={`pif-input ${errors.eps ? 'is-invalid' : ''}`}
              placeholder="Ej. Sanitas, Sura, Compensar"
              defaultValue={formData.eps || ''}
            />
            {errors.eps && <span className="pif-error-msg">{errors.eps}</span>}
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '4px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', alignItems: 'stretch', overflow: 'hidden' }}>
            <div style={{ width: '6px', background: 'linear-gradient(180deg, #7FB536 0%, #6a9a2c 100%)' }} aria-hidden="true" />
            <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '999px', background: '#7FB536', color: '#ffffff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }} aria-hidden="true">
                i
              </div>
              <p style={{ margin: 0, color: '#4b5563', fontSize: '13px', lineHeight: 1.5 }}>
                Asegúrese de que sus datos de contacto sean correctos. Utilizaremos esta información para enviarle
                notificaciones sobre el estado de su caso jurídico.
              </p>
            </div>
          </div>

          {/* ── Botones de acción ── */}
          <div className="pif-actions">
            <button type="button" onClick={onPrev} id="btn-anterior-step2" className="pif-btn-prev">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M16 10H4M9 15l-5-5 5-5" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Anterior
            </button>
            <button type="submit" id="btn-siguiente-step2" className="pif-btn-next">
              Siguiente
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default ContactInfoForm
