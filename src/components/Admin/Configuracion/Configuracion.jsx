import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import API_URL from '../../../config/api';
import './Configuracion.css';

const Configuracion = () => {
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${API_URL}/api/admin/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setEmail(data.email);
                } else {
                    console.error('Error al obtener perfil');
                }
            } catch (error) {
                console.error('Error de red al obtener perfil:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword) {
            if (newPassword.length < 6) {
                Swal.fire({
                    title: 'Contraseña muy corta',
                    text: 'La nueva contraseña debe tener al menos 6 caracteres.',
                    icon: 'warning',
                    confirmButtonColor: '#7FB536',
                });
                return;
            }

            if (newPassword !== confirmPassword) {
                Swal.fire({
                    title: 'Contraseñas no coinciden',
                    text: 'La nueva contraseña y la confirmación no son iguales.',
                    icon: 'error',
                    confirmButtonColor: '#7FB536',
                });
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/api/admin/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email,
                    currentPassword,
                    newPassword: newPassword || undefined
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: '¡Configuración Guardada!',
                    text: 'El perfil administrativo ha sido actualizado.',
                    icon: 'success',
                    confirmButtonColor: '#7FB536',
                });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.message || 'No se pudo actualizar el perfil.',
                    icon: 'error',
                    confirmButtonColor: '#7FB536',
                });
            }
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            Swal.fire({
                title: 'Error de red',
                text: 'No se pudo conectar con el servidor.',
                icon: 'error',
                confirmButtonColor: '#7FB536',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="configuracion-container-vertical">
                <div className="configuracion-loading">
                    <div className="spinner"></div>
                    <span>Cargando configuración...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="configuracion-container-vertical">
            <div className="configuracion-card-vertical">
                <div className="card-header-vertical">
                    <h2>Configuración de Cuenta</h2>
                    <p>Actualiza tu dirección de correo institucional y contraseña de acceso.</p>
                </div>

                <form className="configuracion-form-vertical" onSubmit={handleSubmit}>
                    
                    {/* Correo Electrónico */}
                    <div className="form-group-vertical">
                        <label className="form-label-vertical">Correo Electrónico</label>
                        <div className="input-group-vertical">
                            <span className="input-icon-vertical">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </span>
                            <input
                                type="email"
                                className="form-input-vertical"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="correo@areandina.edu.co"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-divider-vertical" />

                    {/* Título Cambio de Contraseña */}
                    <div className="form-section-title-vertical">
                        <h3>Cambio de contraseña</h3>
                    </div>

                    {/* Contraseña Actual */}
                    <div className="form-group-vertical">
                        <label className="form-label-vertical highlight-label">Contraseña Actual (Obligatoria)</label>
                        <div className="input-group-vertical">
                            <span className="input-icon-vertical">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </span>
                            <input
                                type={showCurrent ? 'text' : 'password'}
                                className="form-input-vertical"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Confirme su contraseña actual para guardar"
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password-vertical"
                                onClick={() => setShowCurrent(!showCurrent)}
                            >
                                {showCurrent ? (
                                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Nueva Contraseña */}
                    <div className="form-group-vertical">
                        <label className="form-label-vertical">Nueva Contraseña</label>
                        <div className="input-group-vertical">
                            <span className="input-icon-vertical">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </span>
                            <input
                                type={showNew ? 'text' : 'password'}
                                className="form-input-vertical"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres (Dejar vacío para no cambiar)"
                            />
                            <button
                                type="button"
                                className="toggle-password-vertical"
                                onClick={() => setShowNew(!showNew)}
                            >
                                {showNew ? (
                                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirmar Nueva Contraseña */}
                    <div className="form-group-vertical">
                        <label className="form-label-vertical">Confirmar Contraseña</label>
                        <div className="input-group-vertical">
                            <span className="input-icon-vertical">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </span>
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                className="form-input-vertical"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repita la nueva contraseña"
                            />
                            <button
                                type="button"
                                className="toggle-password-vertical"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                {showConfirm ? (
                                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Botón de envío */}
                    <button
                        type="submit"
                        className="submit-btn-vertical-premium"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="btn-spinner-vertical"></span>
                                Guardando...
                            </>
                        ) : (
                            'Actualizar'
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default Configuracion;
