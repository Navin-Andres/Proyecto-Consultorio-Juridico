import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import API_URL from '../../../config/api';
import { getAdminToken } from '../../../utils/auth';
import './AdminsManager.css';

const AdminsManager = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null); // null = crear, objeto = editar
    const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'admin' });
    const [saving, setSaving] = useState(false);

    const token = getAdminToken();
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

    // ── Cargar lista ────────────────────────────────────────────
    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/admins`, { headers });
            if (!res.ok) throw new Error('Error al cargar');
            const data = await res.json();
            setAdmins(data);
        } catch {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar la lista de administradores.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAdmins(); }, []);

    // ── Abrir modal ─────────────────────────────────────────────
    const openCreate = () => {
        setEditingAdmin(null);
        setForm({ nombre: '', email: '', password: '', rol: 'admin' });
        setShowModal(true);
    };

    const openEdit = (admin) => {
        setEditingAdmin(admin);
        setForm({ nombre: admin.nombre, email: admin.email, password: '', rol: admin.rol });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingAdmin(null);
    };

    // ── Guardar (crear o editar) ─────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editingAdmin
                ? `${API_URL}/api/admins/${editingAdmin.id}`
                : `${API_URL}/api/admins`;
            const method = editingAdmin ? 'PUT' : 'POST';

            // Si es edición y la contraseña está vacía, no la enviamos
            const body = { ...form };
            if (editingAdmin && !body.password) delete body.password;

            const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
            const data = await res.json();

            if (!res.ok) {
                Swal.fire({ icon: 'error', title: 'Error', text: data.message || 'Ocurrió un error.' });
                return;
            }

            Swal.fire({
                icon: 'success',
                title: editingAdmin ? 'Administrador actualizado' : 'Administrador creado',
                text: `${data.nombre} (${data.email}) — ${data.rol}`,
                timer: 2000,
                showConfirmButton: false,
            });
            closeModal();
            fetchAdmins();
        } catch {
            Swal.fire({ icon: 'error', title: 'Error de conexión', text: 'No se pudo conectar con el servidor.' });
        } finally {
            setSaving(false);
        }
    };

    // ── Eliminar ────────────────────────────────────────────────
    const handleDelete = async (admin) => {
        const result = await Swal.fire({
            title: '¿Eliminar administrador?',
            html: `Se eliminará a <strong>${admin.nombre}</strong> (${admin.email}) del sistema.<br/>Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch(`${API_URL}/api/admins/${admin.id}`, { method: 'DELETE', headers });
            const data = await res.json();
            if (!res.ok) {
                Swal.fire({ icon: 'error', title: 'Error', text: data.message });
                return;
            }
            Swal.fire({ icon: 'success', title: 'Eliminado', text: data.message, timer: 1800, showConfirmButton: false });
            fetchAdmins();
        } catch {
            Swal.fire({ icon: 'error', title: 'Error de conexión', text: 'No se pudo conectar con el servidor.' });
        }
    };

    // ── Helpers de formato ──────────────────────────────────────
    const formatDate = (isoStr) => {
        if (!isoStr) return '—';
        return new Date(isoStr).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="am-container">
            {/* Header */}
            <div className="am-header">
                <div>
                    <h2 className="am-title">Gestión de Administradores</h2>
                    <p className="am-subtitle">Crea, edita y elimina cuentas de administrador del sistema.</p>
                </div>
                <button className="am-btn-primary" onClick={openCreate}>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Crear Administrador
                </button>
            </div>

            {/* Tabla */}
            <div className="am-card">
                {loading ? (
                    <div className="am-loading">
                        <div className="am-spinner" />
                        <span>Cargando administradores...</span>
                    </div>
                ) : admins.length === 0 ? (
                    <div className="am-empty">
                        <svg viewBox="0 0 24 24" width="40" height="40" stroke="#9ca3af" strokeWidth="1.5" fill="none">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                        </svg>
                        <p>No hay administradores registrados.</p>
                    </div>
                ) : (
                    <table className="am-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Creado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin) => (
                                <tr key={admin.id}>
                                    <td className="am-td-name">{admin.nombre}</td>
                                    <td className="am-td-email">{admin.email}</td>
                                    <td>
                                        <span className={`am-role-badge ${admin.rol === 'superadmin' ? 'am-role-badge--super' : 'am-role-badge--admin'}`}>
                                            {admin.rol === 'superadmin' ? '★ Superadmin' : 'Admin'}
                                        </span>
                                    </td>
                                    <td className="am-td-date">{formatDate(admin.created_at)}</td>
                                    <td className="am-td-actions">
                                        <button className="am-btn-icon am-btn-edit" onClick={() => openEdit(admin)} title="Editar">
                                            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                            Editar
                                        </button>
                                        <button className="am-btn-icon am-btn-delete" onClick={() => handleDelete(admin)} title="Eliminar">
                                            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                <path d="M10 11v6M14 11v6" />
                                                <path d="M9 6V4h6v2" />
                                            </svg>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal Crear/Editar */}
            {showModal && (
                <div className="am-modal-overlay" onClick={closeModal}>
                    <div className="am-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="am-modal-header">
                            <h3>{editingAdmin ? 'Editar Administrador' : 'Crear Administrador'}</h3>
                            <button className="am-modal-close" onClick={closeModal}>
                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <form className="am-modal-form" onSubmit={handleSubmit}>
                            <div className="am-form-group">
                                <label>Nombre completo</label>
                                <input
                                    type="text"
                                    placeholder="Ej: María García"
                                    value={form.nombre}
                                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="am-form-group">
                                <label>Correo electrónico</label>
                                <input
                                    type="email"
                                    placeholder="correo@areandina.edu.co"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="am-form-group">
                                <label>
                                    {editingAdmin ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
                                </label>
                                <input
                                    type="password"
                                    placeholder={editingAdmin ? '••••••••' : 'Mínimo 6 caracteres'}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    minLength={form.password ? 6 : undefined}
                                    required={!editingAdmin}
                                />
                            </div>
                            <div className="am-form-group">
                                <label>Rol</label>
                                <select
                                    value={form.rol}
                                    onChange={(e) => setForm({ ...form, rol: e.target.value })}
                                >
                                    <option value="admin">Admin — Gestiona estudiantes, turnos y períodos</option>
                                    <option value="superadmin">Superadmin — Acceso total</option>
                                </select>
                            </div>

                            <div className="am-modal-actions">
                                <button type="button" className="am-btn-secondary" onClick={closeModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="am-btn-primary" disabled={saving}>
                                    {saving ? 'Guardando...' : editingAdmin ? 'Guardar cambios' : 'Crear administrador'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminsManager;
