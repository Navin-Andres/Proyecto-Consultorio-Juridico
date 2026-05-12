import React, { useState } from 'react';
import './AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/admin/login', {
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
                alert(data.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('No se pudo conectar con el servidor');
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <div className="admin-logo-container">
                        <span className="admin-logo-icon">⚖️</span>
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
                            <span className="input-icon">👤</span>
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
                            <span className="input-icon">🔒</span>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                required
                            />
                            <button 
                                type="button" 
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '👁️' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="login-submit-btn">
                        Iniciar Sesión <span className="btn-icon">→</span>
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
