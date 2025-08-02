const express = require('express');
const newsController = require('../controllers/newsController');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const { createNewsValidator } = require('../validators/newsValidators');

// Objeto de documentação para as rotas de notícias
const newsDocs = {
  '/news': {
    get: {
      tags: ['News'],
      summary: 'Retorna a lista de todas as notícias',
      responses: {
        '200': {
          description: 'Lista de notícias obtida com sucesso.',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', description: 'O ID da notícia.' },
                    title: { type: 'string', description: 'O título da notícia.' },
                    content: { type: 'string', description: 'O conteúdo da notícia.' },
                    createdAt: { type: 'string', format: 'date-time', description: 'A data de criação da notícia.' },
                  },
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ['News'],
      summary: 'Cria uma nova notícia',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['title', 'content'],
              properties: {
                title: { type: 'string', description: 'O título para a nova notícia.' },
                content: { type: 'string', description: 'O conteúdo da nova notícia.' },
                imageUrl: { type: 'string', description: 'URL de uma imagem para a notícia (opcional).' },
              },
            },
          },
        },
      },
      responses: {
        '201': { description: 'Notícia criada com sucesso.' },
        '400': { description: 'Dados inválidos fornecidos.' },
        '401': { description: 'Não autorizado (token em falta ou inválido).' },
        '403': { description: 'Acesso negado (utilizador não é admin).' },
      },
    },
  },
  '/news/{newsId}': {
    delete: {
      tags: ['News'],
      summary: 'Apaga uma notícia específica',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'newsId',
          schema: { type: 'string' },
          required: true,
          description: 'O ID da notícia a ser apagada.',
        },
      ],
      responses: {
        '200': { description: 'Notícia apagada com sucesso.' },
        '404': { description: 'Notícia não encontrada.' },
        '401': { description: 'Não autorizado.' },
        '403': { description: 'Acesso negado.' },
      },
    },
  },
};

// Esta função configura o router
const configureRouter = (router) => {
  router.get('/', newsController.getAllNews);
  router.post(
    '/',
    [verifyFirebaseToken, checkRole(['admin'])],
    createNewsValidator,
    newsController.createNews
  );
  router.delete(
    '/:newsId',
    [verifyFirebaseToken, checkRole(['admin'])],
    newsController.deleteNews
  );
};

module.exports = {
  configureRouter,
  docs: newsDocs,
};