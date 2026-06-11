import React, { useState } from 'react';
import './ConsultaEstudiantes.css';
import { API_URL } from '../../utils/apiConfig';

export default function ConsultaEstudiantes() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [student, setStudent] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setStudent(null);

    try {
      const response = await fetch(`${API_URL}/api/estudiantes/consulta?query=${encodeURIComponent(query.trim())}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No se encontró ningún estudiante registrado con los datos proporcionados.');
        } else {
          throw new Error('Ocurrió un error al buscar la inscripción. Intente de nuevo.');
        }
      }
      const data = await response.json();
      setStudent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'rechazado') return 'badge-rechazado';
    return 'badge-registrado';
  };

  const getStatusText = (status) => {
    if (status === 'rechazado') return 'Inscripción rechazada';
    return 'Inscripción registrada';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  let diaAsignado = "Sin asignar";
  let horario = "Sin asignar";
  if (student && student.turno && student.turno !== "Sin asignar") {
    const match = student.turno.match(/^([^-]+)\s*-\s*.*?\(([^)]+)\)$/);
    if (match) {
      diaAsignado = match[1].trim();
      horario = match[2].trim();
    } else {
      diaAsignado = student.turno;
    }
  }

  return (
    <div className="consulta-wrapper">
      {/* Tarjeta de Consulta */}
      <div className="consulta-card">
        <div className="consulta-header">
          <h2>Consulta tu Inscripción</h2>
          <p>Ingresa tu documento o correo institucional para verificar los datos de tu inscripción.</p>
        </div>

        <form onSubmit={handleSearch} className="consulta-form">
          <div className="input-group-label">
            DOCUMENTO DE IDENTIDAD O CORREO INSTITUCIONAL
          </div>
          <div className="consulta-input-wrapper">
            <div className="input-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              className="consulta-input"
              placeholder="Ej: 1023456789 o estudiante@areandina.edu.co"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="btn-buscar-inscripcion" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="search-btn-icon">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Buscar Inscripción
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="consulta-error-msg animate-fade-in">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="error-icon-svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Resultados de la Consulta */}
      {student && (
        <div className="resultado-consulta-container animate-slide-up">
          <div className="resultado-card-main">
            <div className="resultado-header-row">
              <div className="resultado-titles">
                <h3>Resultado de Consulta</h3>
                <span className="updated-info">
                  Información actualizada al {formatDate(student.fechaRegistro)}
                </span>
              </div>
              <div className={`resultado-badge ${getStatusBadgeClass(student.estado)}`}>
                {getStatusText(student.estado)}
              </div>
            </div>

            <div className="resultado-grid-info">
              <div className="info-box">
                <span className="info-box-label">NOMBRE COMPLETO</span>
                <span className="info-box-value">{student.nombre}</span>
              </div>
              <div className="info-box">
                <span className="info-box-label">DOCUMENTO</span>
                <span className="info-box-value">{student.documento}</span>
              </div>
              <div className="info-box">
                <span className="info-box-label">DÍA ASIGNADO</span>
                <span className="info-box-value">{diaAsignado}</span>
              </div>
              <div className="info-box">
                <span className="info-box-label">HORARIO</span>
                <span className="info-box-value horario-value">
                  {horario !== 'Sin asignar' && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                  )}
                  {horario}
                </span>
              </div>
              <div className="info-box full-width">
                <span className="info-box-label">CONSULTORIO</span>
                <span className="info-box-value consultorio-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#416900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                    <path d="M9 22v-4h6v4"></path>
                    <path d="M8 6h.01"></path>
                    <path d="M16 6h.01"></path>
                    <path d="M12 6h.01"></path>
                    <path d="M12 10h.01"></path>
                    <path d="M12 14h.01"></path>
                    <path d="M16 10h.01"></path>
                    <path d="M16 14h.01"></path>
                    <path d="M8 10h.01"></path>
                    <path d="M8 14h.01"></path>
                  </svg>
                  Consultorio {student.consultorio}
                </span>
              </div>
            </div>
          </div>

          <div className="resultado-card-secondary">
            <div className="card-secondary-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Próximos pasos y contacto
            </div>
            <p className="card-secondary-text">
              Para cualquier duda o seguimiento adicional a su proceso, por favor comuníquese con nuestra oficina de atención:
            </p>

            <div className="contact-info-grid">
              <div className="contact-info-box">
                <div className="contact-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#416900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="contact-text-content">
                  <span className="contact-label">TELÉFONO</span>
                  <span className="contact-value">310 890 69 11</span>
                </div>
              </div>
              <div className="contact-info-box">
                <div className="contact-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#416900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="contact-text-content">
                  <span className="contact-label">CORREO ELECTRÓNICO</span>
                  <span className="contact-value">consultareandina@areandina.edu.co</span>
                </div>
              </div>
            </div>

            {student.observaciones && student.estado === 'rechazado' && (
              <div className="observaciones-box">
                <strong>Motivo del rechazo:</strong>
                <p>{student.observaciones}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
