import { useState } from 'react';

const mapAreaInteres = (area) => {
    if (!area || area === 'N/A') return 'N/A';
    const mappings = {
        'penal': 'Penal',
        'publico': 'Público',
        'privado': 'Privado',
        'familia': 'Familia',
        'animal': 'Animal',
        'laboral': 'Laboral',
        'ddhh': 'Derechos Humanos (DDHH)',
        'agrario': 'Agrario',
        'investigacion': 'Investigación',
        'consumo': 'Consumo',
        'conciliacion_penal': 'Conciliación Penal',
        'asistencia_legal': 'Asistencia Legal',
        'purpura': 'Púrpura',
        'tierra': 'Tierra'
    };
    return mappings[area.toLowerCase()] || area.charAt(0).toUpperCase() + area.slice(1);
};

const FichaEstudiante = ({ selectedEstudiante, onBack, onQuitar }) => {
    const [quitarLoading, setQuitarLoading] = useState(false);

    const handleQuitarClick = async () => {
        if (!onQuitar) return;

        setQuitarLoading(true);
        try {
            const nombre = `${selectedEstudiante.nombres || ''} ${selectedEstudiante.apellidos || ''}`.trim();
            await onQuitar(selectedEstudiante.id, nombre);
        } finally {
            setQuitarLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        const generatePDF = () => {
            const element = document.getElementById('estudiante-ficha-pdf');
            if (!element) return;

            const filename = `Ficha_Estudiante_${selectedEstudiante.documento || selectedEstudiante.id || 'sin-id'}.pdf`;
            const opt = {
                margin: 0.8,
                filename,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollY: 0 },
                jsPDF: { unit: 'cm', format: 'letter', orientation: 'portrait' }
            };

            window.html2pdf().set(opt).from(element).save();
        };

        if (window.html2pdf) {
            generatePDF();
        } else {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
            script.onload = generatePDF;
            document.body.appendChild(script);
        }
    };

    return (
        <div className="ficha-wrapper" id="estudiante-ficha-pdf">
            <div className="ficha-header-bar">
                <button className="btn-back" onClick={onBack}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Volver al directorio
                </button>
                <h2 className="ficha-title">Ficha del Estudiante</h2>
                <div className="ficha-action-group">
                    <button
                        className="btn-delete"
                        onClick={handleQuitarClick}
                        disabled={quitarLoading}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                            <path d="M10 11v6"></path>
                            <path d="M14 11v6"></path>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                        </svg>
                        {quitarLoading ? 'Quitando...' : 'Quitar estudiante'}
                    </button>
                    <button className="btn-export-pdf" onClick={handleDownloadPDF}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Exportar PDF
                    </button>
                </div>
            </div>

            <div className="ficha-profile-banner">
                <div className="ficha-avatar">{selectedEstudiante.iniciales}</div>
                <div className="ficha-profile-info">
                    <h3 className="ficha-profile-name">{selectedEstudiante.nombres} {selectedEstudiante.apellidos}</h3>
                    <div className="ficha-profile-meta">
                        <span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            {selectedEstudiante.correoInstitucional !== 'N/A' ? selectedEstudiante.correoInstitucional : selectedEstudiante.email}
                        </span>
                        <span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            {selectedEstudiante.telefono || 'Sin teléfono'}
                        </span>
                        <span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            Inscrito el: {selectedEstudiante.fechaRegistro || 'N/A'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="ficha-rows">
                <div className="ficha-card ficha-card--turno">
                    <div className="ficha-card-header">
                        <div className="ficha-card-icon ficha-card-icon--turno">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        </div>
                        <h4 className="ficha-card-title">Práctica Asignada</h4>
                    </div>
                    <div className="ficha-turno-box">
                        <div className="ficha-turno-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        </div>
                        <div className="ficha-turno-details">
                            <span className="ficha-turno-day">{selectedEstudiante.turnoObj?.dia || 'Sin asignar'}</span>
                            {selectedEstudiante.turnoObj?.detalle && (
                                <span className="ficha-turno-desc">{selectedEstudiante.turnoObj.detalle}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="ficha-card">
                    <div className="ficha-card-header">
                        <div className="ficha-card-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                        </div>
                        <h4 className="ficha-card-title">Información Académica</h4>
                    </div>
                    <div className="ficha-data-grid ficha-data-grid--4col">
                        <div className="ficha-data-item">
                            <span className="ficha-label">Consultorio</span>
                            <span className="ficha-value"><span className="badge badge-nivel">{selectedEstudiante.nivel}</span></span>
                        </div>
                        <div className="ficha-data-item">
                            <span className="ficha-label">Semestre</span>
                            <span className="ficha-value">{selectedEstudiante.semestre}° Semestre</span>
                        </div>
                        <div className="ficha-data-item">
                            <span className="ficha-label">Consultorios en Sede</span>
                            <span className="ficha-value">{selectedEstudiante.consultoriosRealizados}</span>
                        </div>
                        <div className="ficha-data-item">
                            <span className="ficha-label">Consultorios Externos</span>
                            <span className="ficha-value">{selectedEstudiante.consultorioExterno}</span>
                        </div>
                        <div className="ficha-data-item">
                            <span className="ficha-label">Jornada Asignaturas</span>
                            <span className="ficha-value" style={{ textTransform: 'capitalize' }}>{selectedEstudiante.jornadaAsignaturas}</span>
                        </div>
                        <div className="ficha-data-item">
                            <span className="ficha-label">Período Académico</span>
                            <span className="ficha-value">{selectedEstudiante.periodo || 'N/A'}</span>
                        </div>
                        <div className="ficha-data-item full">
                            <span className="ficha-label">Área de Interés</span>
                            <span className="ficha-value">{mapAreaInteres(selectedEstudiante.areaInteres)}</span>
                        </div>
                        <div className="ficha-data-item full">
                            <span className="ficha-label">Consecutivos (Radicados)</span>
                            <span className="ficha-value" style={{ whiteSpace: 'pre-line' }}>{selectedEstudiante.radicados || 'Ninguno'}</span>
                        </div>
                    </div>
                </div>

                <div className="ficha-card">
                    <div className="ficha-card-header">
                        <div className="ficha-card-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </div>
                        <h4 className="ficha-card-title">Datos Personales</h4>
                    </div>
                    <div className="ficha-data-grid ficha-data-grid--4col">
                        <div className="ficha-data-item">
                            <span className="ficha-label">Tipo Documento</span>
                            <span className="ficha-value">{selectedEstudiante.tipoDoc}</span>
                        </div>
                        <div className="ficha-data-item">
                            <span className="ficha-label">Nro. de Documento</span>
                            <span className="ficha-value">{selectedEstudiante.documento}</span>
                        </div>
                        <div className="ficha-data-item">
                            <span className="ficha-label">Fecha Nacimiento</span>
                            <span className="ficha-value">{selectedEstudiante.fechaNacimiento}</span>
                        </div>
                        <div className="ficha-data-item">
                            <span className="ficha-label">Salud (EPS)</span>
                            <span className="ficha-value">{selectedEstudiante.eps}</span>
                        </div>
                    </div>
                </div>

                <div className="ficha-card">
                    <div className="ficha-card-header">
                        <div className="ficha-card-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        </div>
                        <h4 className="ficha-card-title">Contacto y Ubicación</h4>
                    </div>
                    <div className="ficha-data-grid ficha-data-grid--4col">
                        <div className="ficha-data-item">
                            <span className="ficha-label">Teléfono Celular</span>
                            <span className="ficha-value">{selectedEstudiante.telefono || 'N/A'}</span>
                        </div>
                        <div className="ficha-data-item">
                            <span className="ficha-label">Municipio / Depto.</span>
                            <span className="ficha-value">{selectedEstudiante.municipio_depto}</span>
                        </div>
                        <div className="ficha-data-item full">
                            <span className="ficha-label">Correo Institucional</span>
                            <span className="ficha-value">{selectedEstudiante.correoInstitucional || 'N/A'}</span>
                        </div>
                        <div className="ficha-data-item full">
                            <span className="ficha-label">Correo Personal</span>
                            <span className="ficha-value">{selectedEstudiante.email || 'N/A'}</span>
                        </div>
                        <div className="ficha-data-item full">
                            <span className="ficha-label">Dirección de Residencia</span>
                            <span className="ficha-value">{selectedEstudiante.residencia}</span>
                        </div>
                    </div>
                </div>

                <div className="ficha-card">
                    <div className="ficha-card-header">
                        <div className="ficha-card-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                        </div>
                        <h4 className="ficha-card-title">Información Laboral</h4>
                    </div>
                    <div className="ficha-data-grid ficha-data-grid--4col">
                        <div className="ficha-data-item">
                            <span className="ficha-label">¿Trabaja?</span>
                            <span className="ficha-value">{selectedEstudiante.trabaja || 'No'}</span>
                        </div>
                        <div className="ficha-data-item">
                            <span className="ficha-label">Empresa</span>
                            <span className="ficha-value">{selectedEstudiante.empresa || 'N/A'}</span>
                        </div>
                        <div className="ficha-data-item">
                            <span className="ficha-label">Cargo</span>
                            <span className="ficha-value">{selectedEstudiante.cargo || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="ficha-card">
                    <div className="ficha-card-header">
                        <div className="ficha-card-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        </div>
                        <h4 className="ficha-card-title">Observaciones Personales</h4>
                    </div>
                    <div className="ficha-observaciones-box">
                        {selectedEstudiante.observacionesPersonales?.trim() ? (
                            <p className="ficha-observaciones-text">{selectedEstudiante.observacionesPersonales}</p>
                        ) : (
                            <p className="ficha-observaciones-empty">El estudiante no registró observaciones adicionales.</p>
                        )}
                    </div>
                </div>

                <div className="ficha-card ficha-card--documents">
                    <div className="ficha-card-header">
                        <div className="ficha-card-icon ficha-card-icon--docs">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </div>
                        <h4 className="ficha-card-title">Documentación Anexa</h4>
                    </div>

                    {selectedEstudiante.anexos && selectedEstudiante.anexos.length > 0 ? (
                        <div className="drawer-anexos-list ficha-anexos-grid">
                            {selectedEstudiante.anexos.map((a, i) => (
                                <div className="drawer-anexo-item" key={i}>
                                    <div className="anexo-file-icon">📄</div>
                                    <div className="anexo-file-info">
                                        <span className="anexo-file-title">{a.tipo}</span>
                                        <span className="anexo-file-subtitle">Archivo cargado</span>
                                    </div>
                                    <a
                                        href={`http://localhost:5000/${a.ruta.replace(/\\\\/g, '/')}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn-download-anexo"
                                        title="Ver archivo"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="drawer-no-anexos">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                            <span>No se han cargado documentos para este estudiante.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FichaEstudiante;
