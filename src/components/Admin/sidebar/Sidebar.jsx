import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <span className="logo-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3v17M12 20H8m4 0h4M3 7l9-2 9 2M6 7v4M18 7v4M6 11c0 2 1.5 3 3 3s3-1 3-3m0 0c0 2 1.5 3 3 3s3-1 3-3" />
                        </svg>
                    </span>
                    <div className="logo-text">
                        <h2>Consultorio Jurídico</h2>
                        <span>GESTIÓN ESTUDIANTIL</span>
                    </div>
                </div>
            </div>

            <nav className="sidebar-nav">
                <ul className="nav-list">
                    <li className={`nav-item ${activeTab === 'inicio' ? 'active' : ''}`} onClick={() => setActiveTab('inicio')}>
                        <span className="nav-icon">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7" />
                                <rect x="14" y="3" width="7" height="7" />
                                <rect x="14" y="14" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" />
                            </svg>
                        </span>
                        <span className="nav-label">Dashboard</span>
                    </li>
                    <li className={`nav-item ${activeTab === 'estudiantes' ? 'active' : ''}`} onClick={() => setActiveTab('estudiantes')}>
                        <span className="nav-icon">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </span>
                        <span className="nav-label">Estudiantes</span>
                    </li>
                    <li className={`nav-item ${activeTab === 'turnos' ? 'active' : ''}`} onClick={() => setActiveTab('turnos')}>
                        <span className="nav-icon">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 2v4" />
                                <path d="M16 2v4" />
                                <rect width="18" height="18" x="3" y="4" rx="2" />
                                <path d="M3 10h18" />
                                <path d="M16 14v4" />
                                <path d="M16 18h2" />
                                <circle cx="16" cy="18" r="4" />
                            </svg>
                        </span>
                        <span className="nav-label">Asignación de Turnos</span>
                    </li>
                    <li className={`nav-item ${activeTab === 'periodos' ? 'active' : ''}`} onClick={() => setActiveTab('periodos')}>
                        <span className="nav-icon">
                            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                <path d="M16 2v4" />
                                <path d="M8 2v4" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                                <path d="M8 16h8" />
                                <path d="M8 20h8" />
                            </svg>
                        </span>
                        <span className="nav-label">Periodos</span>
                    </li>
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={onLogout}>
                    <span className="nav-icon">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                        </svg>
                    </span>
                    <span className="nav-label">Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
