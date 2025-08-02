const express = require('express');
const notificationController = require('../controllers/notificationController');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const {
  createNotificationValidator,
} = require('../validators/notificationValidators');

// Objeto de documentação para as rotas de notificações
const notificationDocs = {
  '/notifications': {
    get: {
      tags: ['Notifications'],
      summary: '(Admin) Lista todas as notificações agendadas e enviadas',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': { description: 'Lista de notificações.' },
        '403': { description: 'Acesso negado.' },
      },
    },
    post: {
      tags: ['Notifications'],
      summary: '(Admin) Agenda uma nova notificação (Push e/ou WhatsApp)',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Um nome interno para a notificação.' },
                botContent: { type: 'string', description: 'O conteúdo a ser enviado para o WhatsApp.' },
                appContent: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    body: { type: 'string' },
                  },
                },
                targetGroups: { type: 'array', items: { type: 'string' }, description: 'Lista de IDs de grupos do WhatsApp para enviar a mensagem.' },
                scheduledAt: { type: 'string', format: 'date-time', description: 'A data e hora para enviar a notificação (formato ISO 8601).' },
                repeats: { type: 'string', enum: ['once', 'weekly'], description: 'Frequência de repetição.' },
              },
            },
          },
        },
      },
      responses: {
        '201': { description: 'Notificação agendada com sucesso.' },
        '403': { description: 'Acesso negado.' },
      },
    },
  },
};

// Esta função configura o router
const configureRouter = (router) => {
  router.get(
    '/',
    [verifyFirebaseToken, checkRole(['admin'])],
    notificationController.listNotifications
  );
  router.post(
    '/',
    [verifyFirebaseToken, checkRole(['admin'])],
    createNotificationValidator,
    notificationController.createNotification
  );
};

module.exports = {
  configureRouter,
  docs: notificationDocs,
};