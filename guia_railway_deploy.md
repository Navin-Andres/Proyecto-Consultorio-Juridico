# 🚀 Guía de Despliegue en Railway — Consultorio Jurídico

## Arquitectura en Railway

Tu proyecto se divide en **3 servicios separados** dentro de Railway:

```
Railway Project: consultorio-juridico
├── 🐘 PostgreSQL        (base de datos — ya lo tienes en Railway)
├── ⚙️  Backend Service   (Node.js/Express — carpeta /consultorio-juridico-backend)
└── 🌐 Frontend Service  (React/Vite — carpeta raíz /)
```

> [!IMPORTANT]
> Ya tienes la `DATABASE_URL` de Railway en tu `.env` (`kodama.proxy.rlwy.net:16283/railway`), lo que significa que la BD de Railway ya está creada. ¡Eso es un buen avance!

---

## ⚠️ Cambios de Código OBLIGATORIOS antes de desplegar

### 1. Backend — Arreglar el puerto en `server.js`

El puerto `5000` está hardcodeado. Railway asigna el puerto dinámicamente vía la variable `PORT`.

**Archivo:** [server.js](file:///c:/Users/USUARIO/Videos/proyecto-juridico/consultorio-juridico-backend/server.js#L26-L27)

```diff
- const PORT = 5000;
- app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
+ const PORT = process.env.PORT || 5000;
+ app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
```

### 2. Backend — Usar `DATABASE_URL` en `db.js`

Railway provee una `DATABASE_URL` completa. Tu `db.js` usa variables separadas que no estarán en producción.

**Archivo:** [db.js](file:///c:/Users/USUARIO/Videos/proyecto-juridico/consultorio-juridico-backend/config/db.js)

```diff
  const { Pool } = require('pg');
  require('dotenv').config();
  
- const pool = new Pool({
-   user: process.env.DB_USER,
-   host: process.env.DB_HOST,
-   database: process.env.DB_NAME,
-   password: process.env.DB_PASSWORD,
-   port: process.env.DB_PORT,
- });
+ const pool = new Pool({
+   connectionString: process.env.DATABASE_URL,
+   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
+ });
  
  module.exports = pool;
```

### 3. Backend — Arreglar el `start` script en `package.json`

El script apunta a `index.js` pero tu archivo se llama `server.js`.

**Archivo:** [package.json](file:///c:/Users/USUARIO/Videos/proyecto-juridico/consultorio-juridico-backend/package.json#L6)

```diff
- "start": "node index.js",
+ "start": "node server.js",
```

### 4. Backend — Configurar CORS para producción

En `server.js`, el CORS abierto (`cors()`) puede causar problemas. Debes apuntar al dominio del frontend.

**Archivo:** [server.js](file:///c:/Users/USUARIO/Videos/proyecto-juridico/consultorio-juridico-backend/server.js#L15)

```diff
- app.use(cors());
+ app.use(cors({
+   origin: process.env.FRONTEND_URL || '*',
+   credentials: true
+ }));
```

### 5. Frontend — Configurar la URL del backend

En tus componentes React, las llamadas al backend deben apuntar a la URL de Railway, no a `localhost`. Usa una variable de entorno de Vite:

Crea el archivo `.env` en la raíz del frontend (junto al `package.json` raíz):

```env
VITE_API_URL=https://TU-BACKEND.railway.app
```

Y en tu código React, reemplaza cualquier `http://localhost:5000` por:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### 6. Frontend — Script de inicio para Railway

Railway necesita un comando para servir el build estático. Agrega esto al `package.json` raíz:

**Archivo:** [package.json](file:///c:/Users/USUARIO/Videos/proyecto-juridico/package.json#L6-L10)

```diff
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
-   "preview": "vite preview"
+   "preview": "vite preview",
+   "start": "serve -s dist -l $PORT"
  },
```

---

## 📋 Pasos de Despliegue en Railway

### Paso 1 — Verifica que el código esté en GitHub

Railway despliega directamente desde GitHub. Asegúrate de que tu repositorio esté actualizado:

```bash
git add .
git commit -m "fix: configurar para produccion en Railway"
git push origin main
```

> [!WARNING]
> Verifica que `.env` esté en tu `.gitignore` (✅ ya lo está). Nunca subas credenciales a GitHub.

---

### Paso 2 — Configurar el Servicio Backend en Railway

1. Ve a [railway.app](https://railway.app) → tu proyecto
2. Crea un **New Service → GitHub Repo**
3. Selecciona tu repositorio
4. En la configuración del servicio:
   - **Root Directory:** `consultorio-juridico-backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

5. Ve a la pestaña **Variables** y agrega:

| Variable | Valor |
|----------|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | *(clic en "Reference" → selecciona tu BD de Railway)* |
| `JWT_SECRET` | `areandina_2024_secret_key_99` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `nbalmaceda@estudiantes.areandina.edu.co` |
| `SMTP_PASS` | `yrwu hhbu icuv jtvn` |
| `SMTP_FROM` | `nbalmaceda@estudiantes.areandina.edu.co` |
| `SMTP_FROM_NAME` | `Consultorio Jurídico` |
| `FRONTEND_URL` | *(la URL de tu frontend — la obtienes después del deploy del frontend)* |

6. Haz clic en **Generate Domain** para obtener la URL del backend (ej: `https://consultorio-backend-prod.railway.app`)

---

### Paso 3 — Configurar el Servicio Frontend en Railway

1. Crea otro **New Service → GitHub Repo** (mismo repositorio)
2. En la configuración:
   - **Root Directory:** `/` (raíz del repo)
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

3. Ve a **Variables** y agrega:

| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | `https://TU-BACKEND.railway.app` (la URL del Paso 2) |
| `PORT` | `3000` |

4. Haz clic en **Generate Domain** para obtener la URL del frontend

5. Vuelve al backend y actualiza `FRONTEND_URL` con la URL del frontend.

---

### Paso 4 — Verificar la Base de Datos

Ya tienes `DATABASE_URL` en tu `.env` local apuntando a Railway. Debes:

1. Ir al servicio PostgreSQL en Railway
2. Ir a **Data** → verificar que tus tablas existan
3. Si necesitas importar la estructura, usa el archivo `BD.txt` que tienes en la raíz:

```bash
# Desde tu máquina local, importar el esquema
psql "postgresql://postgres:xCsNlggkFeafUOOJgvKrNAEpEFLSrZBt@kodama.proxy.rlwy.net:16283/railway" -f BD.txt
```

---

## 🔍 Verificación Post-Deploy

Después de desplegar, verifica estos puntos:

- [ ] Backend responde en `https://tu-backend.railway.app/api/admin` (debe dar 404 o respuesta JSON, no error de red)
- [ ] Frontend carga en `https://tu-frontend.railway.app`
- [ ] El login funciona (prueba credenciales)
- [ ] Las tablas existen en la BD de Railway
- [ ] Los uploads de archivos funcionan (revisa si necesitas persistencia — Railway es efímero)

> [!CAUTION]
> **Archivos subidos (uploads/):** Railway tiene **almacenamiento efímero** — los archivos que suban los usuarios se perderán al redesplegar. Para producción real, considera mover los uploads a un servicio como **Cloudinary** o **AWS S3**.

---

## 📁 Resumen de archivos a modificar

| Archivo | Cambio |
|---------|--------|
| [server.js](file:///c:/Users/USUARIO/Videos/proyecto-juridico/consultorio-juridico-backend/server.js) | Puerto dinámico + CORS con variable |
| [db.js](file:///c:/Users/USUARIO/Videos/proyecto-juridico/consultorio-juridico-backend/config/db.js) | Usar `DATABASE_URL` con SSL |
| [backend/package.json](file:///c:/Users/USUARIO/Videos/proyecto-juridico/consultorio-juridico-backend/package.json) | `start` apunta a `server.js` |
| [frontend/package.json](file:///c:/Users/USUARIO/Videos/proyecto-juridico/package.json) | Agregar script `start` con `serve` |
