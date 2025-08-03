// Ficheiro: API LIVE/routes/coach.js (VERSÃO FINAL CORRIGIDA)

const express = require('express');
const router = express.Router();

// Importa apenas as funções que existem no seu controlador
const { scheduleTraining, broadcastToTeam } = require('../controllers/coachController');

// Importa os middlewares que você precisa
const authMiddleware = require('../middleware/authMiddleware');
const coachMiddleware = require('../middleware/coachMiddleware');


// --- MIDDLEWARES GLOBAIS PARA ESTAS ROTAS ---
// Aplica a autenticação e a verificação de 'coach' a todas as rotas abaixo.
router.use(authMiddleware);
router.use(coachMiddleware);


// --- DEFINIÇÃO DAS ROTAS ---

// Rota para agendar um novo treino. Corresponde à função 'scheduleTraining'.
router.post('/trainings', scheduleTraining);

// Rota para enviar uma mensagem para a equipa. Corresponde à função 'broadcastToTeam'.
router.post('/broadcast', broadcastToTeam);


// --- DOCUMENTAÇÃO SWAGGER ---
// Apenas documentamos as rotas que existem
const docs = {
  
    '/coach/trainings': {
      post: {
        summary: 'Coach agenda um novo treino',
        tags: ['Coach'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: {
            type: 'object',
            properties: {
              title: { type: 'string', example: 'Treino de Passe' },
              date: { type: 'string', format: 'date-time' },
              location: { type: 'string', example: 'Campo Principal' },
              description: { type: 'string', example: 'Foco em posse de bola.' }
            }
          }}}
        },
        responses: { '201': { description: 'Treino agendado' } }
      }
    },
    '/coach/broadcast': {
      post: {
        summary: 'Coach envia uma mensagem para a equipa',
        tags: ['Coach'],
        security: [{ bearerAuth: [] }],
         requestBody: {
          required: true,
          content: { 'application/json': { schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Lembrete: treino amanhã às 18h.' }
            }
          }}}
        },
        responses: { '200': { description: 'Mensagem enviada' } }
      }
    }
  
};

// Exportamos o router e os docs, como esperado pelo app.js
module.exports = {
    router,
    docs
};