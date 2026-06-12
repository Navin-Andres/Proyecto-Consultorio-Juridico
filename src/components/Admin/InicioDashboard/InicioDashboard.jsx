import React, { useEffect, useState } from 'react';
import './InicioDashboard.css';
import API_URL from '../../../config/api';

const InicioDashboard = ({ setActiveTab }) => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [turnos, setTurnos] = useState([]);
    const [periodoActivo, setPeriodoActivo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch estudiantes
                const resEst = await fetch(`${API_URL}/api/estudiantes`);
                const dataEst = await resEst.json();
                setEstudiantes(dataEst);

                // Fetch turnos
                const resTurnos = await fetch(`${API_URL}/api/turnos`);
                const dataTurnos = await resTurnos.json();
                setTurnos(dataTurnos.filter(t => t.activo));

                // Fetch periodo activo
                const resPeriodo = await fetch(`${API_URL}/api/periodos/activo`);
                if (resPeriodo.ok) {
                    const dataPeriodo = await resPeriodo.json();
                    setPeriodoActivo(dataPeriodo);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Cargando datos del panel...</p>
            </div>
        );
    }

    // Calcular estadísticas de estudiantes
    const totalEstudiantes = estudiantes.length;
    const activos = estudiantes.filter(e => e.estado !== 'rechazado').length;
    const turnosActivos = turnos.length;

    // Calcular estadísticas de turnos
    const totalCuposTotales = turnos.reduce((acc, t) => acc + t.cupos_totales, 0);
    const totalCuposOcupados = turnos.reduce((acc, t) => acc + t.cupos_ocupados, 0);
    const cuposDisponibles = totalCuposTotales - totalCuposOcupados;
    const porcentajeOcupacion = totalCuposTotales > 0 ? Math.round((totalCuposOcupados / totalCuposTotales) * 100) : 0;

    // Obtener los 5 estudiantes más recientes
    const ultimosEstudiantes = estudiantes.slice(0, 5);

    return (
        <div className="inicio-dashboard">
            {/* Header del inicio */}
            <div className="inicio-header">
                <div className="welcome-section">
                    <h2>Resumen del Sistema</h2>
                    <p className="subtitle">
                        Período Académico Activo: <strong className="periodo-badge">{periodoActivo ? periodoActivo.nombre : 'Ninguno'}</strong>
                    </p>
                </div>
                <div className="date-badge">
                    <span>📅 {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Grid de Tarjetas de Estadísticas */}
            <div className="stats-grid">
                <div className="stat-card total" onClick={() => setActiveTab('estudiantes')}>
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <span className="stat-label">Total Inscritos</span>
                        <h3 className="stat-value">{totalEstudiantes}</h3>
                    </div>
                </div>
                <div className="stat-card active" onClick={() => setActiveTab('estudiantes')}>
                    <div className="stat-icon">📋</div>
                    <div className="stat-info">
                        <span className="stat-label">Inscripciones Activas</span>
                        <h3 className="stat-value">{activos}</h3>
                    </div>
                </div>
                <div className="stat-card turnos" onClick={() => setActiveTab('turnos')}>
                    <div className="stat-icon">📅</div>
                    <div className="stat-info">
                        <span className="stat-label">Turnos Activos</span>
                        <h3 className="stat-value">{turnosActivos}</h3>
                    </div>
                </div>
                <div className="stat-card cupos" onClick={() => setActiveTab('turnos')}>
                    <div className="stat-icon">🪑</div>
                    <div className="stat-info">
                        <span className="stat-label">Cupos Disponibles</span>
                        <h3 className="stat-value">{cuposDisponibles}</h3>
                    </div>
                </div>
            </div>

            {/* Sección de doble columna */}
            <div className="dashboard-columns">
                {/* Ocupación de Turnos */}
                <div className="dashboard-column-card">
                    <div className="column-header">
                        <h4>Ocupación de Turnos ({porcentajeOcupacion}% total)</h4>
                        <button className="view-more-link" onClick={() => setActiveTab('turnos')}>Gestionar</button>
                    </div>
                    <div className="column-content">
                        {turnos.length === 0 ? (
                            <p className="no-data">No hay turnos activos configurados.</p>
                        ) : (
                            <div className="turnos-occupancy-list">
                                {turnos.map(turno => {
                                    const perc = turno.cupos_totales > 0 ? Math.round((turno.cupos_ocupados / turno.cupos_totales) * 100) : 0;
                                    let colorClass = 'green';
                                    if (perc >= 90) colorClass = 'red';
                                    else if (perc >= 70) colorClass = 'orange';

                                    const diaCapitalizado = turno.dia.charAt(0).toUpperCase() + turno.dia.slice(1);
                                    const jornadaCapitalizada = turno.jornada.charAt(0).toUpperCase() + turno.jornada.slice(1);

                                    return (
                                        <div key={turno.id} className="occupancy-item">
                                            <div className="occupancy-info">
                                                <span className="occupancy-name">{diaCapitalizado} ({jornadaCapitalizada})</span>
                                                <span className="occupancy-count">{turno.cupos_ocupados} / {turno.cupos_totales} cupos</span>
                                            </div>
                                            <div className="occupancy-bar-bg">
                                                <div className={`occupancy-bar-fill ${colorClass}`} style={{ width: `${perc}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Últimos registros */}
                <div className="dashboard-column-card">
                    <div className="column-header">
                        <h4>Inscripciones Recientes</h4>
                        <button className="view-more-link" onClick={() => setActiveTab('estudiantes')}>Ver Todos</button>
                    </div>
                    <div className="column-content">
                        {ultimosEstudiantes.length === 0 ? (
                            <p className="no-data">No se han registrado estudiantes en este período.</p>
                        ) : (
                            <div className="recent-students-list">
                                {ultimosEstudiantes.map(est => {
                                    const initials = est.nombres ? est.nombres.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?';
                                    return (
                                        <div key={est.id} className="recent-student-item">
                                            <div className="student-avatar">{initials}</div>
                                            <div className="student-details">
                                                <span className="student-name">{est.nombres}</span>
                                                <span className="student-sub">{est.email} • {est.turnoObj?.dia || 'Sin turno'}</span>
                                            </div>
                                            <span className={`status-badge ${est.estado === 'rechazado' ? 'rechazado' : 'activo'}`}>
                                                {est.estado === 'rechazado' ? 'Rechazado' : 'Activo'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
                <h4>Accesos Rápidos</h4>
                <div className="quick-actions-grid">
                    <button className="action-btn" onClick={() => setActiveTab('estudiantes')}>
                        <span className="action-icon">👥</span>
                        <div className="action-text">
                            <strong>Estudiantes</strong>
                            <span>Ver directorio y fichas de inscripción</span>
                        </div>
                    </button>
                    <button className="action-btn" onClick={() => setActiveTab('turnos')}>
                        <span className="action-icon">📅</span>
                        <div className="action-text">
                            <strong>Turnos</strong>
                            <span>Editar cupos y horarios</span>
                        </div>
                    </button>
                    <button className="action-btn" onClick={() => setActiveTab('periodos')}>
                        <span className="action-icon">⏳</span>
                        <div className="action-text">
                            <strong>Periodos</strong>
                            <span>Crear o activar semestres</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InicioDashboard;
