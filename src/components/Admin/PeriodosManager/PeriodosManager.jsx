import React, { useState, useEffect } from 'react';
import './PeriodosManager.css';
import { API_URL } from '../../../utils/apiConfig';

const PeriodosManager = () => {
    const [periodos, setPeriodos] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        fecha_inicio: '',
        fecha_fin: ''
    });

    useEffect(() => {
        fetchPeriodos();
    }, []);

    const fetchPeriodos = async () => {
        try {
            const response = await fetch(`${API_URL}/api/periodos`);
            const data = await response.json();
            setPeriodos(data);
        } catch (error) {
            console.error('Error fetching periodos:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleEdit = (periodo) => {
        setEditingId(periodo.id);
        // Formatear las fechas para los inputs type="date" (YYYY-MM-DD)
        const formatFecha = (fechaStr) => {
            const d = new Date(fechaStr);
            return d.toISOString().split('T')[0];
        };
        
        setFormData({
            nombre: periodo.nombre,
            fecha_inicio: formatFecha(periodo.fecha_inicio),
            fecha_fin: formatFecha(periodo.fecha_fin)
        });
        setShowForm(true);
    };

    const handleDelete = async (id, nombre) => {
        if (window.confirm(`¿Estás seguro de eliminar el periodo ${nombre}?`)) {
            try {
                const response = await fetch(`${API_URL}/api/periodos/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    fetchPeriodos();
                    alert('Periodo eliminado');
                } else {
                    alert('Error al eliminar el periodo. Es posible que esté asociado a estudiantes.');
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
                ? `${API_URL}/api/periodos/${editingId}`
                : `${API_URL}/api/periodos`;
            
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                setFormData({ nombre: '', fecha_inicio: '', fecha_fin: '' });
                setEditingId(null);
                setShowForm(false);
                fetchPeriodos();
                alert(`Periodo ${editingId ? 'actualizado' : 'creado'} exitosamente`);
            } else {
                alert(`Error al ${editingId ? 'actualizar' : 'crear'} el periodo`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleActivar = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/periodos/${id}/activar`, {
                method: 'PUT'
            });
            
            if (response.ok) {
                fetchPeriodos();
            } else {
                alert('Error al activar el periodo');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="periodos-manager">
            {showForm && (
                <div className="modal-overlay">
                    <div className="periodos-form-container modal-content">
                        <div className="modal-header">
                            <h3>{editingId ? 'Editar Periodo' : 'Crear Nuevo Periodo'}</h3>
                            <button className="btn-close" onClick={() => {
                                setShowForm(false);
                                setEditingId(null);
                                setFormData({ nombre: '', fecha_inicio: '', fecha_fin: '' });
                            }}>✖</button>
                        </div>
                        <form className="periodos-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nombre del Periodo (Ej: 2025-1)</label>
                                <input 
                                    type="text" 
                                    name="nombre" 
                                    value={formData.nombre} 
                                    onChange={handleInputChange} 
                                    required 
                                    placeholder="2025-1"
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Fecha de Inicio</label>
                                    <input 
                                        type="date" 
                                        name="fecha_inicio" 
                                        value={formData.fecha_inicio} 
                                        onChange={handleInputChange} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Fecha de Fin</label>
                                    <input 
                                        type="date" 
                                        name="fecha_fin" 
                                        value={formData.fecha_fin} 
                                        onChange={handleInputChange} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-cancelar" onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                    setFormData({ nombre: '', fecha_inicio: '', fecha_fin: '' });
                                }}>Cancelar</button>
                                <button type="submit" className="btn-crear">
                                    {editingId ? 'Actualizar Periodo' : 'Guardar Periodo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="periodos-list-container">
                <div className="list-header">
                    <h3>Periodos Académicos</h3>
                    <button className="btn-nuevo" onClick={() => setShowForm(true)}>
                        + Nuevo Periodo
                    </button>
                </div>
                <table className="periodos-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Inicio</th>
                            <th>Fin</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {periodos.length > 0 ? (
                            periodos.map(periodo => (
                                <tr key={periodo.id} className={periodo.activo ? 'row-activo' : ''}>
                                    <td>{periodo.nombre}</td>
                                    <td>{new Date(periodo.fecha_inicio).toLocaleDateString()}</td>
                                    <td>{new Date(periodo.fecha_fin).toLocaleDateString()}</td>
                                    <td>
                                        {periodo.activo ? (
                                            <span className="badge active">Activo</span>
                                        ) : (
                                            <span className="badge inactive">Inactivo</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="acciones-container">
                                            {!periodo.activo && (
                                                <button 
                                                    className="btn-activar" 
                                                    onClick={() => handleActivar(periodo.id)}
                                                    title="Establecer como Activo"
                                                >
                                                    ✨
                                                </button>
                                            )}
                                            <button 
                                                className="btn-editar" 
                                                onClick={() => handleEdit(periodo)}
                                                title="Editar"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                className="btn-eliminar" 
                                                onClick={() => handleDelete(periodo.id, periodo.nombre)}
                                                title="Eliminar"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No hay periodos registrados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PeriodosManager;