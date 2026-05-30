import './PersonalInfoForm.css' // Reusing the same CSS for identical design

function AcademicInfoForm({ onPrev, onNext, onChangeDatos }) {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onChangeDatos) {
      onChangeDatos({
        semestre: document.getElementById('aif-semestre')?.value,
        consultorio_inscrito: document.getElementById('aif-consultorio-inscrito')?.value,
        area_interes: document.getElementById('aif-area')?.value,
        consultorios_realizados: document.getElementById('aif-consultorios')?.value,
        consultorio_externo: document.getElementById('aif-consultorio-externo')?.value,
        radicados: document.getElementById('aif-consecutivos')?.value,
      });
    }
    if (onNext) onNext();
  };

  return (
    <form id="form-academic-info" noValidate onSubmit={handleFormSubmit}>

      {/* ── TARJETA 1: Semestre ── */}
      <div className="pif-card" style={{ marginBottom: '24px' }}>
        {/* Franja verde izquierda */}
        <div className="pif-stripe" aria-hidden="true" />

        <div className="pif-content">
          <h2 className="pif-section-title">
            Semestre que cursa actualmente *
          </h2>

          <div className="pif-form" style={{ gridTemplateColumns: '1fr' }}>
            <div className="pif-field">
              <label htmlFor="aif-semestre" className="pif-label">
                Seleccione el semestre en el cual se encuentra matriculado.
              </label>
              <div className="pif-select-wrapper">
                <select id="aif-semestre" className="pif-input pif-select" defaultValue="">
                  <option value="" disabled>Seleccione su semestre</option>
                  <option value="1">Semestre 1</option>
                  <option value="2">Semestre 2</option>
                  <option value="3">Semestre 3</option>
                  <option value="4">Semestre 4</option>
                  <option value="5">Semestre 5</option>
                  <option value="6">Semestre 6</option>
                  <option value="7">Semestre 7</option>
                  <option value="8">Semestre 8</option>
                  <option value="9">Semestre 9</option>
                  <option value="10">Semestre 10</option>
                </select>
                <span className="pif-select-arrow" aria-hidden="true">
                  <svg viewBox="0 0 12 8" fill="none">
                    <path d="M1 1l5 5 5-5" stroke="#6b7280" strokeWidth="1.6"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TARJETA 1.5: Consultorio al cual se está inscribiendo ── */}
      <div className="pif-card" style={{ marginBottom: '24px' }}>
        <div className="pif-stripe" aria-hidden="true" />

        <div className="pif-content">
          <h2 className="pif-section-title">
            Consultorio al cual se está inscribiendo *
          </h2>

          <div className="pif-form" style={{ gridTemplateColumns: '1fr' }}>
            <div className="pif-field">
              <label htmlFor="aif-consultorio-inscrito" className="pif-label">
                Seleccione el consultorio en el que desea realizar la práctica.
              </label>
              <div className="pif-select-wrapper">
                <select id="aif-consultorio-inscrito" className="pif-input pif-select" defaultValue="">
                  <option value="" disabled>Seleccione el consultorio</option>
                  <option value="I">Consultorio I</option>
                  <option value="II">Consultorio II</option>
                  <option value="III">Consultorio III</option>
                  <option value="IV">Consultorio IV</option>
                </select>
                <span className="pif-select-arrow" aria-hidden="true">
                  <svg viewBox="0 0 12 8" fill="none">
                    <path d="M1 1l5 5 5-5" stroke="#6b7280" strokeWidth="1.6"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TARJETA 2: Área de interés ── */}
      <div className="pif-card" style={{ marginBottom: '24px' }}>
        {/* Franja verde izquierda */}
        <div className="pif-stripe" aria-hidden="true" />

        <div className="pif-content">
          <h2 className="pif-section-title">
            Área de Interés *
          </h2>

          <div className="pif-form" style={{ gridTemplateColumns: '1fr' }}>
            <div className="pif-field">
              <label htmlFor="aif-area" className="pif-label">
                Seleccione su área de mayor interés para la práctica jurídica.
              </label>
              <div className="pif-select-wrapper">
                <select id="aif-area" className="pif-input pif-select" defaultValue="">
                  <option value="" disabled>Seleccione el área de interés</option>
                  <option value="penal">Penal</option>
                  <option value="publico">Público</option>
                  <option value="privado">Privado</option>
                  <option value="familia">Derecho de Familia</option>
                  <option value="animal">Derecho Animal</option>
                  <option value="laboral">Laboral</option>
                  <option value="ddhh">Derechos Humanos y Derechos Fundamentales</option>
                  <option value="agrario">Derecho Agrario</option>
                  <option value="investigacion">Investigación</option>
                  <option value="consumo">Derecho del consumo</option>
                  <option value="conciliacion">Conciliación Penal</option>
                  <option value="asistencia">Atención a población migrante</option>
                  <option value="purpura">Purpura</option>
                  <option value="tierra">De la Tierra</option>
                </select>
                <span className="pif-select-arrow" aria-hidden="true">
                  <svg viewBox="0 0 12 8" fill="none">
                    <path d="M1 1l5 5 5-5" stroke="#6b7280" strokeWidth="1.6"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TARJETA 3: Historial de Consultorios Realizados ── */}
      <div className="pif-card" style={{ marginBottom: '24px' }}>
        <div className="pif-stripe" aria-hidden="true" />
        <div className="pif-content">
          <h2 className="pif-section-title">
            Historial de Consultorios Realizados
          </h2>
          <div className="pif-form">
            <div className="pif-field">
              <label htmlFor="aif-consultorios" className="pif-label">
                ¿Cuántos consultorios ha realizado en sede? *
              </label>
              <input
                type="number"
                id="aif-consultorios"
                className="pif-input"
                min="0"
                placeholder="Ej: 0"
                required
              />
            </div>

            <div className="pif-field">
              <label htmlFor="aif-consultorio-externo" className="pif-label">
                ¿Cuántos consultorios externos ha realizado? *
              </label>
              <input
                type="number"
                id="aif-consultorio-externo"
                className="pif-input"
                min="0"
                placeholder="Ej: 0"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── TARJETA 4: Consecutivos y procesos ── */}
      <div className="pif-card">
        <div className="pif-stripe" aria-hidden="true" />
        <div className="pif-content">
          <h2 className="pif-section-title">
            Consecutivos de consultas y procesos activos *
          </h2>
          <div className="pif-form" style={{ gridTemplateColumns: '1fr' }}>
            <div className="pif-field">
              <label htmlFor="aif-consecutivos" className="pif-label">
                Ingrese los números de radicado separados por comas o saltos de línea.
              </label>
              <textarea
                id="aif-consecutivos"
                className="pif-input"
                placeholder="Ej: 2023-00124, 2023-00567..."
              />
            </div>

            {/* ── Botones de acción ── */}
            <div className="pif-actions">
              <button type="button" onClick={onPrev} id="btn-anterior-step3" className="pif-btn-prev">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M16 10H4M9 15l-5-5 5-5" stroke="currentColor"
                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Anterior
              </button>
              <button type="submit" id="btn-siguiente-step3" className="pif-btn-next">
                Siguiente
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor"
                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

    </form>
  )
}

export default AcademicInfoForm
