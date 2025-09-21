# Aura: Instagram CMS para Magneto

Aura es un sistema de gestión y automatización de interacciones de Instagram desarrollado para la empresa Magneto. Permite vincular múltiples cuentas de Instagram, escuchar las interacciones recibidas (comentarios, likes, etc.) y, en base a ellas, inicializar un chat automatizado con un chatbot que entrega información relevante sobre la publicación que recibió la interacción.

## Estructura del Proyecto

```
Programacion/
├── backend/   # API REST, lógica de negocio y base de datos
├── frontend/  # Interfaz de usuario (React)
```

## Funcionalidades principales
- Vinculación y gestión de múltiples cuentas de Instagram.
- Escucha y registro de interacciones en publicaciones.
- Reglas automáticas para responder o iniciar chats según la interacción.
- Panel de administración para visualizar cuentas, reglas y estadísticas.
- Chatbot integrado para responder a usuarios según reglas configuradas.

## Requisitos
- Node.js >= 16.x
- MongoDB Atlas o local

## Instalación y ejecución


## Despliegue en producción

- **Frontend:** Desplegado en [Vercel](https://vercel.com/). Acceso público: [https://programacion-tau.vercel.app/](https://programacion-tau.vercel.app/)
   - El código fuente está en la carpeta `frontend/` y se puede conectar automáticamente a Vercel para CI/CD.
- **Backend:** Desplegado en [Render](https://render.com/). El código fuente está en la carpeta `backend/` y Render gestiona el entorno Node.js y la conexión a MongoDB.

Para detalles de configuración de variables de entorno y dominios, consulta los README de cada carpeta.

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Tomasposada26/Programacion.git
   cd Programacion
   ```

2. Instala dependencias en backend y frontend:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. Configura variables de entorno:
   - En `backend/.env` define la conexión a MongoDB y el JWT_SECRET.
   - En `frontend/.env` define la URL del backend (`REACT_APP_API_URL`).


4. Ejecuta ambos servidores (en terminales separadas):
   ```bash
   # Backend (elige uno de los dos comandos)
   cd backend
   npm run dev      # (con autorecarga, si tienes nodemon)
   node index.js    # (ejecución directa)

   # Frontend
   cd ../frontend
   npm start
   ```

5. Accede a la app:
    - **En desarrollo:**
       - Frontend: [http://localhost:3000](http://localhost:3000) (ejecuta con `npm start` en la carpeta frontend)
       - Backend: [http://localhost:4000](http://localhost:4000) (ejecuta con `npm run dev` o `node index.js` en la carpeta backend)
    - **En producción:**
       - Frontend (Vercel): [https://programacion-tau.vercel.app/](https://programacion-tau.vercel.app/)
       - Backend (Render): [URL de tu backend en Render]

## Estructura de carpetas
- `backend/` — API, modelos, controladores, servicios, rutas, tests.
- `frontend/` — React app, componentes, hooks, assets, estilos, tests.

## Documentación adicional
- Consulta los README.md de `backend/` y `frontend/` para detalles específicos de cada parte.

---
Desarrollado para Magneto | Proyecto Aura
