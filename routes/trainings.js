// Ficheiro: API LIVE/routes/trainings.js (VERSÃO CORRIGIDA)

const express = require('express');
const router = express.Router();

// Importar o controlador e os middlewares
const {
    createTraining,
    getUpcomingTrainings,
    deleteTraining
} = require('../controllers/trainingController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware'); // Agora este ficheiro existe

// --- DEFINIÇÃO DAS ROTAS DE TREINOS ---

router.get('/', getUpcomingTrainings);

router.post(
    '/',
    authMiddleware,
    roleMiddleware(['admin', 'coach']), // Esta linha agora funciona
    createTraining
);

router.delete(
    '/:trainingId',
    authMiddleware,
    roleMiddleware(['admin', 'coach']), // E esta também
    deleteTraining
);


// --- DOCUMENTAÇÃO SWAGGER (continua igual) ---
const docs = { /* ... */ };

module.exports = {
    router,
    docs,
};