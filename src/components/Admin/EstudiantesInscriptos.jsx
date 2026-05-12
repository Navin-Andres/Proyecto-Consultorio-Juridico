import React, { useState, useEffect } from 'react';
import './EstudiantesInscriptos.css';

const EstudiantesInscriptos = () => {
    // Inicializado vacío para que la tabla esté limpia
    const [estudiantes, setEstudiantes] = useState([]);
    const [filtros, setFiltros] = useState({
        consultorio: '',
        jornada: '',
        periodo: ''
    });

    useEffect(() => {
        fetchEstudiantes();
    }, [filtros]); // Se volvería a llamar si cambian los filtros

    const fetchEstudiantes = async () => {
        try {
            // Aquí iría el fetch a tu backend, por ahora lo dejamos vacío intencionalmente
            // const response = await fetch(`http://localhost:5000/api/estudiantes`);
            // const data = await response.json();
            // setEstudiantes(data);
            setEstudiantes([]); // Lo mantenemos limpio como pediste
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
    };

    return (
        <div className="estudiantes-container">
            <div className="estudiantes-header">
                <h2>Gestión de Estudiantes</h2>
                <p>Directorio maestro de practicantes del Consultorio Jurídico.</p>
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
                        <label>CONSULTORIO</label>
                        <select name="consultorio" value={filtros.consultorio} onChange={handleFiltroChange}>
                            <option value="">Todos los niveles</option>
                            <option value="I">Consultorio I</option>
                            <option value="II">Consultorio II</option>
                            <option value="III">Consultorio III</option>
                            <option value="IV">Consultorio IV</option>
                        </select>
                    </div>

                    <div className="filtro-grupo">
                        <label>JORNADA</label>
                        <select name="jornada" value={filtros.jornada} onChange={handleFiltroChange}>
                            <option value="">Todas las jornadas</option>
                            <option value="diurna">Diurna</option>
                            <option value="nocturna">Nocturna</option>
                        </select>
                    </div>

                    <div className="filtro-grupo">
                        <label>PERÍODO</label>
                        <select name="periodo" value={filtros.periodo} onChange={handleFiltroChange}>
                            <option value="">Todos los periodos</option>
                            <option value="2026-I">2026-I</option>
                            <option value="2026-II">2026-II</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="estudiantes-table">
                    <thead>
                        <tr>
                            <th>NOMBRE COMPLETO</th>
                            <th>NIVEL</th>
                            <th>SEMESTRE</th>
                            <th>IDENTIFICACIÓN</th>
                            <th>F. NACIMIENTO</th>
                            <th>EPS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estudiantes.length > 0 ? (
                            estudiantes.map((est) => (
                                <tr key={est.id}>
                                    <td>
                                        <div className="estudiante-info">
                                            <div className="avatar-circle">{est.iniciales}</div>
                                            <div className="estudiante-detalles">
                                                <span className="nombre">{est.nombres} {est.apellidos}</span>
                                                <span className="email">{est.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-nivel">{est.nivel}</span></td>
                                    <td>{est.semestre}</td>
                                    <td>
                                        <div className="identificacion">
                                            <span className="tipo-doc">{est.tipoDoc}</span>
                                            <span className="num-doc">{est.documento}</span>
                                        </div>
                                    </td>
                                    <td>{est.fechaNacimiento}</td>
                                    <td><span className="badge badge-eps">{est.eps}</span></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center empty-state">
                                    No hay estudiantes registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EstudiantesInscriptos;