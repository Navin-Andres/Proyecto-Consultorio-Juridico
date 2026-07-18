import React, { useState, useEffect, useRef } from 'react';
import PeriodosManager from '../PeriodosManager/PeriodosManager';
import TurnosManager from '../TurnosManager/TurnosManager';
import EstudiantesInscriptos from '../EstudiantesInscriptos/EstudiantesInscriptos';
import AdminsManager from '../AdminsManager/AdminsManager';
import Sidebar from '../sidebar/Sidebar';
import InicioDashboard from '../InicioDashboard/InicioDashboard';
import Configuracion from '../Configuracion/Configuracion';
import { confirmCerrarSesion } from '../../../utils/swalAlerts';
import { getAdminRole, clearAdminSession } from '../../../utils/auth';
import API_URL from '../../../config/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('inicio');
    const [adminEmail, setAdminEmail] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const profileRef = useRef(null);
    const closeTimeout = useRef(null);
    const userRole = getAdminRole(); // 'admin' | 'superadmin'

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${API_URL}/api/admin/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setAdminEmail(data.email);
                }
            } catch (error) {
                console.error('Error fetching admin email:', error);
            }
        };

        fetchAdminProfile();
    }, []);

    // Cierra el menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setMenuOpen(false);
        const confirmed = await confirmCerrarSesion();
        if (!confirmed) return;

        clearAdminSession();
        window.location.href = '/login';
    };

    const handleGoToConfig = () => {
        setMenuOpen(false);
        setActiveTab('configuracion');
    };

    return (
        <div className="admin-dashboard-container">
            {/* Sidebar */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} userRole={userRole} />

            {/* Main Content Area */}
            <main className="admin-main-content">
                <header className="main-header">
                    <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                    <div
                        className="admin-profile"
                        ref={profileRef}
                        onMouseEnter={() => {
                            if (closeTimeout.current) clearTimeout(closeTimeout.current);
                            setMenuOpen(true);
                        }}
                        onMouseLeave={() => {
                            closeTimeout.current = setTimeout(() => setMenuOpen(false), 150);
                        }}
                    >
                        <span>{adminEmail || 'Administrador'}</span>
                        <div className="avatar">{adminEmail ? adminEmail.charAt(0).toUpperCase() : 'A'}</div>

                        {/* Dropdown Menu */}
                        <div className={`avatar-dropdown ${menuOpen ? 'avatar-dropdown--open' : ''}`}>
                            <button
                                className="avatar-dropdown__item"
                                onClick={handleGoToConfig}
                            >
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                </svg>
                                Configuración
                            </button>
                            <div className="avatar-dropdown__divider" />
                            <button
                                className="avatar-dropdown__item avatar-dropdown__item--danger"
                                onClick={handleLogout}
                            >
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </header>

                <section className="content-area">
                    {activeTab === 'inicio' && <InicioDashboard setActiveTab={setActiveTab} />}
                    {activeTab === 'estudiantes' && <EstudiantesInscriptos />}
                    {activeTab === 'turnos' && <TurnosManager />}
                    {activeTab === 'periodos' && <PeriodosManager />}
                    {activeTab === 'configuracion' && <Configuracion />}
                    {activeTab === 'historial' && <div>Historial de actividades.</div>}
                    {activeTab === 'admins' && userRole === 'superadmin' && <AdminsManager />}
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;

