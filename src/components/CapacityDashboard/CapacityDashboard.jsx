import { useEffect, useState } from 'react'
import './CapacityDashboard.css'
import unnamedImg from '../../assets/unnamed.png'
import API_URL from '../../config/api'

const DEFAULT_DATA = [
  { id: 'lunes', name: 'Lunes', booked: 12, total: 50, color: '#7FB536' }, // Verde
  { id: 'martes', name: 'Martes', booked: 48, total: 50, color: '#E6007E' }, // Rosa/Rojo
  { id: 'miercoles', name: 'Miércoles', booked: 38, total: 50, color: '#D97706' }, // Naranja
  { id: 'jueves', name: 'Jueves', booked: 15, total: 50, color: '#7FB536' }, // Verde
  { id: 'viernes', name: 'Viernes', booked: 8, total: 50, color: '#7FB536' }, // Verde
]

export default function CapacityDashboard() {
  const [capacityData, setCapacityData] = useState(DEFAULT_DATA)

  useEffect(() => {
    const fetchCapacity = async () => {
      try {
        // 1. Obtener el periodo académico activo
        let activePeriodId = null
        try {
          const resPeriodo = await fetch(`${API_URL}/api/periodos/activo`)
          if (resPeriodo.ok) {
            const activePeriod = await resPeriodo.json()
            activePeriodId = activePeriod.id
          }
        } catch (err) {
          console.error('Error fetching active period:', err)
        }

        // 2. Obtener turnos
        const response = await fetch(`${API_URL}/api/turnos`)
        if (!response.ok) throw new Error('Error en la respuesta del servidor')
        const data = await response.json()

        // Filtrar turnos activos y que pertenezcan al periodo activo (si existe)
        const activeTurnos = data.filter(t => {
          const isActive = t.activo
          const matchesPeriod = activePeriodId ? t.periodo_id === activePeriodId : true
          return isActive && matchesPeriod
        })

        if (activeTurnos.length === 0) {
          setCapacityData(DEFAULT_DATA)
          return
        }

        // Agrupar por día
        const daysMap = {
          lunes: { name: 'Lunes', booked: 0, total: 0 },
          martes: { name: 'Martes', booked: 0, total: 0 },
          miercoles: { name: 'Miércoles', booked: 0, total: 0 },
          jueves: { name: 'Jueves', booked: 0, total: 0 },
          viernes: { name: 'Viernes', booked: 0, total: 0 },
        }

        activeTurnos.forEach(turno => {
          const diaKey = turno.dia.toLowerCase()
          if (daysMap[diaKey]) {
            daysMap[diaKey].booked += turno.cupos_ocupados || 0
            daysMap[diaKey].total += turno.cupos_totales || 0
          }
        })

        // Mapear a array y determinar color
        const result = Object.entries(daysMap)
          .filter(([_, value]) => value.total > 0)
          .map(([key, value]) => {
            const percentage = Math.round((value.booked / value.total) * 100)
            let color = '#7FB536' // Verde
            if (percentage >= 90) {
              color = '#E6007E' // Rosa/Rojo
            } else if (percentage >= 70) {
              color = '#D97706' // Naranja
            }
            return {
              id: key,
              name: value.name,
              booked: value.booked,
              total: value.total,
              color
            }
          })

        if (result.length === 0) {
          setCapacityData(DEFAULT_DATA)
        } else {
          setCapacityData(result)
        }
      } catch (error) {
        console.error('Error fetching capacity:', error)
        setCapacityData(DEFAULT_DATA)
      }
    }

    fetchCapacity()

    // Opcional: Actualizar periódicamente
    const interval = setInterval(fetchCapacity, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="capacity-container">
      <aside className="capacity-dashboard">
        {/* ── Título ── */}
        <h3 className="capacity-title">Disponibilidad de Cupos</h3>

        {/* ── Barras de Progreso ── */}
        <div className="capacity-list">
          {capacityData.map((item) => {
            const percentage = item.total > 0 ? Math.round((item.booked / item.total) * 100) : 0

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

        {/* ── Tarjeta de información importante (Ahora dentro) ── */}
        <div className="capacity-info-card-internal">
          <div className="capacity-info-header">
            <div className="capacity-info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <strong className="capacity-info-title">Información Importante</strong>
          </div>
          <p className="capacity-info-paragraph">
            La asignación de cupos se realiza por orden de llegada y verificación de documentos. Complete todos los pasos del formulario.
          </p>
        </div>

        {/* ── Imagen Decorativa (Ahora dentro) ── */}
        <div className="capacity-image-container-internal">
          <img src={unnamedImg} alt="Consultorio Jurídico" className="capacity-hero-image" />
        </div>
      </aside>
    </div>
  )
}
