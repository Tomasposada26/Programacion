CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(200) NOT NULL,
    verificado BOOLEAN DEFAULT false,
    codigo_verificacion VARCHAR(10),
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
