const express = require('express');
const botController = require('../controllers/botController');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

// Objeto de documentação para as rotas do bot
const botDocs = {
  '/bot/sync-groups': {
    post: {
      tags: ['Bot'],
      summary: '(Admin) Sincroniza os grupos do WhatsApp para o Firestore',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Grupos sincronizados com sucesso.',
        },
        '500': {
          description: 'Falha na sincronização.',
        },
      },
    },
  },
  '/bot/groups': {
    get: {
      tags: ['Bot'],
      summary: '(Admin) Lista os grupos do WhatsApp já sincronizados no Firestore',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Lista de grupos sincronizados.',
        },
      },
    },
  },
};

// Esta função configura o router
const configureRouter = (router) => {
  router.post(
    '/sync-groups',
    [verifyFirebaseToken, checkRole(['admin'])],
    botController.syncGroups
  );

  router.get(
    '/groups',
    [verifyFirebaseToken, checkRole(['admin'])],
    botController.listGroups
  );
};

module.exports = {
  configureRouter,
  docs: botDocs,
};