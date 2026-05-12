import React, { useState } from 'react';
import PeriodosManager from './PeriodosManager';
import TurnosManager from './TurnosManager';
import EstudiantesInscriptos from './EstudiantesInscriptos';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('inicio');

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin-login';
    };

    return (
        <div className="admin-dashboard-container">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <span className="logo-icon">⚖️</span>
                        <div className="logo-text">
                            <h2>Consultorio Jurídico</h2>
                            <span>GESTIÓN ESTUDIANTIL</span>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <ul className="nav-list">
                        <li className={`nav-item ${activeTab === 'inicio' ? 'active' : ''}`} onClick={() => setActiveTab('inicio')}>
                            <span className="nav-icon">📊</span>
                            <span className="nav-label">Inicio</span>
                        </li>
                        <li className={`nav-item ${activeTab === 'estudiantes' ? 'active' : ''}`} onClick={() => setActiveTab('estudiantes')}>
                            <span className="nav-icon">👥</span>
                            <span className="nav-label">Estudiantes</span>
                        </li>
                        <li className={`nav-item ${activeTab === 'turnos' ? 'active' : ''}`} onClick={() => setActiveTab('turnos')}>
                            <span className="nav-icon">📅</span>
                            <span className="nav-label">Turnos</span>
                        </li>
                        <li className={`nav-item ${activeTab === 'periodos' ? 'active' : ''}`} onClick={() => setActiveTab('periodos')}>
                            <span className="nav-icon">⏳</span>
                            <span className="nav-label">Periodos</span>
                        </li>
                        <li className={`nav-item ${activeTab === 'historial' ? 'active' : ''}`} onClick={() => setActiveTab('historial')}>
                            <span className="nav-icon">📋</span>
                            <span className="nav-label">Historial</span>
                        </li>
                        <li className={`nav-item ${activeTab === 'configuracion' ? 'active' : ''}`} onClick={() => setActiveTab('configuracion')}>
                            <span className="nav-icon">⚙️</span>
                            <span className="nav-label">Configuración</span>
                        </li>
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <span className="nav-icon">🚪</span>
                        <span className="nav-label">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main-content">
                <header className="main-header">
                    <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                    <div className="admin-profile">
                        <span>Administrador</span>
                        <div className="avatar">A</div>
                    </div>
                </header>
                
                <section className="content-area">
                    {activeTab === 'inicio' && <div>Bienvenido al panel de control.</div>}
                    {activeTab === 'estudiantes' && <EstudiantesInscriptos />}
                    {activeTab === 'turnos' && <TurnosManager />}
                    {activeTab === 'periodos' && <PeriodosManager />}
                    {activeTab === 'historial' && <div>Historial de actividades.</div>}
                    {activeTab === 'configuracion' && <div>Configuración del sistema.</div>}
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;
