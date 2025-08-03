// Ficheiro: API LIVE/routes/notifications.js (VERSÃO CORRIGIDA E MODERNIZADA)

const express = require('express');
const router = express.Router();

// Importar o controlador e os middlewares necessários
const { createNotification, listNotifications } = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Aplica a verificação de admin a todas as rotas deste ficheiro
router.use(authMiddleware);
router.use(adminMiddleware);


// --- DEFINIÇÃO DAS ROTAS DE NOTIFICAÇÕES ---

// Rota para listar todas as notificações agendadas
router.get('/', listNotifications);

// Rota para criar (agendar) uma nova notificação
router.post('/', createNotification);


// --- DOCUMENTAÇÃO SWAGGER ---
const docs = {
    
        '/notifications': {
            get: {
                summary: '(Admin) Lista todas as notificações',
                tags: ['Notificações'],
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: 'Lista de notificações' } }
            },
            post: {
                summary: '(Admin) Agenda uma nova notificação',
                tags: ['Notificações'],
                security: [{ bearerAuth: [] }],
                requestBody: { content: { 'application/json': { schema: { properties: {
                    name: { type: 'string' },
                    botContent: { type: 'string' },
                    appContent: { type: 'string' },
                    targetGroups: { type: 'array', items: { type: 'string' } },
                    scheduledAt: { type: 'string', format: 'date-time' },
                    repeats: { type: 'string' }
                } } } } },
                responses: { '201': { description: 'Notificação agendada' } }
            }
        }
    
};

// Exportamos o router e os docs no formato esperado pelo app.js
module.exports = {
    router,
    docs,
};