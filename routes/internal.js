const express = require('express');
const internalController = require('../controllers/internalController');

// Objeto de documentação para as rotas internas
const internalDocs = {
  '/internal/bot/get-user-data': {
    post: {
      tags: ['Internal'],
      summary: '(Interno) Endpoint para o bot do WhatsApp buscar dados de um utilizador',
      description: 'Este endpoint deve ser protegido na rede e não exposto publicamente.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                whatsappId: { type: 'string', description: 'O ID do utilizador no WhatsApp (ex 551399...Cus).' },
              },
            },
          },
        },
      },
      responses: {
        '200': { description: 'Dados do utilizador e do seu último pedido.' },
        '404': { description: 'Utilizador não encontrado.' },
      },
    },
  },
};

// Esta função configura o router
const configureRouter = (router) => {
  router.post('/bot/get-user-data', internalController.getBotUserData);
};

module.exports = {
  configureRouter,
  docs: internalDocs,
};