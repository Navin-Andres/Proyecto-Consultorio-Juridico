import { useEffect, useState } from 'react'
import './CapacityDashboard.css'

const DATA = [
  { id: 'I', name: 'Consultorio I', booked: 12, total: 50, color: '#7FB536' }, // Verde
  { id: 'II', name: 'Consultorio II', booked: 48, total: 50, color: '#E6007E' }, // Rosa/Rojo
  { id: 'III', name: 'Consultorio III', booked: 38, total: 50, color: '#D97706' }, // Naranja
  { id: 'IV', name: 'Consultorio IV', booked: 15, total: 50, color: '#7FB536' }, // Verde
]

export default function CapacityDashboard() {
  return (
    <aside className="capacity-dashboard">
      {/* ── Título ── */}
      <h3 className="capacity-title">Ocupación por Consultorio</h3>

      {/* ── Barras de Progreso ── */}
      <div className="capacity-list">
        {DATA.map((item) => {
          const percentage = Math.round((item.booked / item.total) * 100)
          
          return (
            <div key={item.id} className="capacity-item">
              <div className="capacity-item-header">
                <span className="capacity-item-name">{item.name}</span>
                <span className="capacity-item-ratio" style={{ color: item.color }}>
                  {item.booked} / {item.total}
                </span>
              </div>
              <div className="capacity-bar-bg">
                <div 
                  className="capacity-bar-fill" 
                  style={{ 
                    width: `${percentage}%`, 
                    backgroundColor: item.color 
                  }} 
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Tarjeta de información importante ── */}
      <div className="capacity-info-card">
        <div className="capacity-info-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="capacity-info-text">
          <strong>Información Importante</strong>
          <p>Los cupos son limitados y se asignan por orden de inscripción. Verifica la disponibilidad actual.</p>
        </div>
      </div>
    </aside>
  )
}
