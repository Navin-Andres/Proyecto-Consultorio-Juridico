import { useState } from 'react'
import './PersonalInfoForm.css'

const SCHEDULE_DATA = [
  { day: 'LUNES', morning: { time: '8:00 - 12:00', booked: 0, total: 11 }, afternoon: { time: '2:00 - 6:00', booked: 0, total: 11 } },
  { day: 'MARTES', morning: { time: '8:00 - 12:00', booked: 2, total: 11 }, afternoon: { time: '2:00 - 6:00', booked: 9, total: 11 } },
  { day: 'MIÉRCOLES', morning: { time: '8:00 - 12:00', booked: 1, total: 11 }, afternoon: { time: '2:00 - 6:00', booked: 11, total: 11 } },
  { day: 'JUEVES', morning: { time: '8:00 - 12:00', booked: 0, total: 11 }, afternoon: { time: '2:00 - 6:00', booked: 3, total: 11 } },
  { day: 'VIERNES', morning: { time: '8:00 - 12:00', booked: 0, total: 11 }, afternoon: { time: '2:00 - 6:00', booked: 0, total: 11 } },
]

function getPillClass(booked, total) {
  if (booked === total) return 'red'
  if (booked >= total - 3) return 'orange'
  return 'green'
}

function PersonalInfoForm({ onNext }) {
  const [selectedSlot, setSelectedSlot] = useState(null)

  const handleSelectSlot = (day, shiftName, isFull) => {
    if (isFull) return
    setSelectedSlot(`${day}-${shiftName}`)
  }

  return (
    <form id="form-personal-info" noValidate onSubmit={(e) => { e.preventDefault(); if (onNext) onNext(); }}>

      {/* ── TARJETA 1: Información Personal ── */}
      <div className="pif-card" style={{ marginBottom: '24px' }}>
        <div className="pif-stripe" aria-hidden="true" />
        <div className="pif-content">
          <h2 className="pif-section-title">
            Información Personal & Disponibilidad 
          </h2>

          <div className="pif-form">
            <div className="pif-field">
              <label htmlFor="pif-email" className="pif-label">Correo Electrónico</label>
              <input id="pif-email" type="email" className="pif-input" placeholder="ejemplo@correo.com" autoComplete="email" />
            </div>

            <div className="pif-field">
              <label htmlFor="pif-nombre" className="pif-label">Nombre Completo</label>
              <input id="pif-nombre" type="text" className="pif-input" placeholder="Como aparece en su documento" autoComplete="name" />
            </div>

            <div className="pif-field">
              <label htmlFor="pif-documento" className="pif-label">Documento de Identidad</label>
              <input id="pif-documento" type="text" className="pif-input" placeholder="CC / TI / CE" />
            </div>

            <div className="pif-field">
              <label htmlFor="pif-fecha" className="pif-label">Fecha de Nacimiento</label>
              <input id="pif-fecha" type="date" className="pif-input pif-input--date" />
            </div>

            <div className="pif-field">
              <label htmlFor="pif-jornada" className="pif-label">Jornada Actual de Asignaturas Teóricas</label>
              <div className="pif-select-wrapper">
                <select id="pif-jornada" className="pif-input pif-select" defaultValue="">
                  <option value="" disabled>Seleccione su jornada</option>
                  <option value="manana">Mañana</option>
                  <option value="tarde">Tarde</option>
                  <option value="noche">Noche</option>
                  <option value="sabatina">Sabatina</option>
                  <option value="virtual">Virtual</option>
                </select>
                <span className="pif-select-arrow" aria-hidden="true">
                  <svg viewBox="0 0 12 8" fill="none">
                    <path d="M1 1l5 5 5-5" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
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
            <h2 className="schedule-header">Seleccione día y hora de realización de su turno</h2>
            <p className="schedule-subtitle">Seleccione un día y horario que no presente cruce con las asignaturas matriculadas.</p>

            <div className="schedule-grid">
              {SCHEDULE_DATA.map((dayData) => (
                <div key={dayData.day} className="schedule-day-col">
                  <div className="schedule-day-header">{dayData.day}</div>

                  {/* Turno Mañana */}
                  <div
                    className={`schedule-card ${dayData.morning.booked === dayData.morning.total ? 'is-full' : ''} ${selectedSlot === `${dayData.day}-MAÑANA` ? 'is-selected' : ''}`}
                    onClick={() => handleSelectSlot(dayData.day, 'MAÑANA', dayData.morning.booked === dayData.morning.total)}
                  >
                    <span className="schedule-shift-name">MAÑANA</span>
                    <span className="schedule-shift-time">{dayData.morning.time}</span>
                    <span className={`schedule-pill ${getPillClass(dayData.morning.booked, dayData.morning.total)}`}>
                      {dayData.morning.booked} / {dayData.morning.total} Cupos
                    </span>
                  </div>

                  {/* Turno Tarde */}
                  <div
                    className={`schedule-card ${dayData.afternoon.booked === dayData.afternoon.total ? 'is-full' : ''} ${selectedSlot === `${dayData.day}-TARDE` ? 'is-selected' : ''}`}
                    onClick={() => handleSelectSlot(dayData.day, 'TARDE', dayData.afternoon.booked === dayData.afternoon.total)}
                  >
                    <span className="schedule-shift-name">TARDE</span>
                    <span className="schedule-shift-time">{dayData.afternoon.time}</span>
                    <span className={`schedule-pill ${getPillClass(dayData.afternoon.booked, dayData.afternoon.total)}`}>
                      {dayData.afternoon.booked} / {dayData.afternoon.total} Cupos
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Botones de acción ── */}
          <div className="pif-actions" style={{ marginTop: '32px' }}>
            <button type="submit" id="btn-siguiente-step1" className="pif-btn-next" disabled={!selectedSlot}>
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
