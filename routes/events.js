// Ficheiro: API LIVE/routes/events.js (VERSÃO COM ROTA DE CHECK-IN)

const express = require('express');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const { createEventValidator, checkInValidator } = require('../validators/eventValidators');
// A importação do controller agora inclui a nova função
const eventController = require('../controllers/eventController');

const eventDocs = {
    '/events': { 
        get: { 
            tags: ['Events'], 
            summary: 'Lista os eventos públicos da planilha do Google Sheets', 
            responses: { '200': { description: 'Lista de eventos públicos.' } } 
        } 
    },
    '/events/create': { 
        post: { 
            tags: ['Events'], 
            summary: '(Admin) Cria um novo evento para check-in via QR Code', 
            security: [{ bearerAuth: [] }], 
            requestBody: { 
                required: true, 
                content: { 'application/json': { schema: { 
                    type: 'object', 
                    required: ['name', 'date', 'points'], 
                    properties: { 
                        name: { type: 'string' }, 
                        date: { type: 'string', format: 'date' }, 
                        points: { type: 'integer' } 
                    } 
                } } } 
            }, 
            responses: { 
                '201': { description: 'Evento criado com sucesso.' }, 
                '403': { description: 'Acesso negado.' } 
            } 
        } 
    },
    // --- DOCUMENTAÇÃO PARA A ROTA DE CHECK-IN ---
    '/events/{eventId}/checkin': { 
        post: { 
            tags: ['Events'], 
            summary: 'Realiza o check-in de um utilizador num evento', 
            security: [{ bearerAuth: [] }], 
            parameters: [{ in: 'path', name: 'eventId', required: true, schema: { type: 'string' }, description: 'O ID do evento (obtido a partir do QR Code).' }], 
            responses: { 
                '200': { description: 'Check-in realizado com sucesso.' }, 
                '400': { description: 'Erro de negócio (ex: já fez check-in, evento expirado).' },
                '401': { description: 'Não autorizado (token inválido ou em falta).' }
            } 
        } 
    },
};

const configureRouter = () => {
  const router = express.Router();
  
  // Rotas existentes
  router.get('/', eventController.listPublicEvents);
  router.post('/create', [verifyFirebaseToken, checkRole(['admin'])], createEventValidator, eventController.createEvent);
  router.delete('/:eventId', authMiddleware, adminMiddleware, eventController.deleteEvent);

  // --- NOVA ROTA PARA O CHECK-IN ---
  // Qualquer utilizador autenticado pode aceder
  router.post('/:eventId/checkin', verifyFirebaseToken, checkInValidator, eventController.checkInToEvent);
  
  return router;
};

module.exports = {
  configureRouter,
  docs: eventDocs,
};