
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS trailerflix;
USE trailerflix;

-- Tabla de categorías: Define si es "Película" o "Serie"
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla de géneros: Almacena los géneros de cada contenido
CREATE TABLE generos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla de actores: Información sobre los actores principales
CREATE TABLE actores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla principal de contenido: Información sobre películas y series
CREATE TABLE contenido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    poster VARCHAR(255),
    titulo VARCHAR(255) NOT NULL,
    categoria_id INT, -- FK a categorías
    gen VARCHAR(50), -- Almacena el género principal
    busqueda TEXT, -- Keywords para búsquedas
    resumen TEXT,
    temporadas VARCHAR(10), -- Ej. "N/A" o número de temporadas
    trailer VARCHAR(255),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Tabla intermedia para relacionar contenido y actores (muchos a muchos)
CREATE TABLE contenido_actores (
    contenido_id INT,
    actor_id INT,
    PRIMARY KEY (contenido_id, actor_id),
    FOREIGN KEY (contenido_id) REFERENCES contenido(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES actores(id) ON DELETE CASCADE
);

-- Tabla intermedia para relacionar contenido y géneros (muchos a muchos)
CREATE TABLE contenido_generos (
    contenido_id INT,
    genero_id INT,
    PRIMARY KEY (contenido_id, genero_id),
    FOREIGN KEY (contenido_id) REFERENCES contenido(id) ON DELETE CASCADE,
    FOREIGN KEY (genero_id) REFERENCES generos(id) ON DELETE CASCADE
);