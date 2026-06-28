import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './AdminLogin.css';
import API_URL from '../../../config/api';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Guardar token y redirigir
                localStorage.setItem('adminToken', data.token);
                window.location.href = '/admin-dashboard'; // O la ruta que prefieras
            } else {
                Swal.fire({
                    title: 'Acceso Denegado',
                    text: data.message || 'Credenciales inválidas',
                    icon: 'error',
                    confirmButtonColor: '#7FB536',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error de Conexión',
                text: 'No se pudo conectar con el servidor',
                icon: 'error',
                confirmButtonColor: '#7FB536',
            });
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <div className="admin-logo-container">
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-svg">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="10" y1="19" x2="14" y2="19" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="5" y1="7" x2="19" y2="7" />
                            <line x1="5" y1="7" x2="2" y2="13" />
                            <line x1="5" y1="7" x2="8" y2="13" />
                            <path d="M2 13h6a3 3 0 0 1-6 0z" fill="currentColor" fillOpacity="0.25" />
                            <line x1="19" y1="7" x2="16" y2="13" />
                            <line x1="19" y1="7" x2="22" y2="13" />
                            <path d="M16 13h6a3 3 0 0 1-6 0z" fill="currentColor" fillOpacity="0.25" />
                        </svg>
                    </div>
                </div>

                <h1 className="admin-login-title">Acceso Administrativo</h1>
                <p className="admin-login-subtitle">
                    Ingrese sus credenciales para gestionar el sistema
                </p>

                <form className="admin-login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">USUARIO O CORREO INSTITUCIONAL</label>
                        <div className="input-with-icon">
                            <span className="input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <input
                                type="email"
                                placeholder="ejemplo@areandina.edu.co"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="form-label-row">
                            <label className="form-label">CONTRASEÑA</label>
                            <a href="#" className="forgot-password-link">¿OLVIDÓ SU CLAVE?</a>
                        </div>
                        <div className="input-with-icon">
                            <span className="input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input form-input-password"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="login-submit-btn">
                        Iniciar Sesión
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-icon-svg">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                    </button>
                </form>

                <footer className="admin-login-footer">
                    <p>
                        Este es un sistema restringido para uso administrativo del Consultorio Jurídico Areandina.
                        El acceso no autorizado será monitoreado y reportado.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default AdminLogin;
