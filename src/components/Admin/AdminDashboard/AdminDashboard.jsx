import React, { useState } from 'react';
import PeriodosManager from '../PeriodosManager/PeriodosManager';
import TurnosManager from '../TurnosManager/TurnosManager';
import EstudiantesInscriptos from '../EstudiantesInscriptos/EstudiantesInscriptos';
import Sidebar from '../sidebar/Sidebar';
import InicioDashboard from '../InicioDashboard/InicioDashboard';
import { confirmCerrarSesion } from '../../../utils/swalAlerts';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('inicio');

    const handleLogout = async () => {
        const confirmed = await confirmCerrarSesion();
        if (!confirmed) return;

        localStorage.removeItem('adminToken');
        window.location.href = '/admin-login';
    };

    return (
        <div className="admin-dashboard-container">
            {/* Sidebar */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

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
                    {activeTab === 'inicio' && <InicioDashboard setActiveTab={setActiveTab} />}
                    {activeTab === 'estudiantes' && <EstudiantesInscriptos />}
                    {activeTab === 'turnos' && <TurnosManager />}
                    {activeTab === 'periodos' && <PeriodosManager />}
                    {activeTab === 'historial' && <div>Historial de actividades.</div>}
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;
