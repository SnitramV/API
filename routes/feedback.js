// Ficheiro: API LIVE/routes/feedback.js (VERSÃO CORRIGIDA E MODERNIZADA)

const express = require('express');
const router = express.Router();

// Importar o controlador e middlewares
const { createSuggestion } = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');

// --- DEFINIÇÃO DA ROTA DE FEEDBACK ---

// A rota para criar uma sugestão precisa de autenticação
router.post('/suggest', authMiddleware, createSuggestion);


// --- DOCUMENTAÇÃO SWAGGER ---
const docs = {
    
        '/feedback/suggest': {
            post: {
                summary: 'Envia uma sugestão ou feedback',
                tags: ['Feedback'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: {
                        type: 'object',
                        properties: {
                            suggestion: { type: 'string', description: 'O texto da sugestão.' },
                            isAnonymous: { type: 'boolean', description: 'Marcar se a sugestão é anónima.' }
                        }
                    } } }
                },
                responses: {
                    '201': { description: 'Sugestão enviada com sucesso.' }
                }
            }
        }
    
};

// Exportamos o router e os docs no formato esperado pelo app.js
module.exports = {
    router,
    docs,
};