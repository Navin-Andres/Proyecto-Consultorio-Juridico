import { useState, useEffect } from 'react'
import './PersonalInfoForm.css'

function getPillClass(booked, total) {
  if (booked >= total) return 'red'
  if (booked >= total - 3) return 'orange'
  return 'green'
}

function formatTime12h(timeStr) {
  if (!timeStr) return '';
  const [hourStr, minStr] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  let ampm = 'AM';
  
  if (hour === 12) {
    ampm = 'M'; // Medio día
  } else if (hour > 12) {
    ampm = 'PM';
    hour = hour - 12;
  } else if (hour === 0) {
    hour = 12;
    ampm = 'AM';
  }
  
  return `${hour}:${minStr} ${ampm}`;
}

function PersonalInfoForm({ onNext, onChangeDatos, formData = {} }) {
  const [selectedSlot, setSelectedSlot] = useState(formData.turnoId || null)
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/turnos')
        const data = await response.json()
        setTurnos(data.filter(t => t.activo))
      } catch (error) {
        console.error('Error fetching turnos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTurnos()
  }, [])

  const handleSelectSlot = (turnoId, isFull) => {
    if (isFull) return
    setSelectedSlot(turnoId)
    if (errors.selectedSlot) {
      setErrors(prev => ({ ...prev, selectedSlot: null }));
    }
  }

  // Agrupar turnos por día
  const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes']
  
  const getTurnoPorJornada = (dia, jornada) => {
    return turnos.find(t => t.dia.toLowerCase() === dia && t.jornada.toLowerCase() === jornada)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const email = document.getElementById('pif-email')?.value || '';
    const nombre = document.getElementById('pif-nombre')?.value || '';
    const documento = document.getElementById('pif-documento')?.value || '';
    const fecha = document.getElementById('pif-fecha')?.value || '';
    const jornada = document.getElementById('pif-jornada')?.value || '';

    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre completo es obligatorio';
    }
    if (!documento.trim()) {
      newErrors.documento = 'El documento de identidad es obligatorio';
    }
    if (!fecha) {
      newErrors.fecha = 'La fecha de nacimiento es obligatoria';
    }
    if (!jornada) {
      newErrors.jornada = 'La jornada de asignaturas es obligatoria';
    }
    if (!selectedSlot) {
      newErrors.selectedSlot = 'Debe seleccionar un día y hora de realización de su turno';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorKey = Object.keys(newErrors)[0];
      let errElement;
      if (firstErrorKey === 'selectedSlot') {
        errElement = document.querySelector('.schedule-section');
      } else {
        errElement = document.getElementById(`pif-${firstErrorKey}`);
      }
      if (errElement) {
        const yOffset = -120; // Offset para evitar cruce con headers
        const y = errElement.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      return;
    }

    setErrors({});

    if (onChangeDatos) {
      let diaAsignado = '';
      let horarioAsignado = '';
      if (selectedSlot) {
        const turno = turnos.find(t => t.id === selectedSlot);
        if (turno) {
          diaAsignado = turno.dia.charAt(0).toUpperCase() + turno.dia.slice(1);
          horarioAsignado = `${turno.jornada.charAt(0).toUpperCase() + turno.jornada.slice(1)} (${formatTime12h(turno.hora_inicio)} - ${formatTime12h(turno.hora_fin)})`;
        }
      }

      onChangeDatos({
        nombres: nombre,
        email: email,
        documento: documento,
        fechaNacimiento: fecha,
        jornada_asignaturas: jornada,
        turnoId: selectedSlot,
        diaAsignado,
        horarioAsignado
      });
    }
    if (onNext) onNext();
  };

  return (
    <form id="form-personal-info" noValidate onSubmit={handleFormSubmit}>

      {/* ── TARJETA 1: Información Personal ── */}
      <div className="pif-card" style={{ marginBottom: '24px' }}>
        <div className="pif-stripe" aria-hidden="true" />
        <div className="pif-content">
          <h2 className="pif-section-title">
            Información Personal & Disponibilidad 
          </h2>

          <div className="pif-form">
            <div className="pif-field">
              <label htmlFor="pif-email" className="pif-label">Correo Electrónico *</label>
              <input 
                id="pif-email" 
                type="email" 
                className={`pif-input ${errors.email ? 'is-invalid' : ''}`} 
                placeholder="ejemplo@correo.com" 
                autoComplete="email" 
                defaultValue={formData.email || ''}
              />
              {errors.email && <span className="pif-error-msg">{errors.email}</span>}
            </div>

            <div className="pif-field">
              <label htmlFor="pif-nombre" className="pif-label">Nombre Completo *</label>
              <input 
                id="pif-nombre" 
                type="text" 
                className={`pif-input ${errors.nombre ? 'is-invalid' : ''}`} 
                placeholder="Como aparece en su documento" 
                autoComplete="name" 
                defaultValue={formData.nombres || ''}
              />
              {errors.nombre && <span className="pif-error-msg">{errors.nombre}</span>}
            </div>

            <div className="pif-field">
              <label htmlFor="pif-documento" className="pif-label">Documento de Identidad *</label>
              <input 
                id="pif-documento" 
                type="text" 
                className={`pif-input ${errors.documento ? 'is-invalid' : ''}`} 
                placeholder="CC / TI / CE" 
                defaultValue={formData.documento || ''}
              />
              {errors.documento && <span className="pif-error-msg">{errors.documento}</span>}
            </div>

            <div className="pif-field">
              <label htmlFor="pif-fecha" className="pif-label">Fecha de Nacimiento *</label>
              <input 
                id="pif-fecha" 
                type="date" 
                className={`pif-input pif-input--date ${errors.fecha ? 'is-invalid' : ''}`} 
                defaultValue={formData.fechaNacimiento || ''}
              />
              {errors.fecha && <span className="pif-error-msg">{errors.fecha}</span>}
            </div>

            <div className="pif-field">
              <label htmlFor="pif-jornada" className="pif-label">Jornada Actual de Asignaturas Teóricas *</label>
              <div className={`pif-select-wrapper ${errors.jornada ? 'is-invalid' : ''}`}>
                <select id="pif-jornada" className="pif-input pif-select" defaultValue={formData.jornada_asignaturas || ''}>
                  <option value="" disabled>Seleccione su jornada</option>
                  <option value="diurna">Diurna</option>
                  <option value="nocturna">Nocturna</option>
                </select>
                <span className="pif-select-arrow" aria-hidden="true">
                  <svg viewBox="0 0 12 8" fill="none">
                    <path d="M1 1l5 5 5-5" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
              {errors.jornada && <span className="pif-error-msg">{errors.jornada}</span>}
            </div>

            <div className="pif-field pif-field--empty" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* ── TARJETA 2: Disponibilidad de Turno ── */}
      <div className="pif-card">
        <div className="pif-stripe" aria-hidden="true" />
        <div className="pif-content">

          <div className="schedule-section">
            <h2 className="schedule-header">Seleccione día y hora de realización de su turno *</h2>
            <p className="schedule-subtitle">Seleccione un día y horario que no presente cruce con las asignaturas matriculadas.</p>
            {errors.selectedSlot && <span className="pif-error-msg" style={{ marginBottom: '16px' }}>{errors.selectedSlot}</span>}

            <div className={`schedule-section-container ${errors.selectedSlot ? 'is-invalid' : ''}`} style={errors.selectedSlot ? { padding: '12px', borderRadius: '8px', border: '1.5px solid #dc2626', backgroundColor: '#fef2f2' } : {}}>
              {loading ? (
                <p>Cargando turnos disponibles...</p>
              ) : (
                <div className="schedule-grid">
                  {diasSemana.map((dia) => {
                    const turnoManana = getTurnoPorJornada(dia, 'mañana')
                    const turnoTarde = getTurnoPorJornada(dia, 'tarde')
                    
                    if (!turnoManana && !turnoTarde) return null;

                    return (
                      <div key={dia} className="schedule-day-col">
                        <div className="schedule-day-header">{dia.toUpperCase()}</div>

                        {/* Turno Mañana */}
                        {turnoManana && (
                          <div
                            className={`schedule-card ${turnoManana.cupos_ocupados >= turnoManana.cupos_totales ? 'is-full' : ''} ${selectedSlot === turnoManana.id ? 'is-selected' : ''}`}
                            onClick={() => handleSelectSlot(turnoManana.id, turnoManana.cupos_ocupados >= turnoManana.cupos_totales)}
                          >
                            <span className="schedule-shift-name">MAÑANA</span>
                            <span className="schedule-shift-time">{formatTime12h(turnoManana.hora_inicio)} - {formatTime12h(turnoManana.hora_fin)}</span>
                            <span className={`schedule-pill ${getPillClass(turnoManana.cupos_ocupados, turnoManana.cupos_totales)}`}>
                              {turnoManana.cupos_ocupados} / {turnoManana.cupos_totales} Cupos
                            </span>
                          </div>
                        )}

                        {/* Turno Tarde */}
                        {turnoTarde && (
                          <div
                            className={`schedule-card ${turnoTarde.cupos_ocupados >= turnoTarde.cupos_totales ? 'is-full' : ''} ${selectedSlot === turnoTarde.id ? 'is-selected' : ''}`}
                            onClick={() => handleSelectSlot(turnoTarde.id, turnoTarde.cupos_ocupados >= turnoTarde.cupos_totales)}
                          >
                            <span className="schedule-shift-name">TARDE</span>
                            <span className="schedule-shift-time">{formatTime12h(turnoTarde.hora_inicio)} - {formatTime12h(turnoTarde.hora_fin)}</span>
                            <span className={`schedule-pill ${getPillClass(turnoTarde.cupos_ocupados, turnoTarde.cupos_totales)}`}>
                              {turnoTarde.cupos_ocupados} / {turnoTarde.cupos_totales} Cupos
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Botones de acción ── */}
          <div className="pif-actions" style={{ marginTop: '32px' }}>
            <button type="submit" id="btn-siguiente-step1" className="pif-btn-next">
              Siguiente
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

        </div>
      </div>

    </form>
  )
}

export default PersonalInfoForm
