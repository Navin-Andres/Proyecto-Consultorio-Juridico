import React, { useState, useEffect } from 'react';
import './EstudiantesInscriptos.css';
import FichaEstudiante from './FichaEstudiante';
import { alertQuitarError, alertQuitarExito, confirmQuitarEstudiante } from '../../../utils/swalAlerts';
import API_URL from '../../../config/api';

const EstudiantesInscriptos = () => {
    // Inicializado vacío para que la tabla esté limpia
    const [estudiantes, setEstudiantes] = useState([]);
    const [selectedEstudiante, setSelectedEstudiante] = useState(null);
    const [filtros, setFiltros] = useState({
        busqueda: '',
        turnoId: '',
        periodo: ''
    });
    const [turnos, setTurnos] = useState([]);
    const [periodos, setPeriodos] = useState([]);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        fetchEstudiantes();
    }, [filtros]); // Se volvería a llamar si cambian los filtros

    useEffect(() => {
        const fetchTurnosYPeriodos = async () => {
            try {
                const [resTurnos, resPeriodos] = await Promise.all([
                    fetch(`${API_URL}/api/turnos`),
                    fetch(`${API_URL}/api/periodos`)
                ]);
                const dataTurnos = await resTurnos.json();
                const dataPeriodos = await resPeriodos.json();
                setTurnos(dataTurnos);
                setPeriodos(dataPeriodos);
            } catch (error) {
                console.error('Error fetching turnos or periodos:', error);
            }
        };
        fetchTurnosYPeriodos();
    }, []);

    // Escuchar la tecla escape para cerrar el Drawer
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSelectedEstudiante(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const formatTime12h = (timeStr) => {
        if (!timeStr) return '';
        const [hourStr, minStr] = timeStr.split(':');
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        return `${hour}:${minStr} ${ampm}`;
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

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros({
            ...filtros,
            [name]: value
        });
        setCurrentPage(1); // Volver a la página 1 cuando se filtra
    };

    const handleQuitar = async (id) => {
        const response = await fetch(`${API_URL}/api/estudiantes/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Error al quitar el estudiante.');
        }

        if (selectedEstudiante && selectedEstudiante.id === id) {
            setSelectedEstudiante(null);
        }
        setEstudiantes(prev => prev.filter(est => est.id !== id));
    };

    const confirmarYQuitar = async (id, nombre) => {
        const confirmed = await confirmQuitarEstudiante(nombre || 'este estudiante');
        if (!confirmed) return;

        try {
            await handleQuitar(id);
            await alertQuitarExito();
        } catch (error) {
            await alertQuitarError(error.message);
        }
    };

    const exportToExcel = () => {
        if (estudiantes.length === 0) {
            alert('No hay estudiantes registrados para exportar.');
            return;
        }

        // Encabezados de columnas (Todos los campos del formulario de inscripción)
        const headers = [
            'Nombre Completo',
            'Correo Personal',
            'Correo Institucional',
            'Consultorio (Nivel)',
            'Semestre',
            'Tipo de Documento',
            'Nro. de Documento',
            'Fecha de Nacimiento',
            'EPS',
            'Teléfono / Celular',
            'Jornada de Asignaturas',
            'Área de Interés',
            'Consultorios Realizados en Sede',
            'Consultorios Externos',
            'Radicados',
            'Dirección de Residencia',
            'Municipio',
            'Departamento',
            'Trabaja',
            'Empresa',
            'Cargo',
            'Día de Práctica',
            'Detalles de Horario',
            'Observaciones Personales'
        ];

        // Mapeo de filas
        const rows = estudiantes.map(est => [
            est.nombres || '',
            est.email || '',
            est.correoInstitucional || 'N/A',
            est.nivel || 'I',
            est.semestre || '',
            est.tipoDoc || '',
            est.documento || '',
            est.fechaNacimiento || '',
            est.eps || 'N/A',
            est.telefono || 'N/A',
            est.jornadaAsignaturas ? est.jornadaAsignaturas.replace(/\b\w/g, c => c.toUpperCase()) : 'N/A',
            est.areaInteres ? est.areaInteres.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'N/A',
            est.consultoriosRealizados || '0',
            est.consultorioExterno || '0',
            est.radicados || 'N/A',
            est.residencia || 'N/A',
            est.municipio || 'N/A',
            est.departamento || 'N/A',
            est.trabaja || 'No',
            est.empresa || 'N/A',
            est.cargo || 'N/A',
            est.turnoObj?.dia || 'Sin asignar',
            est.turnoObj?.detail || est.turnoObj?.detalle || '',
            est.observacionesPersonales || ''
        ]);

        // Construir contenido CSV delimitado por punto y coma (;) para compatibilidad con Excel en español
        const csvContent = [
            headers.join(';'),
            ...rows.map(row => row.map(val => {
                const cleanVal = String(val).replace(/"/g, '""');
                return cleanVal.includes(';') || cleanVal.includes('\n') || cleanVal.includes('"')
                    ? `"${cleanVal}"`
                    : cleanVal;
            }).join(';'))
        ].join('\n');

        // Codificación UTF-8 con BOM (\uFEFF) para que Excel lo abra con los caracteres de tildes y ñ legibles
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        const fechaHoy = new Date().toISOString().split('T')[0];
        link.href = url;
        link.setAttribute('download', `estudiantes_inscriptos_${fechaHoy}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Aplicar filtros a los estudiantes
    const estudiantesFiltrados = estudiantes.filter(est => {
        // Filtro de búsqueda por nombre o identificación
        if (filtros.busqueda) {
            const query = filtros.busqueda.toLowerCase().trim();
            const nombreCoincide = est.nombres && est.nombres.toLowerCase().includes(query);
            const documentoCoincide = est.documento && est.documento.toString().includes(query);

            if (!nombreCoincide && !documentoCoincide) {
                return false;
            }
        }

        // Filtro de período
        if (filtros.periodo && est.periodo !== filtros.periodo) {
            return false;
        }

        // Filtro de turnos
        if (filtros.turnoId && (!est.turnoId || est.turnoId.toString() !== filtros.turnoId.toString())) {
            return false;
        }

        return true;
    });

    // Lógica para paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEstudiantes = estudiantesFiltrados.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(estudiantesFiltrados.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (selectedEstudiante) {
        return (
            <FichaEstudiante
                selectedEstudiante={selectedEstudiante}
                onBack={() => {
                    setSelectedEstudiante(null);
                    fetchEstudiantes();
                }}
                onQuitar={confirmarYQuitar}
            />
        );
    }

    return (
        <div className="estudiantes-container">
            <div className="estudiantes-header">
                <div className="header-titles">
                    <h2>Gestión de Estudiantes</h2>
                    <p>Directorio maestro de practicantes del Consultorio Jurídico.</p>
                </div>
                <button className="btn-export-excel" onClick={exportToExcel} title="Exportar directorio completo a Excel">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="excel-icon">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <span>Exportar Excel</span>
                </button>
            </div>

            <div className="filtros-section">
                <div className="filtro-icon-wrapper">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="21" x2="4" y2="14"></line>
                        <line x1="4" y1="10" x2="4" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="3"></line>
                        <line x1="20" y1="21" x2="20" y2="16"></line>
                        <line x1="20" y1="12" x2="20" y2="3"></line>
                        <line x1="1" y1="14" x2="7" y2="14"></line>
                        <line x1="9" y1="8" x2="15" y2="8"></line>
                        <line x1="17" y1="16" x2="23" y2="16"></line>
                    </svg>
                </div>

                <div className="filtros-grid">
                    <div className="filtro-grupo">
                        <label>BUSCAR ESTUDIANTE</label>
                        <input
                            type="text"
                            name="busqueda"
                            placeholder="Nombre o documento..."
                            value={filtros.busqueda}
                            onChange={handleFiltroChange}
                        />
                    </div>

                    <div className="filtro-grupo">
                        <label>TURNOS</label>
                        <select name="turnoId" value={filtros.turnoId} onChange={handleFiltroChange}>
                            <option value="">Todos los turnos</option>
                            {turnos.map(t => {
                                const diaCapitalizado = t.dia.charAt(0).toUpperCase() + t.dia.slice(1);
                                const jornadaCapitalizada = t.jornada.charAt(0).toUpperCase() + t.jornada.slice(1);
                                const horarioTexto = `${diaCapitalizado} - ${jornadaCapitalizada} (${formatTime12h(t.hora_inicio)} - ${formatTime12h(t.hora_fin)})`;
                                return (
                                    <option key={t.id} value={t.id.toString()}>
                                        {horarioTexto}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="filtro-grupo">
                        <label>PERÍODO</label>
                        <select name="periodo" value={filtros.periodo} onChange={handleFiltroChange}>
                            <option value="">Todos los periodos</option>
                            {periodos.map(p => (
                                <option key={p.id} value={p.nombre}>
                                    {p.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="estudiantes-table">
                    <thead>
                        <tr>
                            <th className="col-nombre">NOMBRE COMPLETO</th>
                            <th className="col-identificacion">IDENTIFICACIÓN</th>
                            <th className="col-nivel-semestre">NIVEL</th>
                            <th className="col-turno">DÍA / JORNADA</th>
                            <th className="col-acciones text-center">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEstudiantes.length > 0 ? (
                            currentEstudiantes.map((est) => {
                                const isSelected = selectedEstudiante && selectedEstudiante.id === est.id;
                                return (
                                    <tr key={est.id} className={isSelected ? 'active-row' : ''}>
                                        <td className="col-nombre">
                                            <div className="estudiante-info">
                                                <div className="avatar-circle">{est.iniciales}</div>
                                                <div className="estudiante-detalles">
                                                    <span className="nombre">{est.nombres} {est.apellidos}</span>
                                                    <span className="email">{est.correoInstitucional !== 'N/A' ? est.correoInstitucional : est.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="col-identificacion">
                                            <div className="identificacion">
                                                <span className="tipo-doc">{est.tipoDoc}</span>
                                                <span className="num-doc">{est.documento}</span>
                                            </div>
                                        </td>
                                        <td className="col-nivel-semestre">
                                            <div className="nivel-semestre-badge-group">
                                                <span className="badge badge-nivel">{est.nivel}</span>
                                                <span className="semestre-text">{est.semestre}°</span>
                                            </div>
                                        </td>
                                        <td className="col-turno">
                                            <div className="turno-apilado">
                                                <span className="turno-dia">{est.turnoObj?.dia || 'Sin asignar'}</span>
                                                {est.turnoObj?.detalle && (
                                                    <span className="turno-detalle">{est.turnoObj.detalle}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="col-acciones text-center">
                                            <div className="acciones-buttons-wrapper">
                                                <button
                                                    className={`btn-view-details ${isSelected ? 'active' : ''}`}
                                                    onClick={() => setSelectedEstudiante(est)}
                                                    title="Ver Ficha Completa"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                        <circle cx="12" cy="12" r="3"></circle>
                                                    </svg>
                                                </button>
                                                <button
                                                    className="btn-delete-estudiante"
                                                    onClick={() => confirmarYQuitar(
                                                        est.id,
                                                        `${est.nombres || ''} ${est.apellidos || ''}`.trim()
                                                    )}
                                                    title="Quitar estudiante"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center empty-state">
                                    No hay estudiantes registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="table-footer">
                <span className="table-status-text">
                    {estudiantesFiltrados.length > 0 ? (
                        `Mostrando ${indexOfFirstItem + 1} a ${Math.min(indexOfLastItem, estudiantesFiltrados.length)} de ${estudiantesFiltrados.length} estudiantes`
                    ) : (
                        'Mostrando 0 estudiantes'
                    )}
                </span>

                {/* Renderizado de controles de paginación */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="btn-pagina prev-next"
                        >
                            Anterior
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => paginate(index + 1)}
                                className={`btn-pagina ${currentPage === index + 1 ? 'active' : ''}`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="btn-pagina prev-next"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EstudiantesInscriptos;