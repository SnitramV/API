// Ficheiro: API LIVE/routes/bot.js (VERSÃO CORRIGIDA E MODERNIZADA)

const express = require('express');
const router = express.Router();

// Importar controladores e middlewares
const { syncGroups, listGroups } = require('../controllers/botController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Aplica a verificação de admin a todas as rotas de bot
router.use(authMiddleware);
router.use(adminMiddleware);


// --- DEFINIÇÃO DAS ROTAS DO BOT ---

// Rota para sincronizar os grupos do WhatsApp com o Firestore
router.post('/sync-groups', syncGroups);

// Rota para listar os grupos já sincronizados
router.get('/list-groups', listGroups);


// --- DOCUMENTAÇÃO SWAGGER ---
const docs = {
    
        '/bot/sync-groups': {
            post: {
                summary: '(Admin) Sincroniza grupos do WhatsApp para o Firestore',
                tags: ['Bot'],
                security: [{ bearerAuth: [] }],
                responses: { 
                    '200': { description: 'Grupos sincronizados' },
                    '500': { description: 'Falha na sincronização' }
                }
            }
        },
        '/bot/list-groups': {
            get: {
                summary: '(Admin) Lista os grupos de WhatsApp sincronizados',
                tags: ['Bot'],
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: 'Lista de grupos' } }
            }
        }
    
};

// Exportamos o router e os docs no formato esperado pelo app.js
module.exports = {
    router,
    docs
};