import React, { useState, useEffect } from 'react';
import './TurnosManager.css';

const TurnosManager = () => {
    const [turnos, setTurnos] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filtroPeriodo, setFiltroPeriodo] = useState('');
    
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
    }, []);

    const fetchPeriodos = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/periodos');
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
            const response = await fetch('http://localhost:5000/api/turnos');
            const data = await response.json();
            setTurnos(data);
        } catch (error) {
            console.error('Error fetching turnos:', error);
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
            hora_inicio: turno.hora_inicio.slice(0,5), // Quitar los segundos ej: "08:00:00" -> "08:00"
            hora_fin: turno.hora_fin.slice(0,5),
            cupos_totales: turno.cupos_totales,
            activo: turno.activo
        });
        setShowForm(true);
    };

    const handleDelete = async (id, dia, jornada) => {
        if (window.confirm(`¿Estás seguro de eliminar el turno del día ${dia} en la ${jornada}?`)) {
            try {
                const response = await fetch(`http://localhost:5000/api/turnos/${id}`, {
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
                ? `http://localhost:5000/api/turnos/${editingId}`
                : 'http://localhost:5000/api/turnos';
            
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

    // Filtros de los visualizados
    const turnosMostrados = filtroPeriodo 
        ? turnos.filter(t => t.periodo_id.toString() === filtroPeriodo.toString())
        : turnos;

    return (
        <div className="turnos-manager">
            {/* Modal para Crear / Editar */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content periodos-form-container">
                        <div className="modal-header">
                            <h3>{editingId ? 'Modificar Turno' : 'Crear Nuevo Turno'}</h3>
                            <button className="btn-close" onClick={resetForm}>✖</button>
                        </div>
                        <form className="turnos-form" onSubmit={handleSubmit}>
                            {/* Si es edit, no dejar cambiar día/jornada/periodo por la restricción única, 
                                o deshabilitar estos campos para que sea seguro modificar lo demás. */}
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

            <div className="turnos-list-container">
                <div className="list-header">
                    <h3>Disponibilidad de Turnos</h3>
                    
                    <div className="filter-group">
                        <label>Ver del periodo: </label>
                        <select value={filtroPeriodo} onChange={handleFilterChange}>
                            {periodos.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre} {p.activo ? '(Activo)' : ''}
                                </option>
                            ))}
                        </select>
                        <button className="btn-nuevo" onClick={() => setShowForm(true)}>
                            + Nuevo Turno
                        </button>
                    </div>
                </div>

                <div className="turnos-cards-grid">
                    {turnosMostrados.length > 0 ? (
                        turnosMostrados.map(turno => {
                            const porcentaje = (turno.cupos_ocupados / turno.cupos_totales) * 100;
                            const isFull = turno.cupos_ocupados >= turno.cupos_totales;

                            return (
                                <div key={turno.id} className={`turno-card ${!turno.activo ? 'inactivo' : ''}`}>
                                    <div className="turno-card-header">
                                        <span className="turno-dia">{turno.dia.toUpperCase()}</span>
                                        <span className={`turno-jornada j-${turno.jornada}`}>{turno.jornada}</span>
                                    </div>
                                    
                                    <div className="turno-card-body">
                                        <div className="turno-horario">
                                            <span>🕒 {turno.hora_inicio.slice(0,5)} - {turno.hora_fin.slice(0,5)}</span>
                                        </div>
                                        
                                        <div className="turno-cupos">
                                            <div className="cupos-text">
                                                <span>{turno.cupos_ocupados} de {turno.cupos_totales} cupos</span>
                                            </div>
                                            <div className="cupos-barra-bg">
                                                <div 
                                                    className={`cupos-barra-fill ${isFull ? 'llena' : ''}`}
                                                    style={{ width: `${porcentaje}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="turno-card-footer">
                                        {!turno.activo ? (
                                            <span className="status-badge inactive">Inhabilitado</span>
                                        ) : isFull ? (
                                            <span className="status-badge full">Sin Cupos</span>
                                        ) : (
                                            <span className="status-badge active">Disponible</span>
                                        )}

                                        <div className="acciones-container">
                                            <button className="btn-editar" title="Editar" onClick={() => handleEdit(turno)}>✏️</button>
                                            <button className="btn-eliminar" title="Eliminar" onClick={() => handleDelete(turno.id, turno.dia, turno.jornada)}>🗑️</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="empty-state">No hay turnos creados para este período académico.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TurnosManager;