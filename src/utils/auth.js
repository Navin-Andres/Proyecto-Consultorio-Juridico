/**
 * Helpers de autenticación y roles para el panel administrativo.
 */

/** Devuelve el token almacenado o null */
export const getAdminToken = () => localStorage.getItem('adminToken');

/** Devuelve el rol del usuario autenticado ('admin' | 'superadmin' | null) */
export const getAdminRole = () => localStorage.getItem('adminRole');

/** Retorna true si el usuario autenticado es superadmin */
export const isSuperAdmin = () => getAdminRole() === 'superadmin';

/** Limpia la sesión del administrador del localStorage */
export const clearAdminSession = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminRole');
};
