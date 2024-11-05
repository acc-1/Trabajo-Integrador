const express = require('express');
const router = express.Router();
const contenidoController = require('../controllers/contenidoController');

// Rutas para CRUD
router.get('/', contenidoController.getAllContent);
router.get('/search', contenidoController.filterContent);
router.get('/:id', contenidoController.getContentById);
router.post('/', contenidoController.createContent);
router.put('/:id', contenidoController.updateContent);
router.delete('/:id', contenidoController.deleteContent);

module.exports = router;
