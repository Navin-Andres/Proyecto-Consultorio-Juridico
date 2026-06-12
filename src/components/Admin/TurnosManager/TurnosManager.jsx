import React, { useState, useEffect } from 'react';
import './TurnosManager.css';
import API_URL from '../../../config/api';
import {
    alertGenerarTurnosResultado,
    alertSeleccionarPeriodo,
    confirmGenerarTurnos,
} from '../../../utils/swalAlerts';

const TurnosManager = () => {
    const [turnos, setTurnos] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filtroPeriodo, setFiltroPeriodo] = useState('');
    const [vista, setVista] = useState('cuadro'); // 'cuadro', 'lista', 'estudiante'
    const [busquedaEstudiante, setBusquedaEstudiante] = useState('');

    const [formData, setFormData] = useState({
        periodo_id: '',
        dia: 'lunes',
        jornada: 'mañana',
        hora_inicio: '08:00',
        hora_fin: '12:00',
        cupos_totales: 11,
        activo: true
    });

    useEffect(() => {
        fetchPeriodos();
        fetchTurnos();
        fetchEstudiantes();
    }, []);

    const fetchPeriodos = async () => {
        try {
            const response = await fetch(`${API_URL}/api/periodos`);
            const data = await response.json();
            setPeriodos(data);

            // Auto seleccionar el periodo activo si no hay filtro asignado
            if (data.length > 0 && !filtroPeriodo) {
                const activo = data.find(p => p.activo);
                if (activo) {
                    setFiltroPeriodo(activo.id.toString());
                    setFormData(prev => ({ ...prev, periodo_id: activo.id.toString() }));
                } else {
                    setFiltroPeriodo(data[0].id.toString());
                    setFormData(prev => ({ ...prev, periodo_id: data[0].id.toString() }));
                }
            }
        } catch (error) {
            console.error('Error fetching periodos:', error);
        }
    };

    const fetchTurnos = async () => {
        try {
            const response = await fetch(`${API_URL}/api/turnos`);
            const data = await response.json();
            setTurnos(data);
        } catch (error) {
            console.error('Error fetching turnos:', error);
        }
    };

    const fetchEstudiantes = async () => {
        try {
            const response = await fetch(`${API_URL}/api/estudiantes`);
            const data = await response.json();
            setEstudiantes(data);
        } catch (error) {
            console.error('Error fetching estudiantes:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFilterChange = (e) => {
        setFiltroPeriodo(e.target.value);
    };

    const handleEdit = (turno) => {
        setEditingId(turno.id);
        setFormData({
            periodo_id: turno.periodo_id,
            dia: turno.dia,
            jornada: turno.jornada,
            hora_inicio: turno.hora_inicio.slice(0, 5), // Quitar los segundos ej: "08:00:00" -> "08:00"
            hora_fin: turno.hora_fin.slice(0, 5),
            cupos_totales: turno.cupos_totales,
            activo: turno.activo
        });
        setShowForm(true);
    };

    const handleDelete = async (id, dia, jornada) => {
        if (window.confirm(`¿Estás seguro de eliminar el turno del día ${dia} en la ${jornada}?`)) {
            try {
                const response = await fetch(`${API_URL}/api/turnos/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    fetchTurnos();
                    alert('Turno eliminado');
                } else {
                    alert('Error al eliminar el turno. Asegúrese de que no tenga estudiantes asociados.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingId
                ? `${API_URL}/api/turnos/${editingId}`
                : `${API_URL}/api/turnos`;

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Reset selectos manteniendo periodo_id igual para facilidad de carga
                setFormData({
                    ...formData,
                    hora_inicio: '08:00', hora_fin: '12:00', cupos_totales: 11, activo: true
                });
                setEditingId(null);
                setShowForm(false);
                fetchTurnos();
                alert(`Turno ${editingId ? 'actualizado' : 'creado'} exitosamente`);
            } else {
                const errorData = await response.json();
                alert(`Error al guardar: ${errorData.message || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            periodo_id: filtroPeriodo || (periodos.length > 0 ? periodos[0].id : ''),
            dia: 'lunes',
            jornada: 'mañana',
            hora_inicio: '08:00',
            hora_fin: '12:00',
            cupos_totales: 11,
            activo: true
        });
    };

    // Auto generar turnos por defecto para el periodo seleccionado
    const handleGenerarTurnos = async () => {
        if (!filtroPeriodo) {
            await alertSeleccionarPeriodo();
            return;
        }
        const periodoObj = periodos.find(p => p.id.toString() === filtroPeriodo.toString());
        const periodoNombre = periodoObj ? periodoObj.nombre : '';

        const confirmed = await confirmGenerarTurnos(periodoNombre);
        if (!confirmed) return;

        const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
        const defaultTurnos = [];
        dias.forEach(d => {
            // Shift Mañana
            defaultTurnos.push({
                periodo_id: filtroPeriodo,
                dia: d,
                jornada: 'mañana',
                hora_inicio: '08:00',
                hora_fin: '12:00',
                cupos_totales: 11
            });
            // Shift Tarde
            defaultTurnos.push({
                periodo_id: filtroPeriodo,
                dia: d,
                jornada: 'tarde',
                hora_inicio: '14:00',
                hora_fin: '17:00',
                cupos_totales: 11
            });
        });

        let creados = 0;
        let errores = 0;

        for (const t of defaultTurnos) {
            const existe = turnos.some(existente =>
                existente.periodo_id.toString() === t.periodo_id.toString() &&
                existente.dia.toLowerCase() === t.dia.toLowerCase() &&
                existente.jornada.toLowerCase() === t.jornada.toLowerCase()
            );

            if (!existe) {
                try {
                    const response = await fetch(`${API_URL}/api/turnos`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(t)
                    });
                    if (response.ok) creados++;
                    else errores++;
                } catch (e) {
                    errores++;
                }
            }
        }

        fetchTurnos();
        await alertGenerarTurnosResultado(creados, errores);
    };

    // Exportar turnos a CSV
    const handleExport = () => {
        if (turnosMostrados.length === 0) {
            alert('No hay turnos para exportar en este periodo.');
            return;
        }
        const headers = ['Dia', 'Jornada', 'Horario', 'Cupos Ocupados', 'Cupos Totales', 'Estado'];
        const rows = turnosMostrados.map(t => {
            const pct = (t.cupos_ocupados / t.cupos_totales) * 100;
            const status = t.cupos_ocupados >= t.cupos_totales ? 'Lleno' : pct >= 80 ? 'Casi lleno' : 'Abierto';
            return [
                t.dia.toUpperCase(),
                t.jornada.toUpperCase(),
                `${formatHour(t.hora_inicio)} - ${formatHour(t.hora_fin)}`,
                t.cupos_ocupados,
                t.cupos_totales,
                t.activo ? status : 'Inactivo'
            ];
        });

        // CSV Format
        const csvContent = "data:text/csv;charset=utf-8,\uFEFF"
            + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `turnos_periodo_${filtroPeriodo}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Filtros de los visualizados
    const turnosMostrados = filtroPeriodo
        ? turnos.filter(t => t.periodo_id.toString() === filtroPeriodo.toString())
        : turnos;

    // Métricas del periodo seleccionado
    const totalCupos = turnosMostrados.reduce((sum, t) => sum + (t.cupos_totales || 0), 0);
    const cuposOcupados = turnosMostrados.reduce((sum, t) => sum + (t.cupos_ocupados || 0), 0);
    const cuposDisponibles = Math.max(0, totalCupos - cuposOcupados);
    const ocupacionPorcentaje = totalCupos > 0 ? Math.round((cuposOcupados / totalCupos) * 100) : 0;

    // Información del periodo activo y estudiantes
    const activePeriod = periodos.find(p => p.activo);
    const activePeriodName = activePeriod ? activePeriod.nombre : (periodos.find(p => p.id.toString() === filtroPeriodo.toString())?.nombre || '2026 - I');
    const standardCupos = turnosMostrados.length > 0 ? turnosMostrados[0].cupos_totales : 11;

    // Estudiantes filtrados por periodo y búsqueda
    const selectedPeriodObj = periodos.find(p => p.id.toString() === filtroPeriodo.toString());
    const estudiantesDelPeriodo = estudiantes.filter(e =>
        selectedPeriodObj && e.periodo === selectedPeriodObj.nombre
    );
    const estudiantesFiltrados = estudiantesDelPeriodo.filter(e => {
        const term = busquedaEstudiante.toLowerCase();
        return (
            e.nombres?.toLowerCase().includes(term) ||
            e.documento?.toLowerCase().includes(term)
        );
    });

    const daysOrder = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];

    const groupedTurnos = daysOrder.reduce((acc, day) => {
        acc[day] = [];
        return acc;
    }, {});

    turnosMostrados.forEach(turno => {
        const dayKey = turno.dia?.toLowerCase();
        if (groupedTurnos[dayKey]) {
            groupedTurnos[dayKey].push(turno);
        }
    });

    // Format hour to include AM/PM as requested by the user
    const formatHour = (hora) => {
        if (!hora) return '';
        const time = hora.slice(0, 5);
        const [hourStr, minuteStr] = time.split(':');
        const hour = parseInt(hourStr, 10);
        const minute = minuteStr || '00';
        const suffix = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minute} ${suffix}`;
    };

    const formatDayLabel = (day) => {
        const map = {
            lunes: 'Lunes',
            martes: 'Martes',
            miercoles: 'Miércoles',
            jueves: 'Jueves',
            viernes: 'Viernes'
        };
        return map[day] || day.toUpperCase();
    };

    return (
        <div className="turnos-manager">
            {/* Modal para Crear / Editar */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content periodos-form-container">
                        <div className="modal-header">
                            <h3>{editingId ? 'Modificar Turno' : 'Crear Nuevo Turno'}</h3>
                            <button className="btn-close" onClick={resetForm}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <form className="turnos-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Periodo Académico</label>
                                <select
                                    name="periodo_id"
                                    value={formData.periodo_id}
                                    onChange={handleInputChange}
                                    disabled={editingId !== null}
                                    required
                                >
                                    <option value="" disabled>Seleccione un periodo...</option>
                                    {periodos.map(p => (
                                        <option key={p.id} value={p.id}>{p.nombre} {p.activo ? '(Activo)' : ''}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Día</label>
                                    <select
                                        name="dia"
                                        value={formData.dia}
                                        onChange={handleInputChange}
                                        disabled={editingId !== null}
                                        required
                                    >
                                        <option value="lunes">Lunes</option>
                                        <option value="martes">Martes</option>
                                        <option value="miercoles">Miércoles</option>
                                        <option value="jueves">Jueves</option>
                                        <option value="viernes">Viernes</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Jornada</label>
                                    <select
                                        name="jornada"
                                        value={formData.jornada}
                                        onChange={handleInputChange}
                                        disabled={editingId !== null}
                                        required
                                    >
                                        <option value="mañana">Mañana</option>
                                        <option value="tarde">Tarde</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Hora Inicio</label>
                                    <input
                                        type="time"
                                        name="hora_inicio"
                                        value={formData.hora_inicio}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <span className="time-hint">{formatHour(formData.hora_inicio)}</span>
                                </div>
                                <div className="form-group">
                                    <label>Hora Fin</label>
                                    <input
                                        type="time"
                                        name="hora_fin"
                                        value={formData.hora_fin}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <span className="time-hint">{formatHour(formData.hora_fin)}</span>
                                </div>
                                <div className="form-group">
                                    <label>Cupos Totales</label>
                                    <input
                                        type="number"
                                        name="cupos_totales"
                                        value={formData.cupos_totales}
                                        onChange={handleInputChange}
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>

                            {editingId && (
                                <div className="form-group row-checkbox">
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="activo"
                                            checked={formData.activo}
                                            onChange={handleInputChange}
                                        />
                                        Activar Turno
                                    </label>
                                </div>
                            )}

                            <div className="form-actions">
                                <button type="button" className="btn-cancelar" onClick={resetForm}>Cancelar</button>
                                <button type="submit" className="btn-crear">
                                    {editingId ? 'Guardar Cambios' : 'Crear Turno'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Header Block exactly like Mockup */}
            <div className="turnos-header-block">
                <div className="header-title-container">
                    <h2>Asignación de Turnos</h2>
                    <span className="header-subtitle">
                        Período activo: {activePeriodName} &middot; {standardCupos} cupos por turno
                    </span>
                </div>
                <div className="header-actions">
                    <button className="btn-header-secondary" onClick={handleExport}>
                        Exportar
                    </button>
                    <button className="btn-header-secondary" onClick={handleGenerarTurnos}>
                        Generar turnos &ne;
                    </button>
                    <button className="btn-nuevo" onClick={() => setShowForm(true)}>
                        + Nuevo Turno
                    </button>
                </div>
            </div>

            {/* KPIs Grid Block exactly like Mockup */}
            <div className="metrics-grid">
                <div className="metric-card">
                    <span className="metric-label">TOTAL CUPOS</span>
                    <span className="metric-value">{totalCupos}</span>
                </div>
                <div className="metric-card">
                    <span className="metric-label">OCUPADOS</span>
                    <span className="metric-value text-green">{cuposOcupados}</span>
                </div>
                <div className="metric-card">
                    <span className="metric-label">DISPONIBLES</span>
                    <span className="metric-value text-green">{cuposDisponibles}</span>
                </div>
                <div className="metric-card">
                    <span className="metric-label">OCUPACIÓN</span>
                    <span className="metric-value text-brown">{ocupacionPorcentaje}%</span>
                </div>
            </div>

            <div className="turnos-list-container">
                {/* View Switcher exactly like Mockup */}
                <div className="view-switcher-container">
                    <div className="view-tabs">
                        <button
                            className={`view-tab-btn ${vista === 'cuadro' ? 'active' : ''}`}
                            onClick={() => setVista('cuadro')}
                        >
                            Vista cuadro
                        </button>
                        <button
                            className={`view-tab-btn ${vista === 'lista' ? 'active' : ''}`}
                            onClick={() => setVista('lista')}
                        >
                            Vista lista
                        </button>
                        <button
                            className={`view-tab-btn ${vista === 'estudiante' ? 'active' : ''}`}
                            onClick={() => setVista('estudiante')}
                        >
                            Por estudiante
                        </button>
                    </div>

                    <div className="filter-group">
                        <label>Ver del periodo: </label>
                        <select value={filtroPeriodo} onChange={handleFilterChange}>
                            {periodos.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre} {p.activo ? '(Activo)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Vista Cuadro (Grid View) */}
                {vista === 'cuadro' && (
                    <div className="turnos-dashboard">
                        {daysOrder.map(day => {
                            const turnosDelDia = groupedTurnos[day] || [];
                            return (
                                <div key={day} className="turnos-column">
                                    <div className="day-header">{formatDayLabel(day)}</div>
                                    {turnosDelDia.length > 0 ? (
                                        turnosDelDia
                                            .sort((a, b) => (a.jornada === 'mañana' ? -1 : 1))
                                            .map(turno => {
                                                const porcentaje = (turno.cupos_ocupados / turno.cupos_totales) * 100;
                                                const isFull = turno.cupos_ocupados >= turno.cupos_totales;
                                                const almostFull = !isFull && porcentaje >= 80;
                                                const statusText = isFull ? 'Lleno' : almostFull ? 'Casi lleno' : 'Abierto';
                                                const statusClass = isFull ? 'full' : almostFull ? 'almost-full' : 'open';

                                                return (
                                                    <div key={turno.id} className={`turno-card ${!turno.activo ? 'inactivo' : ''} ${statusClass}`}>
                                                        <div className="turno-card-header">
                                                            <span className="turno-jornada-label">{turno.jornada}</span>
                                                            <span className="turno-status-icon">●</span>

                                                            {/* Floating Hover Actions */}
                                                            <div className="card-actions">
                                                                <button className="btn-editar-icon" title="Editar" onClick={() => handleEdit(turno)}>
                                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                                    </svg>
                                                                </button>
                                                                <button className="btn-eliminar-icon" title="Eliminar" onClick={() => handleDelete(turno.id, turno.dia, turno.jornada)}>
                                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                        <polyline points="3 6 5 6 21 6" />
                                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                                        <line x1="10" y1="11" x2="10" y2="17" />
                                                                        <line x1="14" y1="11" x2="14" y2="17" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="turno-card-body">
                                                            <div className="turno-horario">
                                                                {formatHour(turno.hora_inicio)} &ndash; {formatHour(turno.hora_fin)}
                                                            </div>
                                                            <div className="cupos-barra-bg">
                                                                <div
                                                                    className={`cupos-barra-fill ${isFull ? 'llena' : almostFull ? 'casi-llena' : 'abierto'}`}
                                                                    style={{ width: `${porcentaje}%` }}
                                                                ></div>
                                                            </div>
                                                            <div className="turno-card-bottom-row">
                                                                <span className="cupos-meta">{turno.cupos_ocupados}/{turno.cupos_totales}</span>
                                                                <span className={`status-badge ${statusClass}`}>{statusText}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                    ) : (
                                        <div className="turno-empty">Sin turno</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Vista Lista (Table View) */}
                {vista === 'lista' && (
                    <div className="vista-lista-container">
                        <table className="turnos-table-view">
                            <thead>
                                <tr>
                                    <th>Día</th>
                                    <th>Jornada</th>
                                    <th>Horario</th>
                                    <th>Cupos Ocupados</th>
                                    <th>Cupos Totales</th>
                                    <th>Ocupación</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {turnosMostrados.length > 0 ? (
                                    turnosMostrados.map(turno => {
                                        const porcentaje = (turno.cupos_ocupados / turno.cupos_totales) * 100;
                                        const isFull = turno.cupos_ocupados >= turno.cupos_totales;
                                        const almostFull = !isFull && porcentaje >= 80;
                                        const statusText = isFull ? 'Lleno' : almostFull ? 'Casi lleno' : 'Abierto';
                                        const statusClass = isFull ? 'full' : almostFull ? 'almost-full' : 'open';

                                        return (
                                            <tr key={turno.id} className={!turno.activo ? 'row-inactivo' : ''}>
                                                <td className="text-capitalize">{turno.dia}</td>
                                                <td className="text-capitalize">{turno.jornada}</td>
                                                <td>{formatHour(turno.hora_inicio)} &ndash; {formatHour(turno.hora_fin)}</td>
                                                <td>{turno.cupos_ocupados}</td>
                                                <td>{turno.cupos_totales}</td>
                                                <td>
                                                    <div className="table-ocupacion-cell">
                                                        <span className="table-ocupacion-number">{Math.round(porcentaje)}%</span>
                                                        <div className="cupos-barra-bg table-bar">
                                                            <div
                                                                className={`cupos-barra-fill ${isFull ? 'llena' : almostFull ? 'casi-llena' : 'abierto'}`}
                                                                style={{ width: `${porcentaje}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${statusClass}`}>{statusText}</span>
                                                </td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button className="btn-editar-table" title="Editar" onClick={() => handleEdit(turno)}>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                            </svg>
                                                        </button>
                                                        <button className="btn-eliminar-table" title="Eliminar" onClick={() => handleDelete(turno.id, turno.dia, turno.jornada)}>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="3 6 5 6 21 6" />
                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                                <line x1="10" y1="11" x2="10" y2="17" />
                                                                <line x1="14" y1="11" x2="14" y2="17" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center text-muted">No hay turnos registrados en este periodo</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Vista por Estudiante (Functional assignment view) */}
                {vista === 'estudiante' && (
                    <div className="vista-estudiantes-container">
                        <div className="table-search-bar">
                            <input
                                type="text"
                                placeholder="Buscar estudiante por nombre o documento..."
                                value={busquedaEstudiante}
                                onChange={(e) => setBusquedaEstudiante(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <table className="turnos-table-view">
                            <thead>
                                <tr>
                                    <th>Estudiante</th>
                                    <th>Documento</th>
                                    <th>Consultorio</th>
                                    <th>Día Asignado</th>
                                    <th>Jornada y Horario</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estudiantesFiltrados.length > 0 ? (
                                    estudiantesFiltrados.map(est => (
                                        <tr key={est.id}>
                                            <td className="font-semibold">{est.nombres}</td>
                                            <td>{est.documento}</td>
                                            <td>Consultorio {est.nivel}</td>
                                            <td>
                                                <span className={`day-badge ${est.turnoObj.dia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}>
                                                    {est.turnoObj.dia}
                                                </span>
                                            </td>
                                            <td>
                                                {est.turnoObj.detalle ? (
                                                    <span className="text-dark font-medium">{est.turnoObj.detalle}</span>
                                                ) : (
                                                    <span className="text-muted">Sin turno asignado</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted">No se encontraron estudiantes asignados en este periodo</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TurnosManager;