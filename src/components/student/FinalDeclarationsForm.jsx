import { useState } from 'react'
import './PersonalInfoForm.css'

function FinalDeclarationsForm({ onPrev, onSubmitFinal, onChangeDatos, formData = {}, isSubmitting = false }) {
  const [errors, setErrors] = useState({})
  const [observaciones, setObservaciones] = useState(formData.observaciones_personales || '')

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    const veracidad = document.getElementById('fdf-veracidad')?.checked || false;
    const datosPersonales = document.getElementById('fdf-datos-personales')?.checked || false;

    const newErrors = {};
    if (!veracidad) {
      newErrors.veracidad = 'Debe declarar bajo juramento que la información es verídica';
    }
    if (!datosPersonales) {
      newErrors.datosPersonales = 'Debe autorizar el tratamiento de sus datos personales';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalData = {
      observaciones_personales: observaciones.trim(),
      declara_veracidad: veracidad,
      autoriza_datos: datosPersonales,
    };

    setErrors({});
    if (onChangeDatos) {
      onChangeDatos(finalData);
    }
    if (onSubmitFinal) {
      await onSubmitFinal(finalData);
    }
  };

  return (
    <form
      className="pif-form"
      id="form-final-declarations"
      style={{ gridTemplateColumns: '1fr' }}
      noValidate
      onSubmit={handleFormSubmit}
    >
      <div className="pif-card" style={{ margin: '12px 0 0' }}>
        <div className="pif-stripe" aria-hidden="true" />
        <div className="pif-content">
          <h2 className="pif-section-title">Declaraciones y Consentimientos</h2>

          <div className="pif-field">
            <label className="pif-label" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input id="fdf-veracidad" type="checkbox" defaultChecked={formData.declara_veracidad} />
                <span style={{ color: '#111827', textDecoration: 'underline', textDecorationColor: '#000000', fontWeight: 700 }}>
                  Veracidad de la información *
                </span>
              </span>
              <span style={{ fontSize: '12px', color: '#4b5563', lineHeight: 1.4, marginLeft: '26px' }}>
                Declaro bajo la gravedad de juramento que toda la información suministrada en este formulario es verídica y corresponde a la realidad de mi situación actual.
              </span>
            </label>
            {errors.veracidad && <span className="pif-error-msg" style={{ marginLeft: '26px' }}>{errors.veracidad}</span>}
          </div>

          <div className="pif-field" style={{ marginTop: '10px' }}>
            <label className="pif-label" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input id="fdf-datos-personales" type="checkbox" defaultChecked={formData.autoriza_datos} />
                <span style={{ color: '#111827', textDecoration: 'underline', textDecorationColor: '#000000', fontWeight: 700 }}>
                  Tratamiento de datos personales *
                </span>
              </span>
              <span style={{ fontSize: '12px', color: '#4b5563', lineHeight: 1.4, marginLeft: '26px' }}>
                Autorizo expresamente al Consultorio Jurídico Areandina para el tratamiento de mis datos personales sensibles y no sensibles según la Ley 1581 de 2012.
              </span>
            </label>
            {errors.datosPersonales && <span className="pif-error-msg" style={{ marginLeft: '26px' }}>{errors.datosPersonales}</span>}
          </div>

          <div className="pif-field" style={{ marginTop: '18px' }}>
            <label htmlFor="fdf-observaciones" className="pif-label">Observaciones personales</label>
            <textarea
              id="fdf-observaciones"
              className="pif-input"
              placeholder="Escriba aquí cualquier detalle adicional relevante para su caso..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="pif-actions">
        <button type="button" onClick={onPrev} id="btn-anterior-step6" className="pif-btn-prev" disabled={isSubmitting}>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M16 10H4M9 15l-5-5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Anterior
        </button>
        <button type="submit" id="btn-enviar-step6" className="pif-btn-next" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Finalizar'}
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </form>
  )
}

export default FinalDeclarationsForm
