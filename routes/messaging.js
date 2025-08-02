const express = require('express');
const messagingController = require('../controllers/messagingController');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const {
  scheduleTrainingValidator,
  broadcastValidator,
} = require('../validators/messagingValidators');

// Objeto de documentação para as rotas de mensagens
const messagingDocs = {
  '/messaging/schedule-training': {
    post: {
      tags: ['Messaging'],
      summary: '(Admin/Coach) Envia um anúncio de treino para um grupo do WhatsApp',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                groupId: { type: 'string', description: 'O ID do grupo do WhatsApp (ex 12345@g.us).' },
                sport: { type: 'string' },
                day: { type: 'string' },
                time: { type: 'string' },
                location: { type: 'string' },
                gender: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        '200': { description: 'Anúncio de treino enviado com sucesso.' },
        '403': { description: 'Acesso negado.' },
      },
    },
  },
  '/messaging/broadcast': {
    post: {
      tags: ['Messaging'],
      summary: '(Admin/Member) Envia uma mensagem de broadcast para um grupo do WhatsApp',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                groupId: { type: 'string', description: 'O ID do grupo do WhatsApp.' },
                message: { type: 'string', description: 'A mensagem a ser enviada.' },
              },
            },
          },
        },
      },
      responses: {
        '200': { description: 'Broadcast enviado com sucesso.' },
        '403': { description: 'Acesso negado.' },
      },
    },
  },
};

// Esta função configura o router, garantindo que os controllers já foram carregados.
const configureRouter = (router) => {
  router.post(
    '/schedule-training',
    [verifyFirebaseToken, checkRole(['admin', 'coach'])],
    scheduleTrainingValidator,
    messagingController.scheduleTraining
  );

  router.post(
    '/broadcast',
    [verifyFirebaseToken, checkRole(['admin', 'member'])],
    broadcastValidator,
    messagingController.broadcastMessage
  );
};

module.exports = {
  configureRouter,
  docs: messagingDocs,
};