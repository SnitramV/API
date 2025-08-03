// Ficheiro: APIv10/routes/events.js (VERSÃO CORRIGIDA)

const express = require('express');
const router = express.Router();

// Controladores e Validadores
const eventController = require('../controllers/eventController');
const { createEventValidator, checkInValidator } = require('../validators/eventValidators');

// Middlewares
const validationHandler = require('../middleware/validationHandler');
const authMiddleware = require('../middleware/authMiddleware'); // <-- ADICIONADO
const adminMiddleware = require('../middleware/adminMiddleware'); // <-- ADICIONADO

// Rota para listar eventos públicos (sem autenticação)
router.get('/', eventController.listPublicEvents);

// Rota para criar um novo evento (protegida, apenas para admins)
router.post(
    '/create',
    authMiddleware,
    adminMiddleware,
    createEventValidator,
    validationHandler,
    eventController.createEvent
);

// Rota para um utilizador fazer check-in num evento (protegida)
router.post(
    '/:eventId/checkin',
    authMiddleware,
    checkInValidator,
    validationHandler,
    eventController.checkInToEvent
);

// Rota para apagar um evento (protegida, apenas para admins)
router.delete(
    '/:eventId',
    authMiddleware,
    adminMiddleware,
    eventController.deleteEvent
);

module.exports = router;