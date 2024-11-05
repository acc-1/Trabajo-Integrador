const { sequelize } = require('../conexion/database');
const { Contenido, Actor, Genero, Categoria } = require('../models/relaciones'); 
const { Op } = require("sequelize");

// Obtener todos los contenidos

exports.getAllContent = async (req, res) => {
    try {
        const contenidos = await Contenido.findAll({
            include: [
                {
                    model: Actor,
                    through: { attributes: [] },
                    required: false
                },
                {
                    model: Genero,
                    through: { attributes: [] },
                    required: false
                },
                {
                    model: Categoria,
                    attributes: ['nombre'],
                    required: false
                }
            ]
        });
        res.status(200).json(contenidos);
    } catch (error) {
        console.error('Error retrieving content:', error);
        res.status(500).json({ error: 'Error al obtener contenidos' });
    }
};
// Obtener un contenido por ID junto con el reparto (actores) y los géneros
exports.getContentById = async (req, res) => {
    try {
        const contenido = await Contenido.findByPk(req.params.id, {
            include: [
                {
                    model: Actor,
                    through: { attributes: [] }, // Esto elimina los atributos de la tabla intermedia
                    required: false 
                },
                {
                    model: Genero,
                    through: { attributes: [] }, // Esto elimina los atributos de la tabla intermedia
                    required: false
                }
            ]
        });

        if (!contenido) return res.status(404).json({ error: 'Contenido no encontrado' });

        res.status(200).json(contenido);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener contenido' });
    }
};

// Crear un nuevo contenido
exports.createContent = async (req, res) => {
    try {
        const { titulo, categoria, poster, resumen, temporadas, trailer, genero, reparto, gen, busqueda } = req.body;

        // Obtener o crear la categoría
        const [categoriaResult] = await Categoria.findOrCreate({ where: { nombre: categoria } });

        // Crear el contenido con los campos adicionales
        const contenido = await Contenido.create({
            titulo,
            categoria_id: categoriaResult.id,
            poster,
            resumen,
            temporadas,
            trailer,
            gen,
            busqueda
        });

        // Asociar géneros
        if (genero && genero.length > 0) {
            const generosArray = genero.split(',').map(g => g.trim());
            const generos = await Promise.all(generosArray.map(g => Genero.findOrCreate({ where: { nombre: g } })));
            await contenido.addGeneros(generos.map(([gen]) => gen));
        }

        // Asociar actores
        if (reparto && reparto.length > 0) {
            const repartoArray = reparto.split(',').map(actor => actor.trim());
            const actores = await Promise.all(repartoArray.map(a => Actor.findOrCreate({ where: { nombre: a } })));
            await contenido.addActors(actores.map(([act]) => act));
        }

        // Obtener el contenido completo con asociaciones
        const contenidoCompleto = await Contenido.findByPk(contenido.id, {
            include: [
                { model: Categoria, attributes: ['nombre'] },
                { model: Genero, through: { attributes: [] }, attributes: ['nombre'] },
                { model: Actor, through: { attributes: [] }, attributes: ['nombre'] }
            ]
        });

        res.status(201).json({ message: 'Contenido creado con éxito', contenido: contenidoCompleto });
    } catch (error) {
        console.error('Error al crear contenido:', error);
        res.status(500).json({ error: 'Error al crear el contenido' });
    }
};


// Actualizar un contenido por ID
exports.updateContent = async (req, res) => {
    try {
        const { titulo, categoria, poster, resumen, temporadas, trailer, genero, reparto, gen, busqueda } = req.body;

        // Buscar el contenido existente
        const contenido = await Contenido.findByPk(req.params.id);
        if (!contenido) {
            return res.status(404).json({ error: 'Contenido no encontrado' });
        }

        // Actualizar los campos básicos del contenido
        await contenido.update({
            titulo,
            poster,
            resumen,
            temporadas,
            trailer,
            gen,
            busqueda
        });

        // Actualizar la categoría
        if (categoria) {
            const [categoriaResult] = await Categoria.findOrCreate({ where: { nombre: categoria } });
            contenido.categoria_id = categoriaResult.id;
            await contenido.save();
        }

        // Actualizar géneros (eliminar los antiguos y agregar los nuevos)
        if (genero) {
            const generosArray = genero.split(',').map(g => g.trim());
            const generos = await Promise.all(generosArray.map(g => Genero.findOrCreate({ where: { nombre: g } })));
            await contenido.setGeneros(generos.map(([gen]) => gen)); // Reemplaza los géneros actuales con los nuevos
        }

        // Actualizar actores (eliminar los antiguos y agregar los nuevos)
        if (reparto) {
            const repartoArray = reparto.split(',').map(actor => actor.trim());
            const actores = await Promise.all(repartoArray.map(a => Actor.findOrCreate({ where: { nombre: a } })));
            await contenido.setActors(actores.map(([act]) => act)); // Reemplaza los actores actuales con los nuevos
        }

        // Obtener el contenido actualizado con todas sus relaciones
        const updatedContent = await Contenido.findByPk(req.params.id, {
            include: [
                { model: Categoria, attributes: ['nombre'] },
                { model: Genero, through: { attributes: [] }, attributes: ['nombre'] },
                { model: Actor, through: { attributes: [] }, attributes: ['nombre'] }
            ]
        });

        res.status(200).json({ message: 'Contenido actualizado con éxito', contenido: updatedContent });
    } catch (error) {
        console.error('Error al actualizar contenido:', error);
        res.status(500).json({ error: 'Error al actualizar contenido' });
    }
};

// Eliminar un contenido por ID
exports.deleteContent = async (req, res) => {
    try {
        const deleted = await Contenido.destroy({ where: { id: req.params.id } });
        if (deleted) return res.status(204).send();
        res.status(404).json({ error: 'Contenido no encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar contenido' });
    }
};



// función para filtrar contenido
exports.filterContent = async (req, res) => {
    const { titulo, genero, categoria } = req.query;  // Obtener filtros de los parámetros de consulta
    const whereClause = {};

    // Agregar condición de título si el parámetro existe
    if (titulo) {
        whereClause.titulo = { [Op.like]: `%${titulo}%` };
    }

    // Configurar la sección de include para filtrar por género y categoría
    const include = [
        {
            model: Actor,
            through: { attributes: [] }, // Oculta atributos de la tabla intermedia
            required: false // Incluye el contenido incluso si no tiene actores asociados
        },
        {
            model: Genero,
            through: { attributes: [] }, // Oculta atributos de la tabla intermedia
            where: genero ? { nombre: { [Op.like]: `%${genero}%` } } : undefined,
            required: !!genero // Solo incluye géneros si se proporcionó el filtro de género
        },
        {
            model: Categoria,
            where: categoria ? { nombre: { [Op.like]: `%${categoria}%` } } : undefined,
            required: !!categoria // Solo incluye categorías si se proporcionó el filtro de categoría
        }
    ];

    try {
        // Realizar la búsqueda con las condiciones y relaciones
        const contenidos = await Contenido.findAll({
            where: whereClause,
            include
        });
        
        // Verificar si se encontraron resultados
        if (contenidos.length === 0) {
            return res.status(404).json({ error: 'No se encontraron contenidos que coincidan con los criterios de búsqueda.' });
        }

        res.status(200).json(contenidos);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar contenidos' });
    }
};