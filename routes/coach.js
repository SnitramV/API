// Ficheiro: API LIVE/routes/coach.js

const express = require('express');
const { scheduleTraining, broadcastToTeam } = require('../controllers/coachController');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');
const { isCoach } = require('../middleware/coachMiddleware');

const docs = {}; // Para documentação futura

const configureRouter = (router) => {
    // Todas as rotas aqui exigem que o utilizador esteja logado e seja um treinador (ou admin)
    router.use(verifyFirebaseToken, isCoach);

    router.post('/trainings', scheduleTraining);
    router.post('/broadcast', broadcastToTeam);
};

module.exports = {
    docs,
    configureRouter,
};