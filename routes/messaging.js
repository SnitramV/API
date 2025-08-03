// Ficheiro: API LIVE/routes/messaging.js (VERSÃO CORRIGIDA E MODERNIZADA)

const express = require('express');
const router = express.Router();

// Importar o controlador e os middlewares necessários
const { scheduleTraining, broadcastMessage } = require('../controllers/messagingController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware'); // ou coachMiddleware, dependendo da regra

// Aplica a autenticação a todas as rotas de mensagens
router.use(authMiddleware);

// --- DEFINIÇÃO DAS ROTAS DE MENSAGENS ---

// Rota para agendar uma mensagem de treino (exige permissão de admin/coach)
router.post('/schedule-training', adminMiddleware, scheduleTraining);

// Rota para enviar uma mensagem de broadcast (exige permissão de admin/coach)
router.post('/broadcast', adminMiddleware, broadcastMessage);


// --- DOCUMENTAÇÃO SWAGGER ---
const docs = {
    
        '/messaging/schedule-training': {
            post: {
                summary: '(Admin/Coach) Envia uma mensagem de agendamento de treino',
                tags: ['Mensagens'],
                security: [{ bearerAuth: [] }],
                requestBody: { content: { 'application/json': { schema: { properties: {
                    groupId: { type: 'string' },
                    sport: { type: 'string' },
                    day: { type: 'string' },
                    time: { type: 'string' },
                    location: { type: 'string' },
                    gender: { type: 'string' }
                } } } } },
                responses: { '200': { description: 'Mensagem enviada' } }
            }
        },
        '/messaging/broadcast': {
            post: {
                summary: '(Admin/Coach) Envia uma mensagem de broadcast para um grupo',
                tags: ['Mensagens'],
                security: [{ bearerAuth: [] }],
                requestBody: { content: { 'application/json': { schema: { properties: {
                    groupId: { type: 'string' },
                    message: { type: 'string' }
                } } } } },
                responses: { '200': { description: 'Mensagem enviada' } }
            }
        }
    
};

// Exportamos o router e os docs no formato esperado pelo app.js
module.exports = {
    router,
    docs,
};