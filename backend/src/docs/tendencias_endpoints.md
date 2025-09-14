# Endpoints de tendencias laborales (Aura Backend)

## GET /api/tendencias/hashtags
- Devuelve hashtags de empleo y su conteo.
- Query params opcionales: `desde`, `hasta` (YYYY-MM-DD)
- Ejemplo de respuesta:
```
[
  { "hashtag": "#empleo", "count": 120, "fecha": "2025-09-12T00:00:00.000Z" },
  ...
]
```

## GET /api/tendencias/ofertas-por-dia
- Devuelve número de ofertas publicadas por día.
- Query params: `desde`, `hasta`
- Ejemplo:
```
[
  { "fecha": "2025-09-06T00:00:00.000Z", "total": 1 },
  ...
]
```

## GET /api/tendencias/sectores
- Devuelve distribución de ofertas por sector profesional.
- Query params: `desde`, `hasta`
- Ejemplo:
```
[
  { "sector": "Tecnología", "count": 3, "fecha": "2025-09-12T00:00:00.000Z" },
  ...
]
```

## GET /api/tendencias/ciudades
- Devuelve distribución de ofertas por ciudad.
- Query params: `desde`, `hasta`
- Ejemplo:
```
[
  { "ciudad": "Bogotá", "count": 2, "fecha": "2025-09-12T00:00:00.000Z" },
  ...
]
```

## POST /api/tendencias/mock
- Poblado rápido de datos de prueba para desarrollo.
- No requiere body.
- Respuesta: `{ ok: true }`

---

Todos los endpoints soportan filtros por fecha. Los datos de ejemplo se pueden poblar usando el endpoint `/api/tendencias/mock`.
