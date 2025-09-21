# Backend — Aura (Instagram CMS)

Este backend implementa la API REST, lógica de negocio y persistencia de datos para Aura, el CMS de Instagram para Magneto.

## Funcionalidad principal
- Autenticación de usuarios (JWT)
- Gestión de cuentas de Instagram vinculadas
- Registro y escucha de interacciones (comentarios, likes, etc.)
- Reglas automáticas: creación, edición, duplicado, eliminación, activación/desactivación
- Notificaciones y respuestas automáticas vía chatbot
- Integración con MongoDB (Atlas o local)
- Servicios de correo (mailer)

## Estructura de carpetas
```
backend/
├── src/
│   ├── app.js           # Configuración principal Express
│   ├── config/          # Configuración de CORS, DB, mailer
│   ├── controllers/     # Lógica de endpoints (auth, reglas, cuentas, etc.)
│   ├── middlewares/     # Middlewares de autenticación y otros
│   ├── models/          # Modelos Mongoose (Usuario, Regla, Cuenta, etc.)
│   ├── routes/          # Definición de rutas Express
│   ├── services/        # Servicios auxiliares (mailer, mongo)
│   ├── utils/           # Utilidades y helpers
│   └── tests/           # Pruebas unitarias y de integración
├── package.json
├── .env.example
└── README.md
```

## Scripts principales
- `npm run dev` — Inicia el servidor en modo desarrollo (nodemon)
- `npm start` — Inicia el servidor en modo producción
- `npm test` — Ejecuta los tests


## Configuración
1. Crea un archivo `.env` y completa las variables:
   - `MONGODB_URI` — Cadena de conexión a MongoDB
   - `JWT_SECRET` — Secreto para JWT
   - `FRONTEND_URL` —
     - Para desarrollo local: `http://localhost:3000`
     - Para producción (Vercel): `https://programacion-tau.vercel.app`
   - Otros según servicios de correo

2. Instala dependencias:
   ```bash
   npm install
   ```


3. Ejecuta el backend (elige uno de los dos comandos):
   ```bash
   npm run dev   # (con autorecarga, si tienes nodemon)
   node index.js # (ejecución directa)
   ```

## Endpoints principales
- `/api/auth` — Registro, login, autenticación
- `/api/instagram-token` — Gestión de cuentas IG simuladas y reales
- `/api/reglas` — CRUD de reglas automáticas
- `/api/notificaciones` — Notificaciones y respuestas



## Despliegue

Este backend está desplegado en [Render](https://render.com/):
- **En local:** escucha en `http://localhost:4000`
- **En producción:** tu URL de Render, por ejemplo `https://programacion-gdr0.onrender.com`
Configura las variables de entorno (`MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, etc.) en el panel de Render.

---
Desarrollado para Magneto | Proyecto Aura

---
Desarrollado para Magneto | Proyecto Aura
