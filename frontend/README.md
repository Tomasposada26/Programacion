# Frontend — Aura (Instagram CMS)

Este frontend es la interfaz de usuario de Aura, el CMS de Instagram para Magneto. Permite a los usuarios gestionar cuentas, reglas, notificaciones y visualizar estadísticas de interacciones.

## Funcionalidad principal
- Login y autenticación de usuarios
- Vinculación y gestión de múltiples cuentas de Instagram
- Visualización y gestión de reglas automáticas
- Panel de notificaciones y respuestas automáticas
- Dashboard de tendencias y estadísticas
- Chatbot integrado para responder a interacciones
- UI moderna y responsiva (React)

## Estructura de carpetas
```
frontend/
├── public/            # Archivos estáticos y HTML base
├── src/
│   ├── assets/        # Imágenes, íconos y recursos gráficos
│   ├── components/    # Componentes reutilizables (tablas, modales, etc.)
│   ├── hooks/         # Custom hooks de React
│   ├── legal/         # Páginas legales (privacidad, términos)
│   ├── modals/        # Modales de autenticación, perfil, ayuda
│   ├── panels/        # Paneles principales (Cuentas, Dashboard, Respuestas, etc.)
│   ├── services/      # Servicios de API y helpers
│   ├── styles/        # Estilos globales y específicos
│   ├── tests/         # Pruebas unitarias y de integración
│   └── utils/         # Utilidades varias
├── package.json
├── .env.example
└── README.md
```

## Scripts principales
- `npm start` — Inicia la app en modo desarrollo
- `npm run build` — Compila la app para producción
- `npm test` — Ejecuta los tests


## Configuración
1. Crea un archivo `.env` y define la URL del backend:
	- `REACT_APP_API_URL` —
	  - Para desarrollo local: `http://localhost:4000`
	  - Para producción (Render): `https://programacion-gdr0.onrender.com`

2. Instala dependencias:
	```bash
	npm install
	```

3. Ejecuta el frontend:
	```bash
	npm start
	```

- El frontend consume la API protegida por JWT, por lo que requiere login.
- Permite gestionar cuentas, reglas y ver notificaciones en tiempo real.
- El diseño es adaptable y pensado para equipos de Magneto.


## Despliegue

Este frontend está desplegado en [Vercel](https://vercel.com/):
- **En local:** escucha en `http://localhost:3000`
- **En producción:** [https://programacion-tau.vercel.app/](https://programacion-tau.vercel.app/)
Configura la variable de entorno `REACT_APP_API_URL` con la URL pública del backend desplegado en Render.

---
Desarrollado para Magneto | Proyecto Aura
- El frontend consume la API protegida por JWT, por lo que requiere login.
- Permite gestionar cuentas, reglas y ver notificaciones en tiempo real.
- El diseño es adaptable y pensado para equipos de Magneto.

---
Desarrollado para Magneto | Proyecto Aura

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
