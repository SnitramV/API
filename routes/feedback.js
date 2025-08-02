const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');
const { createSuggestionValidator } = require('../validators/feedbackValidators');

// Objeto de documentação para as rotas de feedback
const feedbackDocs = {
  '/feedback/suggestion': {
    post: {
      tags: ['Feedback'],
      summary: 'Envia uma nova sugestão para a gestão',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['suggestion', 'isAnonymous'],
              properties: {
                suggestion: { type: 'string', description: 'O texto da sugestão.' },
                isAnonymous: { type: 'boolean', description: 'Indica se a sugestão deve ser anónima.' },
              },
            },
          },
        },
      },
      responses: {
        '201': { description: 'Sugestão enviada com sucesso.' },
        '400': { description: 'Dados inválidos.' },
      },
    },
  },
};

// Esta função configura o router
const configureRouter = (router) => {
  router.post(
    '/suggestion',
    verifyFirebaseToken,
    createSuggestionValidator,
    feedbackController.createSuggestion
  );
};

module.exports = {
  configureRouter,
  docs: feedbackDocs,
};