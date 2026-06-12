// Configuración central de la URL del backend
// En producción (Railway), usa VITE_API_URL. En local, usa localhost:5000
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_URL;
